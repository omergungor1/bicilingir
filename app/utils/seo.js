// import { getSupabaseClient } from '../../lib/supabase';


// /**
//  * Supabase bağlantısı oluştur
//  * @returns {Object} Supabase istemcisi
//  */
// function createSupabaseClient() {
//     return getSupabaseClient();
// }

import { getSupabaseServer } from '../../lib/supabase';

function createSupabaseClient() {
    return getSupabaseServer();
}

/**
 * Meta verilerini veritabanından çek
 * @param {Object} params - URL parametreleri
 * @param {string} params.citySlug - Şehir slug
 * @param {string} params.districtSlug - İlçe slug
 * @param {string} params.neighborhoodSlug - Mahalle slug
 * @param {string} params.servicetypeSlug - Hizmet türü slug
 * @param {Array} [params.locksmiths] - Önceden çekilmiş çilingirler
 * @returns {Promise<Object>} Meta verileri objesi
 */
export async function getMetaData({ citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, locksmiths = null }) {
    // Varsayılan meta veriler
    const defaultMetadata = {
        title: 'Bi Çilingir | 7/24 Çilingir ve Anahtarcı Hizmeti',
        description: 'Kapınızda kaldığınızda, anahtarınızı kaybettiğinizde veya kilitli kaldığınızda Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın.',
        keywords: 'çilingir, anahtarcı, kapı açma, acil çilingir, kasa çilingir, oto çilingir, ev çilingir, en uygun çilingir, çilingir fiyatları',
    };

    // Supabase bağlantısı oluştur
    const supabase = createSupabaseClient();

    // Lokasyon bilgilerini veritabanından al
    let city, district, neighborhood, serviceType;

    try {
        // Şehir bilgisini çek
        if (citySlug) {
            const { data: cityData, error: cityError } = await supabase
                .from('provinces')
                .select('id, name')
                .eq('slug', citySlug)
                .single();

            if (cityError || !cityData) {
                console.error('Şehir bilgisi alınamadı:', cityError);
            } else {
                city = cityData;
            }
        }

        // İlçe bilgisini çek
        if (districtSlug && city) {
            const { data: districtData, error: districtError } = await supabase
                .from('districts')
                .select('id, name')
                .eq('slug', districtSlug)
                .eq('province_id', city.id)
                .single();

            if (districtError || !districtData) {
                console.error('İlçe bilgisi alınamadı:', districtError);
            } else {
                district = districtData;
            }
        }

        // Mahalle bilgisini çek
        if (neighborhoodSlug && city && district) {

            const { data: neighborhoodData, error: neighborhoodError } = await supabase
                .from('neighborhoods')
                .select('id, name')
                .eq('slug', neighborhoodSlug)
                .eq('province_id', city.id)
                .eq('district_id', district.id)
                .single();

            if (neighborhoodError || !neighborhoodData) {
                console.error('Mahalle bilgisi alınamadı:', neighborhoodError);
            } else {
                neighborhood = neighborhoodData;
            }
        }

        // Hizmet bilgisini çek
        if (servicetypeSlug) {

            const { data: serviceData, error: serviceError } = await supabase
                .from('services')
                .select('id, name, description')
                .eq('slug', servicetypeSlug)
                .eq('isActive', true)
                .single();

            if (serviceError || !serviceData) {
                console.error('Hizmet bilgisi alınamadı:', serviceError);
                // Eğer veritabanında bulunamazsa, slug'dan oluştur
                serviceType = {
                    name: servicetypeSlug
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                };
            } else {
                serviceType = serviceData;
            }
        }
    } catch (error) {
        console.error('Veritabanı sorgusunda hata:', error);
    }

    // Meta veri oluşturma
    let title = defaultMetadata.title;
    let description = defaultMetadata.description;
    let keywords = defaultMetadata.keywords;

    // Parametrelere göre meta verileri düzenleme
    if (serviceType) {
        const serviceTypeName = serviceType.name;

        if (neighborhood) {
            const neighborhoodName = neighborhood.name;
            const districtName = district.name;
            const cityName = city.name;

            title = `${neighborhoodName} ${serviceTypeName} - ${cityName} ${districtName} | 7/24 En Yakın Çilingirler | Biçilingir`;
            description = `${neighborhoodName} ${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} ${districtName} çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${neighborhoodName} ${serviceTypeName.toLowerCase()}, ${districtName} çilingir, ${cityName} çilingir anahtarcı, acil çilingir, çilingir fiyatları, ekonomik çilingir`;
        }
        else if (district) {
            const districtName = district.name;
            const cityName = city.name;

            title = `${districtName} ${serviceTypeName} - ${cityName} | 7/24 En Yakın Çilingirler | Biçilingir`;
            description = `${districtName} ${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} ${districtName} çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${districtName} ${serviceTypeName.toLowerCase()}, ${districtName} çilingir, ${cityName} çilingir anahtarcı, acil çilingir`;
        }
        else if (city) {
            const cityName = city.name;

            title = `${cityName} ${serviceTypeName} | 7/24 En Yakın Çilingirler | Biçilingir`;
            description = `${cityName} ${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${cityName} ${serviceTypeName.toLowerCase()}, ${cityName} çilingir, ${cityName} çilingir anahtarcı, acil çilingir`;
        }
        else {
            title = `${serviceTypeName} | 7/24 En Yakın Çilingirler | Biçilingir`;
            description = `${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. Çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${serviceTypeName.toLowerCase()}, çilingir, anahtarcı, acil çilingir`;
        }
    }
    else if (neighborhood) {
        const neighborhoodName = neighborhood.name;
        const districtName = district.name;
        const cityName = city.name;

        title = `${neighborhoodName} Çilingir - ${cityName} ${districtName} | 7/24 En Yakın Çilingirler | Biçilingir`;
        description = `${neighborhoodName} çilingir ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${districtName} ${cityName} bölgesinde profesyonel çilingir hizmetleri için hemen arayın.`;
        keywords = `${neighborhoodName} çilingir, ${districtName} çilingir, ${cityName} anahtarcı, kapı açma`;
    }
    else if (district) {
        const districtName = district.name;
        const cityName = city.name;

        title = `${districtName} Çilingir - ${cityName} | 7/24 En Yakın Çilingirler | Biçilingir`;
        description = `${districtName} çilingir ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} bölgesinde profesyonel çilingir hizmetleri için hemen arayın.`;
        keywords = `${districtName} çilingir, ${cityName} anahtarcı, kapı açma, kilit değiştirme`;
    }
    else if (city) {
        const cityName = city.name;

        title = `${cityName} Çilingir | 7/24 En Yakın Çilingirler | Biçilingir`;
        description = `${cityName} çilingir ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. Profesyonel çilingir hizmetleri için hemen arayın.`;
        keywords = `${cityName} çilingir, ${cityName} anahtarcı, kapı açma, kilit değiştirme`;
    }

    // Structured data oluşturalım
    const structuredData = await getJsonLd({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        servicetypeSlug,
        city,
        district,
        neighborhood,
        serviceType,
        locksmiths
    });

    return {
        title: title || 'BiÇilingir - 7/24 Profesyonel Çilingirleri hemen bulun',
        description: description || 'Türkiye genelinde 7/24 acil çilingir, oto çilingir, ev çilingir ve kasa çilingir hizmeti veren profesyonel çilingirleri hemen bulun. Fiyatları karşılaştırın, hemen arayın.',
        keywords: keywords || 'çilingir, acil çilingir, 7/24 çilingir, kapı açma, kilit değiştirme, anahtar, oto çilingir, ev çilingir, kasa çilingir',
        openGraph: {
            title: title || 'BiÇilingir - 7/24 Profesyonel Çilingirleri hemen bulun',
            description: description || 'Türkiye genelinde 7/24 acil çilingir, oto çilingir, ev çilingir ve kasa çilingir hizmeti veren profesyonel çilingirleri hemen bulun. Fiyatları karşılaştırın, hemen arayın.',
            url: 'https://bicilingir.com',
            siteName: 'BiÇilingir',
            images: [
                {
                    url: 'https://bicilingir.com/images/infocard.png',
                    width: 1200,
                    height: 630,
                    alt: 'BiÇilingir - 7/24 Profesyonel Çilingirleri hemen bulun',
                },
            ],
            locale: 'tr_TR',
            type: 'website',
        },
        alternates: {
            canonical: 'https://bicilingir.com',
        },
        // JSON-LD yapılandırılmış verisi
        // scripts: structuredData ? [{
        //     type: 'application/ld+json',
        //     text: JSON.stringify(structuredData)
        // }] : undefined
        other: {
            // Structured data'yı string olarak gönderiyoruz ki Next.js bunu anlaşılır bir şekilde meta tag'e dönüştürebilsin
            structuredData: structuredData ? JSON.stringify(structuredData) : undefined
        }
    };
}


function cleanObject(obj) {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v !== undefined && v !== null && v !== "")
    );
}

/**
 * JSON-LD yapılandırılmış verisi oluştur
 * Çilingirleri listeler, işletme verilerini ekler
 * @param {Object} params - Gerekli parametreler
 * @param {Array} [params.locksmiths] - Önceden çekilmiş çilingirler
 * @returns {Promise<Object>} JSON-LD yapılandırılmış veri objesi
 */
async function getJsonLd({ citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, city, district, neighborhood, serviceType, locksmiths = null }) {
    let listTitle = "Çilingir Hizmeti";
    let locksmithsList = [];
    let jsonLd = null;

    try {
        // Liste başlığını oluştur
        if (neighborhood && serviceType) {
            listTitle = `${city.name} ${district.name} ${neighborhood.name} Mahallesi ${serviceType.name} Listesi`;
        } else if (district && serviceType) {
            listTitle = `${city.name} ${district.name} ${serviceType.name} Listesi`;
        } else if (city && serviceType) {
            listTitle = `${city.name} ${serviceType.name} Listesi`;
        } else if (neighborhood) {
            listTitle = `${neighborhood.name} Mahallesi Çilingir Listesi`;
        } else if (district) {
            listTitle = `${city.name} ${district.name} Çilingir Listesi`;
        } else if (city) {
            listTitle = `${city.name} Çilingir Listesi`;
        } else if (serviceType) {
            listTitle = `${serviceType.name} Listesi`;
        }

        locksmithsList = locksmiths;
    } catch (error) {
        console.error('Yapılandırılmış veri oluşturulurken hata:', error);
    }

    // Çilingir listesi için ItemList Schema
    if (locksmithsList && locksmithsList.length > 0) {
        const itemListElements = locksmithsList.map((locksmith, index) => {
            const address = cleanObject({
                "@type": "PostalAddress",
                "addressLocality": locksmith.district || (district ? district.name : ""),
                "addressRegion": locksmith.city || (city ? city.name : ""),
                "addressCountry": "TR",
                "postalCode": locksmith.postalCode,
                "streetAddress": locksmith.address,
            });

            // Çalışma saatleri
            const workingHoursArray = [];
            if (locksmith.workingHours && locksmith.workingHours.length > 0) {
                // Her bir güne göre çalışma saatlerini ekle
                const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
                locksmith.workingHours.forEach(wh => {
                    if (wh.isworking) {
                        if (wh.is24hopen) {
                            workingHoursArray.push(`${daysOfWeek[wh.dayofweek]} 00:00-23:59`);
                        } else {
                            const openTime = wh.opentime ? wh.opentime.substring(0, 5) : "09:00";
                            const closeTime = wh.closetime ? wh.closetime.substring(0, 5) : "18:00";
                            workingHoursArray.push(`${daysOfWeek[wh.dayofweek]} ${openTime}-${closeTime}`);
                        }
                    }
                });
            }

            // Hizmet verilen bölgeler
            const areaServed = [];
            if (locksmith.locksmith_districts && locksmith.locksmith_districts.length > 0) {
                locksmith.locksmith_districts.forEach(ld => {
                    const districtName = ld.districts?.name;
                    const provinceName = ld.provinces?.name;
                    if (districtName && provinceName) {
                        areaServed.push(`${districtName}, ${provinceName}`);
                    }
                });
            }

            // Sosyal medya linkleri
            const sameAs = [];
            if (locksmith.socialProfiles) {
                if (locksmith.socialProfiles.facebook) sameAs.push(locksmith.socialProfiles.facebook);
                if (locksmith.socialProfiles.instagram) sameAs.push(locksmith.socialProfiles.instagram);
                if (locksmith.socialProfiles.youtube) sameAs.push(locksmith.socialProfiles.youtube);
                if (locksmith.socialProfiles.tiktok) sameAs.push(locksmith.socialProfiles.tiktok);
            }

            // Ödeme seçenekleri
            const paymentAccepted = ["Cash", "Credit Card", "Debit Card"];

            // Coğrafi konum
            const geo = locksmith.location ? {
                "@type": "GeoCoordinates",
                "latitude": locksmith.location.lat,
                "longitude": locksmith.location.lng
            } : undefined;

            // Rating bilgisi 
            const aggregateRating = (locksmith.rating && locksmith.reviewCount) ? {
                "@type": "AggregateRating",
                "ratingValue": locksmith.rating.toString(),
                "reviewCount": locksmith.reviewCount.toString()
            } : undefined;

            // LocalBusiness şeması
            const business = cleanObject({
                "@type": "LocalBusiness",
                "name": locksmith.name,
                "description": locksmith.description,
                "address": Object.keys(address).length > 0 ? address : undefined,
                "telephone": locksmith.phone,
                "image": locksmith.profileimageurl,
                "priceRange": "300-1000",
                "areaServed": areaServed.length > 0 ? areaServed : undefined,
                "openingHours": workingHoursArray.length > 0 ? workingHoursArray : undefined,
                "serviceType": "Çilingir Hizmeti",
                "aggregateRating": aggregateRating,
                "url": locksmith.url,
                "geo": geo,
                "sameAs": sameAs.length > 0 ? sameAs : undefined,
                "founder": locksmith.fullname,
                "foundingDate": locksmith.foundingDate || "2019-01-01",
                "paymentAccepted": paymentAccepted,
                "currenciesAccepted": "TRY"
            });

            // ListItem olarak dön
            return {
                "@type": "ListItem",
                "position": index + 1,
                "item": business
            };
        });

        jsonLd = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `${city ? city.name : ""} ${district ? district.name : ""} Çilingir Listesi`,
            "itemListElement": itemListElements
        };
    }

    // Artık JSON nesnesini string'e dönüştürüp öyle dönelim
    return jsonLd;
}

export async function getLocksmithsList({ citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, count = 2 }) {
    try {
        const params = new URLSearchParams();
        if (citySlug) params.append('citySlug', citySlug);
        if (districtSlug) params.append('districtSlug', districtSlug);
        if (neighborhoodSlug) params.append('neighborhoodSlug', neighborhoodSlug);
        if (servicetypeSlug) params.append('servicetypeSlug', servicetypeSlug);
        params.append('count', count);

        // Tam URL belirt (protokol ve ana bilgisayarı dahil et)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const url = `${baseUrl}/api/locksmiths?${params.toString()}`;

        const response = await fetch(url, {
            cache: 'no-store' // Gerçek verileri almak için önbelleği devre dışı bırak
        });

        if (!response.ok) {
            throw new Error('API yanıt vermedi');
        }

        const data = await response.json();
        return data.locksmiths || [];
    } catch (error) {
        console.error('Çilingir verileri çekilirken hata:', error);
        return [];
    }
}

/**
 * Şehir verilerini getiren yardımcı fonksiyon
 * @param {string} citySlug - Şehir slug'ı
 * @returns {Promise<Object>} Şehir verileri
 */
export async function getCityData(citySlug) {
    if (!citySlug) return null;

    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('provinces')
            .select('*')
            .eq('slug', citySlug)
            .single();

        if (error) {
            console.error('Şehir verisi getirilirken hata:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Şehir verisi getirilirken hata:', error);
        return null;
    }
}

/**
 * İlçe verilerini getiren yardımcı fonksiyon
 * @param {string} districtSlug - İlçe slug'ı
 * @param {number} cityId - Şehir ID'si
 * @returns {Promise<Object>} İlçe verileri
 */
export async function getDistrictData(districtSlug, cityId) {
    if (!districtSlug || !cityId) return null;

    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('districts')
            .select('*')
            .eq('slug', districtSlug)
            .eq('province_id', cityId)
            .single();

        if (error) {
            console.error('İlçe verisi getirilirken hata:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('İlçe verisi getirilirken hata:', error);
        return null;
    }
}

/**
 * Mahalle verilerini getiren yardımcı fonksiyon
 * @param {string} neighborhoodSlug - Mahalle slug'ı
 * @param {number} districtId - İlçe ID'si
 * @returns {Promise<Object>} Mahalle verileri
 */
export async function getNeighborhoodData(neighborhoodSlug, districtId) {
    if (!neighborhoodSlug || !districtId) return null;

    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('neighborhoods')
            .select('*')
            .eq('slug', neighborhoodSlug)
            .eq('district_id', districtId)
            .single();

        if (error) {
            console.error('Mahalle verisi getirilirken hata:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Mahalle verisi getirilirken hata:', error);
        return null;
    }
}

/**
 * Hizmet türü verilerini getiren yardımcı fonksiyon
 * @param {string} serviceSlug - Hizmet slug'ı
 * @returns {Promise<Object>} Hizmet türü verileri
 */
export async function getServiceData(serviceSlug) {
    if (!serviceSlug) return null;

    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .eq('slug', serviceSlug)
            .eq('isActive', true)
            .single();

        if (error) {
            console.error('Hizmet verisi getirilirken hata:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Hizmet verisi getirilirken hata:', error);
        return null;
    }
}
