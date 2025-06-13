import { NextResponse } from 'next/server';
import { getLocksmithId } from '../../../utils';

//Ödeme listesini getir
export async function GET(request) {
    try {
        const { locksmithId, supabase } = await getLocksmithId(request);

        if (!locksmithId) {
            return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
        }

        // Para yükleme taleplerini getir
        const { data: requests, error } = await supabase
            .from('locksmith_topup_requests')
            .select('*')
            .eq('locksmith_id', locksmithId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Para yükleme talepleri alınırken hata:', error);
            return NextResponse.json({ error: 'Para yükleme talepleri alınamadı' }, { status: 500 });
        }

        // İşlem durumlarını Türkçe'ye çevir
        const statusMap = {
            'pending': 'Beklemede',
            'approved': 'Onaylandı',
            'rejected': 'Reddedildi'
        };

        const formattedData = requests.map(request => ({
            ...request,
            status_tr: statusMap[request.status] || request.status,
            amount: parseFloat(request.amount).toFixed(2),
            created_at: new Date(request.created_at).toLocaleString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            processed_at: request.processed_at ? new Date(request.processed_at).toLocaleString('tr-TR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : null
        }));

        return NextResponse.json({
            requests: formattedData
        });

    } catch (error) {
        console.error('Para yükleme talepleri alınırken hata:', error);
        return NextResponse.json(
            { error: 'Para yükleme talepleri alınamadı' },
            { status: 500 }
        );
    }
}
