import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();

        const { transactionCode, amount } = await request.json();

        if (!transactionCode || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Geçersiz işlem kodu veya miktar' }, { status: 400 });
        }

        // Transaction code'a göre çilingir detayını bul
        const { data: locksmithDetail, error: detailError } = await supabase
            .from('locksmith_details')
            .select('locksmithid')
            .eq('transaction_code', transactionCode)
            .single();

        if (detailError || !locksmithDetail) {
            return NextResponse.json({ error: 'İşlem kodu bulunamadı' }, { status: 404 });
        }

        // Çilingir bilgilerini al
        const { data: locksmith, error: locksmithError } = await supabase
            .from('locksmiths')
            .select('businessname, fullname')
            .eq('id', locksmithDetail.locksmithid)
            .single();

        if (locksmithError || !locksmith) {
            return NextResponse.json({ error: 'Çilingir bilgileri bulunamadı' }, { status: 404 });
        }

        // Transactions tablosuna kayıt ekle
        const { error: transactionError } = await supabase
            .from('locksmith_transactions')
            .insert([{
                locksmith_id: locksmithDetail.locksmithid,
                amount: amount,
                transaction_type: 'manual_topup'
            }]);

        if (transactionError) {
            return NextResponse.json({ error: 'İşlem kaydedilemedi' }, { status: 500 });
        }

        return NextResponse.json({
            message: `${locksmith.businessname} (${locksmith.fullname}) hesabına ${amount}₺ bakiye yüklenmiştir.`
        });

    } catch (error) {
        console.error('Bakiye yükleme hatası:', error);
        return NextResponse.json({ error: 'İşlem sırasında bir hata oluştu' }, { status: 500 });
    }
} 