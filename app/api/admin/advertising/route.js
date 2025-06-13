import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const supabase = getSupabaseServer();
        const { searchParams } = new URL(request.url);
        const provinceId = searchParams.get('provinceId');
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

        if (!provinceId) {
            return NextResponse.json({ error: 'Province ID gerekli' }, { status: 400 });
        }

        // İlçeleri çek
        const { data: districts, error: districtsError } = await supabase
            .from('districts')
            .select('*')
            .eq('province_id', provinceId)
            .order('name');

        if (districtsError) throw districtsError;

        // Çilingirleri çek
        const { data: locksmiths, error: locksmithsError } = await supabase
            .from('locksmiths')
            .select(`
                *,
                districts!locksmiths_districtid_fkey (
                    id,
                    name
                ),
                locksmith_balances (
                    balance,
                    daily_spent_limit,
                    suggested_daily_limit
                )
            `)
            .eq('provinceid', provinceId)
            .eq('isactive', true)
            .eq('status', 'approved');

        if (locksmithsError) throw locksmithsError;

        // Seçili gün için reklam harcamalarını çek
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data: adSpends, error: adSpendsError } = await supabase
            .from('locksmith_transactions')
            .select('locksmith_id, amount')
            .eq('transaction_type', 'ad_spend')
            .gte('created_at', startOfDay.toISOString())
            .lte('created_at', endOfDay.toISOString());

        if (adSpendsError) throw adSpendsError;

        // Reklam harcamalarını işle
        const adSpendsByLocksmith = {};
        adSpends?.forEach(spend => {
            adSpendsByLocksmith[spend.locksmith_id] = (adSpendsByLocksmith[spend.locksmith_id] || 0) + Math.abs(spend.amount);
        });

        // Aktivite loglarını çek
        const { data: activityLogs, error: activityLogsError } = await supabase
            .from('user_activity_logs')
            .select('locksmithid, activitytype')
            .gte('createdat', startOfDay.toISOString())
            .lte('createdat', endOfDay.toISOString())
            .in('activitytype', ['locksmith_list_view', 'call_request', 'whatsapp_message']);

        if (activityLogsError) throw activityLogsError;

        // Aktivite loglarını işle
        const activityStats = {};
        activityLogs.forEach(log => {
            if (!activityStats[log.locksmithid]) {
                activityStats[log.locksmithid] = {
                    list_views: 0,
                    calls: 0,
                    whatsapp: 0
                };
            }

            switch (log.activitytype) {
                case 'locksmith_list_view':
                    activityStats[log.locksmithid].list_views++;
                    break;
                case 'call_request':
                    activityStats[log.locksmithid].calls++;
                    break;
                case 'whatsapp_message':
                    activityStats[log.locksmithid].whatsapp++;
                    break;
            }
        });

        // İlçelere göre çilingirleri grupla ve reklam harcamalarını ekle
        const districtData = districts.map(district => {
            const districtLocksmiths = locksmiths.filter(l => l.districtid === district.id).map(l => ({
                ...l,
                activity: activityStats[l.id] || {
                    list_views: 0,
                    calls: 0,
                    whatsapp: 0
                },
                daily_ad_spend: adSpendsByLocksmith[l.id] || 0
            }));

            return {
                ...district,
                locksmiths: districtLocksmiths
            };
        });

        return NextResponse.json({
            success: true,
            data: districtData
        });

    } catch (error) {
        console.error('Reklam verisi alınırken hata:', error);
        return NextResponse.json({ error: 'Reklam verisi alınamadı' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();
        const body = await request.json();
        const { locksmithId, suggestedDailyLimit, adSpendAmount } = body;

        if (!locksmithId || (suggestedDailyLimit === undefined && adSpendAmount === undefined)) {
            return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
        }

        // Önerilen limit güncellemesi
        if (suggestedDailyLimit !== undefined) {
            const { error: updateError } = await supabase
                .from('locksmith_balances')
                .update({
                    suggested_daily_limit: suggestedDailyLimit
                })
                .eq('locksmith_id', locksmithId);

            if (updateError) throw updateError;
        }

        // Reklam harcaması ekleme
        if (adSpendAmount !== undefined && adSpendAmount > 0) {
            const { error: transactionError } = await supabase
                .from('locksmith_transactions')
                .insert({
                    locksmith_id: locksmithId,
                    amount: -Math.abs(adSpendAmount), // Negatif değer olarak kaydet
                    transaction_type: 'ad_spend',
                    description: 'Günlük reklam harcaması',
                });

            if (transactionError) throw transactionError;
        }

        return NextResponse.json({
            success: true,
            message: 'Reklam bilgileri güncellendi'
        });

    } catch (error) {
        console.error('Reklam bilgileri güncellenirken hata:', error);
        return NextResponse.json({ error: 'Reklam bilgileri güncellenemedi' }, { status: 500 });
    }
} 