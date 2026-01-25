import { NextResponse } from 'next/server';
import { getSupabaseServer } from '../../../lib/supabase';

/**
 * Çilingir verilerini getir API endpoint'i
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        // Slug tabanlı parametreler
        const citySlug = searchParams.get('citySlug');
        const districtSlug = searchParams.get('districtSlug');

        // Doğrudan ID tabanlı parametreler
        const provinceParamId = searchParams.get('provinceId');
        let districtParamId = searchParams.get('districtId');


        // Supabase bağlantısı oluştur
        const supabase = getSupabaseServer();

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
                districtid,
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


        // Yakın ilçeleri saklamak için
        let relatedDistrictIds = [];

        // Eğer ilçe bilgisi varsa, yakın ilçeleri district_relations tablosundan al (sıralama için)
        if (finalDistrictId) {
            const { data: relatedDistricts } = await supabase
                .from('district_relations')
                .select('related_district_id')
                .eq('district_id', finalDistrictId)
                .order('priority', { ascending: true });

            if (relatedDistricts && relatedDistricts.length > 0) {
                relatedDistrictIds = relatedDistricts.map(rd => rd.related_district_id);
            }
        }

        // Eğer locksmithList dolu ise, sadece o listedeki çilingirleri getir
        // Eğer boş ise ve ilçe bilgisi varsa, ilçedeki ve yakın ilçelerdeki tüm çilingirleri getir
        if (locksmithList.length > 0) {
            locksmithQuery = locksmithQuery.in('id', locksmithList);
        } else if (finalDistrictId) {
            // Seçili ilçe ve yakın ilçelerdeki çilingirleri getir
            const districtIdsToSearch = [finalDistrictId, ...relatedDistrictIds];
            locksmithQuery = locksmithQuery.in('districtid', districtIdsToSearch);
            console.log('### Burda ###');
            console.log('provinceParamId:', provinceParamId);
            console.log('districtParamId:', districtParamId);
            // locksmithQuery = locksmithQuery.eq('provinceid', provinceId);
        }

        // Maksimum 50 çilingir döndür
        locksmithQuery = locksmithQuery.limit(20);

        const { data: locksmithData, error } = await locksmithQuery;

        // Çilingirleri locksmithList sırasına göre sırala (eğer locksmithList dolu ise)
        let sortedLocksmithData = locksmithData || [];
        if (locksmithList.length > 0 && locksmithData) {
            sortedLocksmithData = locksmithList
                .map(id => locksmithData.find(locksmith => locksmith.id === id))
                .filter(locksmith => locksmith !== undefined);
        }

        // Sıralama: 1) is_verified olanlar en üstte, 2) Seçili ilçedeki çilingirler, 3) Yakın ilçelerdeki çilingirler
        if (finalDistrictId) {
            // Yakın ilçeler varsa, hem verified hem de ilçe tipine göre sırala
            if (relatedDistrictIds.length > 0) {
                sortedLocksmithData = sortedLocksmithData.sort((a, b) => {
                    const aVerified = a.isverified === true ? 1 : 0;
                    const bVerified = b.isverified === true ? 1 : 0;

                    // Önce verified durumuna göre sırala (verified olanlar en üstte)
                    if (aVerified !== bVerified) {
                        return bVerified - aVerified; // Verified olanlar önce
                    }

                    // Verified durumu aynıysa, ilçe tipine göre sırala (seçili ilçe önce)
                    const aIsSelectedDistrict = a.districtid === finalDistrictId ? 1 : 0;
                    const bIsSelectedDistrict = b.districtid === finalDistrictId ? 1 : 0;

                    return bIsSelectedDistrict - aIsSelectedDistrict; // Seçili ilçedekiler önce
                });
            } else {
                // Yakın ilçe yoksa, sadece verified durumuna göre sırala
                sortedLocksmithData = sortedLocksmithData.sort((a, b) => {
                    const aVerified = a.isverified === true ? 1 : 0;
                    const bVerified = b.isverified === true ? 1 : 0;
                    return bVerified - aVerified; // Verified olanlar önce
                });
            }
        } else {
            // İlçe bilgisi yoksa, sadece verified durumuna göre sırala
            sortedLocksmithData = sortedLocksmithData.sort((a, b) => {
                const aVerified = a.isverified === true ? 1 : 0;
                const bVerified = b.isverified === true ? 1 : 0;
                return bVerified - aVerified; // Verified olanlar önce
            });
        }

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