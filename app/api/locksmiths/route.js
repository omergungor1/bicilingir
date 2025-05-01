import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

/**
 * Supabase bağlantısı oluştur
 * @returns {Object} Supabase istemcisi
 */
function createSupabaseClient() {
    return getSupabaseServer();
}

/**
 * Çilingir verilerini getir API endpoint'i
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

        const citySlug = searchParams.get('citySlug');
        const districtSlug = searchParams.get('districtSlug');
        const neighborhoodSlug = searchParams.get('neighborhoodSlug');
        const serviceTypeSlug = searchParams.get('serviceTypeSlug');
        const count = searchParams.get('count') > 5 ? 2 : searchParams.get('count') || 2;


        // Supabase bağlantısı oluştur
        const supabase = createSupabaseClient();

        // Şehir, ilçe bilgilerini çek (gerekirse)
        let cityId, districtId;

        if (citySlug) {
            const { data: cityData } = await supabase
                .from('provinces')
                .select('id')
                .eq('slug', citySlug)
                .single();

            if (cityData) {
                cityId = cityData.id;
            }
        }


        if (districtSlug && cityId) {
            const { data: districtData } = await supabase
                .from('districts')
                .select('id')
                .eq('slug', districtSlug)
                .eq('province_id', cityId)
                .single();

            if (districtData) {
                districtId = districtData.id;
            }
        }


        // Çilingir listesini çek
        let locksmithQuery = supabase
            .from('locksmiths')
            .select(`
                id, 
                businessname,
                fullname,
                phonenumber,
                whatsappnumber,
                avgrating,
                totalreviewcount,
                profileimageurl,
                slug,
                provinces:provinceid(name),
                districts:districtid(name),
                lat:locksmith_details(lat),
                lng:locksmith_details(lng),
                locksmith_services: services(name,minPriceMesai,maxPriceMesai,minPriceAksam,maxPriceAksam,minPriceGece,maxPriceGece)
            `)
            .eq('isactive', true)
            .limit(2);

        // Filtreleme
        if (cityId) {
            locksmithQuery = locksmithQuery.eq('provinceid', cityId);
        }
        // if (districtId) {
        //     locksmithQuery = locksmithQuery.eq('districtid', districtId);
        // }

        const { data: locksmiths, error } = await locksmithQuery;


        if (error) {
            console.error('Çilingir verileri çekilirken hata:', error);
            return NextResponse.json({ error: 'Çilingir verileri alınamadı' }, { status: 500 });
        }

        // Çilingir verilerini formatlama
        const formattedLocksmiths = locksmiths.map(item => ({
            id: item.id,
            name: item.businessname || item.fullname,
            description: `${item.provinces?.name || ''} ${item.districts?.name || ''} bölgesinde profesyonel çilingir hizmeti.`,
            phone: item.phonenumber,
            whatsapp: item.whatsappnumber,
            website: `https://bicilingir.com/cilingir/${item.id}`,
            profileimageurl: item.profileimageurl || 'https://bicilingir.com/images/logo.png',
            city: item.provinces?.name,
            district: item.districts?.name,
            rating: item.avgrating,
            reviewCount: item.totalreviewcount,
            serviceList: item.locksmith_services?.map(service => ({
                name: service.name,
                price1: {
                    min: service.minPriceMesai,
                    max: service.maxPriceMesai
                },
                price2: {
                    min: service.minPriceAksam,
                    max: service.maxPriceAksam
                },
                price3: {
                    min: service.minPriceGece,
                    max: service.maxPriceGece
                }
            })),
            slug: item.slug,
            openingHours: "Mo-Su 00:00-23:59",
            serviceType: serviceTypeSlug ? serviceTypeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Çilingir Hizmeti",
            location: {
                lat: item.lat.lat,
                lng: item.lng.lng
            }
        }));

        return NextResponse.json({ locksmiths: formattedLocksmiths });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 