import { getSupabaseServer } from "../../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();
        const { spends } = await request.json();

        if (!spends || !Array.isArray(spends) || spends.length === 0) {
            return NextResponse.json({ error: 'Geçerli reklam harcaması bulunamadı' }, { status: 400 });
        }

        // Tüm harcamaları tek seferde ekle
        const transactions = spends.map(spend => ({
            locksmith_id: spend.locksmith_id,
            amount: -Math.abs(spend.amount), // Negatif değer olarak kaydet
            transaction_type: 'ad_spend',
            description: 'Günlük reklam harcaması',
        }));

        const { error: transactionError } = await supabase
            .from('locksmith_transactions')
            .insert(transactions);

        if (transactionError) throw transactionError;

        return NextResponse.json({
            success: true,
            message: 'Reklam harcamaları kaydedildi'
        });

    } catch (error) {
        console.error('Reklam harcamaları kaydedilirken hata:', error);
        return NextResponse.json({ error: 'Reklam harcamaları kaydedilemedi' }, { status: 500 });
    }
} 