import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../../../lib/supabase';
import { checkAuth } from '../../../utils';

export async function GET(request) {
    try {
        const { locksmithId } = await checkAuth(request);
        const supabase = await getSupabaseServer();
        const { data: packages, error } = await supabase
            .from('packages')
            .select('*')
            .eq('is_active', true)
            .order('price', { ascending: true });

        if (error) {
            console.error('Paketler getirilirken bir hata oluştu 1:', error);
            return NextResponse.json({ error: 'Paketler yüklenirken bir hata oluştu' }, { status: 500 });
        }

        let subscription = null;

        if (locksmithId) {
            //Kullanıcının abonelik durumunu kontrol et...
            const { data: subscriptionData, error: subscriptionError } = await supabase
                .from('subscriptions')
                .select('package_id, is_active, status')
                .eq('locksmith_id', locksmithId)

            if (subscriptionError) {
                console.error('Abonelik durumu getirilirken bir hata oluştu:', subscriptionError);
                return NextResponse.json({ error: 'Abonelik durumu yüklenirken bir hata oluştu' }, { status: 500 });
            }

            subscription = subscriptionData;
        }


        return NextResponse.json({
            packages: packages,
            subscription: subscription,
        });
    } catch (error) {
        console.error('Paketler getirilirken bir hata oluştu 2:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}