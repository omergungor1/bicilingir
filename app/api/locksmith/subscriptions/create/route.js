import { NextResponse } from 'next/server';
import { checkAuth } from '../../../utils';

export async function POST(request) {
    const { locksmithId, supabase } = await checkAuth(request);

    const { packageId, purchaseNote } = await request.json();

    console.log(packageId, locksmithId, purchaseNote);

    if (!packageId) {
        return NextResponse.json({
            error: 'Paket seçilmemiş!',
        }, { status: 400 });
    }

    const { data: packageData, error: packageError } = await supabase
        .from('packages')
        .select('price, name')
        .eq('id', packageId)
        .single();

    if (packageError) {
        return NextResponse.json({
            error: 'Paket bulunamadı',
        }, { status: 404 });
    }

    //Varsa eski aboneliği iptal et...
    //Admin onaylayınca abonelik iptal edilecek...
    // const { data: subscriptionData, error: subscriptionError } = await supabase
    //     .from('subscriptions')
    //     .update({ is_active: false, end_date: new Date() })
    //     .eq('locksmith_id', locksmithId)
    //     .eq('is_active', true);

    const data = {
        locksmith_id: locksmithId,
        package_id: packageId,
        package_name: packageData.name,
        price: packageData.price,
        start_date: null,
        end_date: null,
        is_active: false,
        status: 'pending',
        admin_note: purchaseNote,
        created_at: new Date(),
        updated_at: new Date(),
    }

    const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert(data)
        .select();

    if (subscriptionError) {
        return NextResponse.json({
            error: 'Paket satın alınamadı',
        }, { status: 400 });
    }

    return NextResponse.json({
        message: 'Paket satın alındı',
    }, { status: 200 });
}