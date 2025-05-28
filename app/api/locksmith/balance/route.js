import { NextResponse } from 'next/server';
import { checkAuth } from '../../utils';

export async function GET(request) {
    try {
        const { locksmithId, supabase } = await checkAuth(request);

        if (!locksmithId) {
            return NextResponse.json({ error: 'Çilingir ID\'si gerekli' }, { status: 400 });
        }

        const { data: balanceData, error: balanceError } = await supabase
            .from('locksmith_balances')
            .select('balance, daily_spent_limit, suggested_daily_limit')
            .eq('locksmith_id', locksmithId)
            .single();

        if (balanceError) {
            console.error('Bakiye bilgileri alınırken hata:', balanceError);
            return NextResponse.json(
                { error: 'Bakiye bilgileri alınamadı' },
                { status: 500 }
            );
        }

        if (!balanceData) {
            return NextResponse.json({
                balance: 0,
                daily_spent_limit: 0,
                suggested_daily_limit: 0
            });
        }

        return NextResponse.json({
            balance: balanceData.balance,
            daily_spent_limit: balanceData.daily_spent_limit,
            suggested_daily_limit: balanceData.suggested_daily_limit
        });

    } catch (error) {
        console.error('Bakiye bilgileri alınırken hata:', error);
        return NextResponse.json(
            { error: 'Bakiye bilgileri alınamadı' },
            { status: 500 }
        );
    }
} 