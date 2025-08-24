import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET() {
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            {
                cookies: {
                    getAll: () => [],
                    setAll: () => { },
                },
            }
        );



        // Aktif çilingirleri lat/lng bilgileriyle birlikte çek
        const { data: locksmiths, error } = await supabase
            .from('locksmiths')
            .select(`
                id,
                slug,
                businessname,
                fullname,
                phonenumber,
                avgrating,
                totalreviewcount,
                profileimageurl,
                locksmith_details (
                    lat,
                    lng,
                    fulladdress
                )
            `)
            .eq('isactive', true)
            .not('locksmith_details.lat', 'is', null)
            .not('locksmith_details.lng', 'is', null);

        if (error) {
            console.error('Çilingirler çekilirken hata:', error);
            return NextResponse.json(
                {
                    error: 'Çilingirler yüklenirken bir hata oluştu',
                    details: error.message,
                    code: error.code
                },
                { status: 500 }
            );
        }

        // Sadece geçerli koordinatlara sahip çilingirleri filtrele
        const validLocksmiths = locksmiths.filter(locksmith =>
            locksmith.locksmith_details?.lat &&
            locksmith.locksmith_details?.lng &&
            !isNaN(parseFloat(locksmith.locksmith_details.lat)) &&
            !isNaN(parseFloat(locksmith.locksmith_details.lng))
        );

        // Harita için uygun formata dönüştür
        const mapData = validLocksmiths.map(locksmith => ({
            id: locksmith.id,
            slug: locksmith.slug,
            position: {
                lat: parseFloat(locksmith.locksmith_details.lat),
                lng: parseFloat(locksmith.locksmith_details.lng)
            },
            title: locksmith.businessname || locksmith.fullname,
            description: locksmith.locksmith_details.fulladdress || 'Konum bilgisi',
            rating: locksmith.avgrating,
            reviewCount: locksmith.totalreviewcount,
            profileImage: locksmith.profileimageurl,
            phoneNumber: locksmith.phonenumber
        }));

        return NextResponse.json({
            locksmiths: mapData,
            count: mapData.length
        });

    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
}

// Cache ayarları - build zamanında oluştur ve 1 saat cache'le
export const revalidate = 3600; // 1 saat
