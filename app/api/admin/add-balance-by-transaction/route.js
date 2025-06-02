import { getSupabaseServer } from "../../../../lib/supabase";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();

        const { transactionCode, amount } = await request.json();

        if (!transactionCode || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Geçersiz işlem kodu veya miktar' }, { status: 400 });
        }

        console.log(transactionCode, amount, 'transactionCode, amount');

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

        //eski balance
        const { data: oldBalance, error: oldBalanceError } = await supabase
            .from('locksmith_balances')
            .select('balance')
            .eq('locksmith_id', locksmithDetail.locksmithid)
            .single();

        if (oldBalanceError || !oldBalance) {
            return NextResponse.json({ error: 'Eski bakiye bulunamadı' }, { status: 404 });
        }

        //yeni balance
        const newBalance = oldBalance.balance + amount;

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
            message: `${locksmith.businessname} (${locksmith.fullname}) hesabına ${amount}₺ bakiye yüklenmiştir. Güncel bakiye: ${newBalance}₺`,
            success: true
        });

    } catch (error) {
        console.error('Bakiye yükleme hatası:', error);
        return NextResponse.json({ error: 'İşlem sırasında bir hata oluştu' }, { status: 500 });
    }
} 