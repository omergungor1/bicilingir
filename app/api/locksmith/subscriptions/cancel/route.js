import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function POST(request) {
    const { locksmithId, supabase } = await checkAuth(request);

    if (!locksmithId) {
        return NextResponse.json({
            error: 'Lütfen bir işletme seçiniz!',
        }, { status: 400 });
    }

    const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({ is_active: false, status: 'cancelled', end_date: new Date() })
        .eq('locksmith_id', locksmithId)
        .eq('is_active', true);

    if (subscriptionError) {
        return NextResponse.json({
            error: 'Paket iptal edilemedi',
        }, { status: 400 });
    }

    //update locksmith_traffic
    const { data: locksmithTrafficData, error: locksmithTrafficError } = await supabase
        .from('locksmith_traffic')
        .update({ multiplier: 0.01, priority: 1 })
        .eq('locksmith_id', locksmithId)

    if (locksmithTrafficError) {
        return NextResponse.json({
            error: 'Locksmith traffic güncellenemedi',
        }, { status: 400 });
    }

    return NextResponse.json({
        message: 'Paket iptal edildi',
    }, { status: 200 });
}