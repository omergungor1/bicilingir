import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../../utils';

//Ödeme talebi gönder
export async function POST(request) {
    try {
        const { locksmithId, supabase } = await getLocksmithId(request);

        if (!locksmithId) {
            return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
        }

        // Request body'den bilgileri al
        const body = await request.json();
        const { amount, description } = body;

        // Validasyonlar
        if (!amount || isNaN(amount) || amount <= 0) {
            return NextResponse.json({ error: 'Geçerli bir tutar giriniz' }, { status: 400 });
        }

        // Bekleyen başka talep var mı kontrol et
        const { data: pendingRequest, error: pendingError } = await supabase
            .from('locksmith_topup_requests')
            .select('id')
            .eq('locksmith_id', locksmithId)
            .eq('status', 'pending')
            .single();

        if (pendingError && pendingError.code !== 'PGRST116') { // PGRST116: No rows returned
            console.error('Bekleyen talep kontrolü hatası:', pendingError);
            return NextResponse.json({ error: 'Talep kontrolü yapılamadı' }, { status: 500 });
        }

        if (pendingRequest) {
            return NextResponse.json({
                error: 'Zaten bekleyen bir para yükleme talebiniz bulunmaktadır'
            }, { status: 400 });
        }

        // Yeni talebi oluştur
        const { data: topupRequest, error: requestError } = await supabase
            .from('locksmith_topup_requests')
            .insert({
                locksmith_id: locksmithId,
                amount: amount,
                description: description || 'Para yükleme talebi',
                status: 'pending'
            })
            .select()
            .single();

        if (requestError) {
            console.error('Talep oluşturma hatası:', requestError);
            return NextResponse.json({ error: 'Talep oluşturulamadı' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Para yükleme talebiniz alındı',
            request: {
                ...topupRequest,
                amount: parseFloat(topupRequest.amount).toFixed(2),
                created_at: new Date(topupRequest.created_at).toLocaleString('tr-TR')
            }
        });

    } catch (error) {
        console.error('Para yükleme talebi oluşturulurken hata:', error);
        return NextResponse.json(
            { error: 'Para yükleme talebi oluşturulamadı' },
            { status: 500 }
        );
    }
} 