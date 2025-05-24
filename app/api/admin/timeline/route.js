import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const supabase = getSupabaseServer();
        const searchParams = new URL(request.url).searchParams;
        const date = searchParams.get('date');

        if (!date) {
            return NextResponse.json({ error: 'Tarih parametresi gerekli' }, { status: 400 });
        }

        // Seçili günün başlangıç ve bitiş tarihleri
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        // Call requests ve whatsapp mesajlarını çek
        const { data: activities, error } = await supabase
            .from('user_activity_logs')
            .select(`
                id,
                activitytype,
                createdat,
                locksmiths:locksmithid (
                    id,
                    businessname,
                    provinces (
                        name
                    ),
                    districts!locksmiths_districtid_fkey (
                        name
                    )
                )
            `)
            .in('activitytype', ['call_request', 'whatsapp_message'])
            .gte('createdat', startDate.toISOString())
            .lte('createdat', endDate.toISOString())
            .order('createdat', { ascending: false });

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Timeline verisi alınırken hata:', error);
        return NextResponse.json({ error: 'Timeline verisi alınamadı' }, { status: 500 });
    }
} 