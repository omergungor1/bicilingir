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
        // const neighborhoodSlug = searchParams.get('neighborhoodSlug');
        // const servicetypeSlug = searchParams.get('servicetypeSlug');


        // Doğrudan ID tabanlı parametreler
        const provinceParamId = searchParams.get('provinceId');
        let districtParamId = searchParams.get('districtId');


        // Supabase bağlantısı oluştur
        // const supabase = createSupabaseClient();
        const supabase = getSupabaseServer();


        // if (neighborhoodSlug) {
        //     const { data: neighborhoodData } = await supabase
        //         .from('neighborhoods')
        //         .select('district_id')
        //         .eq('slug', neighborhoodSlug)
        //         .single();

        //     if (neighborhoodData) {
        //         districtParamId = neighborhoodData.district_id;
        //     }
        // }

        let locksmithList = [];
        let finalDistrictId = districtParamId; // İlçe ID'sini sakla

        if (districtParamId || districtSlug) {

            let cityId = provinceParamId || null;
            if (citySlug && !cityId) {
                const { data: cityData } = await supabase
                    .from('provinces')
                    .select('id')
                    .eq('slug', citySlug)
                    .single();

                if (cityData) {
                    cityId = cityData.id;
                }
            }


            if (districtParamId) {
                const { data: districtData } = await supabase
                    .from('districts')
                    .select('locksmith1id,locksmith2id')
                    .eq('id', districtParamId)
                    .eq('province_id', cityId)
                    .single();


                if (districtData) {
                    if (districtData?.locksmith1id) locksmithList.push(districtData.locksmith1id);
                    if (districtData?.locksmith2id) locksmithList.push(districtData.locksmith2id);
                }
            } else if (districtSlug) {
                const { data: districtData } = await supabase
                    .from('districts')
                    .select('id,locksmith1id,locksmith2id')
                    .eq('slug', districtSlug)
                    .eq('province_id', cityId)
                    .single();

                if (districtData) {
                    finalDistrictId = districtData.id; // districtId'yi sakla
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
                isverified,
                provinces:provinceid(name),
                districts:districtid(name),
                locksmith_districts: locksmith_districts(districts(name),provinces(name)),
                locksmith_services: services(name,minPriceMesai,maxPriceMesai,minPriceAksam,maxPriceAksam,minPriceGece,maxPriceGece)
            `)
            .eq('isactive', true)
            .eq('status', 'approved');


        // Eğer locksmithList dolu ise, sadece o listedeki çilingirleri getir
        // Eğer boş ise ve ilçe bilgisi varsa, ilçedeki tüm çilingirleri getir
        if (locksmithList.length > 0) {
            locksmithQuery = locksmithQuery.in('id', locksmithList);
        } else if (finalDistrictId) {
            // locksmithList boş ise, ilçedeki tüm çilingirleri getir
            locksmithQuery = locksmithQuery.eq('districtid', finalDistrictId);
        }

        // Maksimum 30 çilingir döndür
        locksmithQuery = locksmithQuery.limit(30);

        const { data: locksmithData, error } = await locksmithQuery;

        // Çilingirleri locksmithList sırasına göre sırala (eğer locksmithList dolu ise)
        let sortedLocksmithData = locksmithData || [];
        if (locksmithList.length > 0 && locksmithData) {
            sortedLocksmithData = locksmithList
                .map(id => locksmithData.find(locksmith => locksmith.id === id))
                .filter(locksmith => locksmith !== undefined);
        }

        // is_verified olan çilingirleri en üste al
        sortedLocksmithData = sortedLocksmithData.sort((a, b) => {
            const aVerified = a.isverified === true ? 1 : 0;
            const bVerified = b.isverified === true ? 1 : 0;
            return bVerified - aVerified; // Verified olanlar önce (1 - 0 = 1, 0 - 1 = -1)
        });

        // Çilingir verilerini formatlama
        const formattedLocksmiths = sortedLocksmithData?.map(item => ({
            id: item.id,
            name: item.businessname || item.fullname,
            fullname: item.fullname,
            description: item.tagline || `${item.provinces?.name || ''} ${item.districts?.name || ''} bölgesinde profesyonel çilingir hizmeti.`,
            address: item.locksmith_details.fulladdress,
            postalCode: item.locksmith_details.postal_code,
            phone: item.phonenumber,
            whatsapp: item.whatsappnumber,
            profileimageurl: item.profileimageurl,
            url: `https://bicilingir.com/${item.slug}`,
            city: item.provinces?.name,
            district: item.districts?.name,
            rating: item.avgrating,
            reviewCount: item.totalreviewcount,
            locksmith_districts: item.locksmith_districts,
            workingHours: item.locksmith_working_hours,
            foundingDate: item.locksmith_details.startdate,
            is_verified: item.isverified,
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
            // serviceType: servicetypeSlug ? servicetypeSlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Çilingir Hizmeti",
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