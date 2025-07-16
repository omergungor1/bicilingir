import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

// /**
//  * Supabase bağlantısı oluştur
//  * @returns {Object} Supabase istemcisi
//  */
// function createSupabaseClient() {
//     return getSupabaseServer();
// }


/**
 * Çilingir verilerini getir API endpoint'i
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        // Slug tabanlı parametreler
        const citySlug = searchParams.get('citySlug');
        const districtSlug = searchParams.get('districtSlug');
        const neighborhoodSlug = searchParams.get('neighborhoodSlug');
        const servicetypeSlug = searchParams.get('servicetypeSlug');

        console.log('###citySlug::', citySlug, 'districtSlug::', districtSlug, 'neighborhoodSlug::', neighborhoodSlug, 'servicetypeSlug::', servicetypeSlug, '###');

        // Doğrudan ID tabanlı parametreler
        const provinceParamId = searchParams.get('provinceId');
        let districtParamId = searchParams.get('districtId');

        console.log('🔍 API - Başlangıç parametreleri:', {
            provinceParamId,
            districtParamId,
            citySlug,
            districtSlug,
            neighborhoodSlug,
            servicetypeSlug
        });


        // Supabase bağlantısı oluştur
        // const supabase = createSupabaseClient();
        const supabase = getSupabaseServer();


        if (neighborhoodSlug) {
            const { data: neighborhoodData } = await supabase
                .from('neighborhoods')
                .select('district_id')
                .eq('slug', neighborhoodSlug)
                .single();

            if (neighborhoodData) {
                districtParamId = neighborhoodData.district_id;
            }
        }

        let locksmithList = [];
        if (districtParamId || districtSlug) {
            if (districtParamId) {
                const { data: districtData } = await supabase
                    .from('districts')
                    .select('locksmith1id,locksmith2id')
                    .eq('id', districtParamId)
                    .single();

                console.log('🔍 API - districtParamId ile district sorgusu:', {
                    districtParamId,
                    districtData
                });

                if (districtData) {
                    if (districtData?.locksmith1id) locksmithList.push(districtData.locksmith1id);
                    if (districtData?.locksmith2id) locksmithList.push(districtData.locksmith2id);
                }
            } else if (districtSlug) {
                const { data: districtData } = await supabase
                    .from('districts')
                    .select('locksmith1id,locksmith2id')
                    .eq('slug', districtSlug)
                    .single();

                console.log('🔍 API - districtSlug ile district sorgusu:', {
                    districtSlug,
                    districtData
                });

                if (districtData) {
                    if (districtData?.locksmith1id) locksmithList.push(districtData.locksmith1id);
                    if (districtData?.locksmith2id) locksmithList.push(districtData.locksmith2id);
                }
            }
        } else if (citySlug || provinceParamId) {
            if (citySlug) {
                const { data: cityData } = await supabase
                    .from('provinces')
                    .select('locksmith1id,locksmith2id')
                    .eq('slug', citySlug)
                    .single();

                console.log('🔍 API - citySlug ile province sorgusu:', {
                    citySlug,
                    cityData
                });

                if (cityData) {
                    if (cityData?.locksmith1id) locksmithList.push(cityData.locksmith1id);
                    if (cityData?.locksmith2id) locksmithList.push(cityData.locksmith2id);
                }
            } else if (provinceParamId) {
                const { data: provinceData } = await supabase
                    .from('provinces')
                    .select('locksmith1id,locksmith2id')
                    .eq('id', provinceParamId)
                    .single();

                //locksmithList = [provinceData.locksmith1id, provinceData.locksmith2id];
                if (provinceData) {
                    if (provinceData?.locksmith1id) locksmithList.push(provinceData.locksmith1id);
                    if (provinceData?.locksmith2id) locksmithList.push(provinceData.locksmith2id);
                }
            }
        }


        // Çilingir listesini çek
        let locksmithQuery = supabase
            .from('locksmiths')
            .select(`
                id, 
                businessname,
                fullname,
                tagline,
                locksmith_details: locksmith_details(fulladdress,postal_code,lat,lng,startdate),
                locksmith_working_hours: locksmith_working_hours(dayofweek,is24hopen,isworking,opentime,closetime),
                phonenumber,
                whatsappnumber,
                avgrating,
                totalreviewcount,
                profileimageurl,
                slug,
                provinces:provinceid(name),
                districts:districtid(name),
                locksmith_districts: locksmith_districts(districts(name),provinces(name)),
                locksmith_services: services(name,minPriceMesai,maxPriceMesai,minPriceAksam,maxPriceAksam,minPriceGece,maxPriceGece)
            `)
            .eq('isactive', true)
            .in('id', locksmithList);


        const { data: locksmithData, error } = await locksmithQuery;

        console.log('🔍 API - Final locksmithList:', locksmithList);

        // // locksmithData'yı locksmithList'in sırasına göre sırala
        // const sortedLocksmithData = locksmithData?.sort((a, b) => {
        //     const aIndex = locksmithList.indexOf(a.id);
        //     const bIndex = locksmithList.indexOf(b.id);
        //     return aIndex - bIndex;
        // }) || [];

        // console.log('🔍 API - Sorted locksmithData:', sortedLocksmithData?.map(l => ({
        //     id: l.id,
        //     name: l.businessname || l.fullname
        // })));

        // Çilingir verilerini formatlama
        const formattedLocksmiths = locksmithData?.map(item => ({
            // const formattedLocksmiths = sortedLocksmithData?.map(item => ({
            id: item.id,
            name: item.businessname || item.fullname,
            fullname: item.fullname,
            description: item.tagline || `${item.provinces?.name || ''} ${item.districts?.name || ''} bölgesinde profesyonel çilingir hizmeti.`,
            address: item.locksmith_details.fulladdress,
            postalCode: item.locksmith_details.postal_code,
            phone: item.phonenumber,
            whatsapp: item.whatsappnumber,
            profileimageurl: item.profileimageurl,
            url: `https://bicilingir.com/cilingirler/${item.slug}`,
            city: item.provinces?.name,
            district: item.districts?.name,
            rating: item.avgrating,
            reviewCount: item.totalreviewcount,
            locksmith_districts: item.locksmith_districts,
            workingHours: item.locksmith_working_hours,
            foundingDate: item.locksmith_details.startdate,
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
            // openingHours: "Mo-Su 00:00-23:59",
            serviceType: servicetypeSlug ? servicetypeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Çilingir Hizmeti",
            location: {
                lat: item.locksmith_details.lat,
                lng: item.locksmith_details.lng
            }
        }));

        return NextResponse.json({ locksmiths: formattedLocksmiths || [] });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 