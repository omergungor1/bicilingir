import { getSupabaseServer } from "../../../../../lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const supabase = getSupabaseServer();
        const { locksmithId, amount } = await request.json();

        if (!locksmithId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Geçersiz bakiye yükleme isteği' }, { status: 400 });
        }

        // Bakiye yükleme işlemi
        const { error: transactionError } = await supabase
            .from('locksmith_transactions')
            .insert({
                locksmith_id: locksmithId,
                amount: amount,
                transaction_type: 'manual_topup',
                description: 'Admin panelinden manuel bakiye yükleme'
            });

        if (transactionError) throw transactionError;


        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Bakiye yükleme hatası:', error);
        return NextResponse.json({ error: 'Bakiye yüklenemedi' }, { status: 500 });
    }
} 