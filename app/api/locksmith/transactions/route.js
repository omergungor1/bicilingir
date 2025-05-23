import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';

export async function GET(request) {
    try {
        const { locksmithId, supabase } = await checkAuth(request);

        if (!locksmithId) {
            return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
        }

        const { data: transactions, error: transactionsError } = await supabase
            .from('locksmith_transactions')
            .select('amount, created_at')
            .eq('locksmith_id', locksmithId)
            .lt('amount', 0)
            .order('created_at', { ascending: true })
            .limit(30);

        if (transactionsError) {
            throw transactionsError;
        }

        // Tarihleri formatla ve veriyi dönüştür
        const formattedData = {
            id: "Bakiye Harcama",
            data: transactions.map(tx => {
                const date = new Date(tx.created_at);
                const day = date.getDate();
                // Türkçe ay isimleri
                const months = [
                    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
                    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
                ];
                const month = months[date.getMonth()];

                return {
                    x: `${day} ${month}`,
                    y: Math.abs(tx.amount) // Negatif değerleri pozitife çevir
                }
            })
        };

        return NextResponse.json({
            transactions: formattedData
        });

    } catch (error) {
        console.error('İşlem geçmişi alınırken hata:', error);
        return NextResponse.json(
            { error: 'İşlem geçmişi alınamadı' },
            { status: 500 }
        );
    }
} 