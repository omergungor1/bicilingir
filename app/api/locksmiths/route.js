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
 * Şu anki saat belirtilen aralıkta mı kontrol et
 * @param {Number} openHour - Açılış saati
 * @param {Number} closeHour - Kapanış saati
 * @returns {Boolean} Belirtilen saat aralığında mı?
 */
function isWithinTimeRange(openHour, closeHour) {
    const currentHour = new Date().getHours();

    // Normal saat aralığı (ör. 09:00-18:00)
    if (openHour <= closeHour) {
        return currentHour >= openHour && currentHour < closeHour;
    }
    // Gece yarısını kapsayan aralık (ör. 22:00-08:00)
    else {
        return currentHour >= openHour || currentHour < closeHour;
    }
}

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

        // Doğrudan ID tabanlı parametreler
        const provinceParamId = searchParams.get('provinceId');
        const districtParamId = searchParams.get('districtId');
        const serviceParamId = searchParams.get('serviceId');

        const count = searchParams.get('count') > 5 ? 2 : searchParams.get('count') || 2;


        // Supabase bağlantısı oluştur
        const supabase = createSupabaseClient();

        // Şehir, ilçe bilgilerini çek (gerekirse)
        let cityId = provinceParamId, districtId = districtParamId;

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


        if (districtSlug && cityId && !districtId) {
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


        //İlçedeki çilingilerin id lerini çek
        let locksmithIds = [];

        //locksmiths tablosundan çilingirler id lerini çek aktif olanları
        const { data: locksmithsData } = await supabase
            .from('locksmiths')
            .select('id')
            .eq('isactive', true)
            .eq('provinceid', cityId);


        if (locksmithsData) {
            locksmithIds = locksmithsData.map(item => item.id);
        }

        if (districtId) {
            const { data: locksmithDistrictsData } = await supabase
                .from('locksmith_districts')
                .select('locksmithid')
                .eq('districtid', districtId)
                .eq('provinceid', cityId)
                .eq('isactive', true)
                .in('locksmithid', locksmithIds);

            if (locksmithDistrictsData) {
                locksmithIds = locksmithDistrictsData.map(item => item.locksmithid);
            }
        }

        //Şu anda açık olan çilingilerin ID'lerini çek
        let activeWorkingLocksmithIds = [];
        if (locksmithIds && locksmithIds.length > 0) {
            // Bugünün haftanın kaçıncı günü olduğunu bul (JavaScript'te 0: Pazar, 1: Pazartesi, ...)
            const today = new Date().getDay();
            // Supabase'de 0: Pazartesi, ... 6: Pazar formatına çevir
            const dayOfWeek = today === 0 ? 6 : today - 1;

            // 1. Önce 24 saat açık olan çilingirleri çek
            const { data: open24HoursData } = await supabase
                .from('locksmith_working_hours')
                .select('locksmithid')
                .in('locksmithid', locksmithIds)
                .eq('dayofweek', dayOfWeek)
                .eq('is24hopen', true)
                .eq('isworking', true);

            // 24 saat açık olanları ekle
            if (open24HoursData && open24HoursData.length > 0) {
                locksmithIds = open24HoursData.map(item => item.locksmithid);
            }

            // 2. Sonra şu anki saat aralığında açık olanları çek
            const { data: regularHoursData } = await supabase
                .from('locksmith_working_hours')
                .select('locksmithid, opentime, closetime')
                .in('locksmithid', locksmithIds)
                .eq('dayofweek', dayOfWeek)
                .eq('is24hopen', false)
                .eq('isworking', true);

            // Şu anki saatte açık olan çilingirleri kontrol et ve ekle
            if (regularHoursData && regularHoursData.length > 0) {
                const currentHour = new Date().getHours();

                // Şu an açık olan çilingirler
                const openLocksmithIds = regularHoursData
                    .filter(item => {
                        // Açılış ve kapanış saatleri
                        const openHour = parseInt(item.opentime);
                        const closeHour = parseInt(item.closetime);

                        // Normal aralık (örn. 09:00-18:00)
                        if (openHour <= closeHour) {
                            return currentHour >= openHour && currentHour < closeHour;
                        }
                        // Gece yarısını kapsayan aralık (örn. 22:00-08:00)
                        else {
                            return currentHour >= openHour || currentHour < closeHour;
                        }
                    })
                    .map(item => item.locksmithid);

                // Açık çilingirleri listeye ekle (tekrarları önle)
                locksmithIds = openLocksmithIds;
            }
        }

        //Bu hizmeti veriyor mu? locksmith_services tablosunda var mı?
        if (servicetypeSlug || serviceParamId) {
            // console.log('servicetypeSlug:', servicetypeSlug);
            // console.log('serviceParamId:', serviceParamId);
            //get serviceid 
            let serviceId = serviceParamId;

            if (!serviceId) {
                const { data: serviceData } = await supabase
                    .from('services')
                    .select('id')
                    .eq('slug', servicetypeSlug)
                    .single();

                serviceId = serviceData.id;
            }

            const { data: locksmithServicesData } = await supabase
                .from('locksmith_services')
                .select('locksmithid')
                .eq('isactive', true)
                .eq('serviceid', serviceId)
                .in('locksmithid', locksmithIds);

            if (locksmithServicesData) {
                locksmithIds = locksmithServicesData.map(item => item.locksmithid);
            }
        }

        //locksmith_traffic tablosundan priority en yüksek 2 çilingir id getir
        let priorityLocksmithIds = [];
        if (locksmithIds && locksmithIds.length > 0) {
            const { data: priorityLocksmithsData } = await supabase
                .from('locksmith_traffic')
                .select('locksmith_id')
                .in('locksmith_id', locksmithIds)
                .order('priority', { ascending: false })
                .limit(count);

            if (priorityLocksmithsData) {
                priorityLocksmithIds = priorityLocksmithsData.map(item => item.locksmith_id);
            }
        }


        // Çilingir listesini çek
        let locksmithQuery = supabase
            .from('locksmiths')
            .select(`
                id, 
                businessname,
                fullname,
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
            .in('id', priorityLocksmithIds);

        // Filtreleme
        if (cityId) {
            locksmithQuery = locksmithQuery.eq('provinceid', cityId);
        }

        // Aktif çalışma saatine sahip çilingirlerle filtrele
        if (activeWorkingLocksmithIds && activeWorkingLocksmithIds.length > 0) {
            locksmithQuery = locksmithQuery.in('id', activeWorkingLocksmithIds);
        }

        const { data: locksmithsBeforeSort, error } = await locksmithQuery;

        const locksmiths = priorityLocksmithIds
            .map(id => locksmithsBeforeSort.find(item => item.id === id))
            .filter(Boolean);

        if (error) {
            console.error('Çilingir verileri çekilirken hata:', error);
            return NextResponse.json({ error: 'Çilingir verileri alınamadı' }, { status: 500 });
        }

        // Çilingir verilerini formatlama
        const formattedLocksmiths = locksmiths.map(item => ({
            id: item.id,
            name: item.businessname || item.fullname,
            fullname: item.fullname,
            description: `${item.provinces?.name || ''} ${item.districts?.name || ''} bölgesinde profesyonel çilingir hizmeti.`,
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

        return NextResponse.json({ locksmiths: formattedLocksmiths });
    } catch (error) {
        console.error('API hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 