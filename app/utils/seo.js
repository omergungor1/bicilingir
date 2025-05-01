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
 * @param {string} params.serviceTypeSlug - Hizmet türü slug
 * @param {Array} [params.locksmiths] - Önceden çekilmiş çilingirler
 * @returns {Promise<Object>} Meta verileri objesi
 */
export async function getMetaData({ citySlug, districtSlug, neighborhoodSlug, serviceTypeSlug, locksmiths = null }) {
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
        if (serviceTypeSlug) {

            const { data: serviceData, error: serviceError } = await supabase
                .from('services')
                .select('id, name, description')
                .eq('slug', serviceTypeSlug)
                .eq('isActive', true)
                .single();

            if (serviceError || !serviceData) {
                console.error('Hizmet bilgisi alınamadı:', serviceError);
                // Eğer veritabanında bulunamazsa, slug'dan oluştur
                serviceType = {
                    name: serviceTypeSlug
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

            title = `${neighborhoodName} mahallesi ${serviceTypeName} | ${cityName} ${districtName} Çilingir Anahtarcı`;
            description = `${neighborhoodName} mahallesi ${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} ${districtName} çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${neighborhoodName} mahallesi ${serviceTypeName.toLowerCase()}, ${districtName} çilingir, ${cityName} çilingir anahtarcı, acil çilingir, çilingir fiyatları, ekonomik çilingir`;
        }
        else if (district) {
            const districtName = district.name;
            const cityName = city.name;

            title = `${districtName} ${serviceTypeName} | ${cityName} Çilingir Anahtarcı`;
            description = `${districtName} ${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} ${districtName} çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${districtName} ${serviceTypeName.toLowerCase()}, ${districtName} çilingir, ${cityName} çilingir anahtarcı, acil çilingir`;
        }
        else if (city) {
            const cityName = city.name;

            title = `${cityName} ${serviceTypeName} | Çilingir Anahtarcı`;
            description = `${cityName} ${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${cityName} ${serviceTypeName.toLowerCase()}, ${cityName} çilingir, ${cityName} çilingir anahtarcı, acil çilingir`;
        }
        else {
            title = `${serviceTypeName} | Çilingir Anahtarcı`;
            description = `${serviceTypeName} ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. Çilingir fiyarlarını kıyaslayın, dilediğiniz çilingiri anında çağırın.`;
            keywords = `${serviceTypeName.toLowerCase()}, çilingir, anahtarcı, acil çilingir`;
        }
    }
    else if (neighborhood) {
        const neighborhoodName = neighborhood.name;
        const districtName = district.name;
        const cityName = city.name;

        title = `${neighborhoodName} Çilingir | ${districtName} ${cityName} Çilingir Hizmeti`;
        description = `${neighborhoodName} çilingir ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${districtName} ${cityName} bölgesinde profesyonel çilingir hizmetleri için hemen arayın.`;
        keywords = `${neighborhoodName} çilingir, ${districtName} çilingir, ${cityName} anahtarcı, kapı açma`;
    }
    else if (district) {
        const districtName = district.name;
        const cityName = city.name;

        title = `${districtName} Çilingir | ${cityName} Çilingir Hizmeti`;
        description = `${districtName} çilingir ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. ${cityName} bölgesinde profesyonel çilingir hizmetleri için hemen arayın.`;
        keywords = `${districtName} çilingir, ${cityName} anahtarcı, kapı açma, kilit değiştirme`;
    }
    else if (city) {
        const cityName = city.name;

        title = `${cityName} Çilingir | 7/24 Çilingir Hizmeti`;
        description = `${cityName} çilingir ihtiyaçlarınız için Bi Çilingir ile 7/24 hizmet veren profesyonel çilingirlere hemen ulaşın. Profesyonel çilingir hizmetleri için hemen arayın.`;
        keywords = `${cityName} çilingir, ${cityName} anahtarcı, kapı açma, kilit değiştirme`;
    }

    // Structured data oluşturalım
    const structuredData = await getJsonLd({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        serviceTypeSlug,
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
                    url: 'https://bicilingir.com/images/og-image.jpg',
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
        scripts: structuredData ? [{
            type: 'application/ld+json',
            text: JSON.stringify(structuredData)
        }] : undefined
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
async function getJsonLd({ citySlug, districtSlug, neighborhoodSlug, serviceTypeSlug, city, district, neighborhood, serviceType, locksmiths = null }) {
    let listTitle = "Çilingir Hizmeti";
    let locksmithsList = [];

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

    const itemList = locksmithsList.map((locksmith, index) => {
        const address = cleanObject({
            "@type": "PostalAddress",
            addressLocality: locksmith.district,
            addressRegion: locksmith.city,
            streetAddress: locksmith.address,
            postalCode: locksmith.postalCode
        });

        const aggregateRating = locksmith.ratingValue && locksmith.ratingCount
            ? cleanObject({
                "@type": "AggregateRating",
                "ratingValue": locksmith.ratingValue.toString(),
                "reviewCount": locksmith.ratingCount.toString()
            })
            : undefined;

        const geo = locksmith.lat && locksmith.lng
            ? cleanObject({
                "@type": "GeoCoordinates",
                "latitude": locksmith.lat,
                "longitude": locksmith.lng
            })
            : undefined;

        const business = cleanObject({
            "@type": "LocalBusiness",
            "name": locksmith.name,
            "description": locksmith.description,
            "address": Object.keys(address).length > 0 ? address : undefined,
            "telephone": locksmith.phone,
            "email": locksmith.email,
            "url": locksmith.website,
            "image": locksmith.logoUrl,
            "priceRange": locksmith.priceRange,
            "areaServed": locksmith.neighbourhood && locksmith.district && locksmith.city
                ? `${locksmith.neighbourhood}, ${locksmith.district}, ${locksmith.city}`
                : locksmith.district && locksmith.city
                    ? `${locksmith.district}, ${locksmith.city}`
                    : locksmith.city,
            "openingHours": locksmith.openingHours || "Mo-Su 00:00-23:59",
            "serviceType": locksmith.serviceType || "Çilingir Hizmeti",
            "aggregateRating": aggregateRating,
            "geo": geo,
            "sameAs": locksmith.socialProfiles?.length > 0 ? locksmith.socialProfiles : undefined, // Sosyal medya
            "hasMap": locksmith.mapUrl,
            "founder": locksmith.founderName,
            "foundingDate": locksmith.foundingDate,
            "paymentAccepted": locksmith.paymentAccepted?.length > 0 ? locksmith.paymentAccepted : undefined,
            "currenciesAccepted": "TRY"
        });

        return {
            "@type": "ListItem",
            "position": index + 1,
            "item": business
        };
    });

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": listTitle,
        "itemListElement": itemList
    };

    return structuredData;
}

export async function getLocksmithsList({ citySlug, districtSlug, neighborhoodSlug, serviceTypeSlug, count = 2 }) {
    try {
        const params = new URLSearchParams();
        if (citySlug) params.append('citySlug', citySlug);
        if (districtSlug) params.append('districtSlug', districtSlug);
        if (neighborhoodSlug) params.append('neighborhoodSlug', neighborhoodSlug);
        if (serviceTypeSlug) params.append('serviceTypeSlug', serviceTypeSlug);
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