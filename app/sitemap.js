import { getSupabaseServer } from '../lib/supabase';

// Next.js App Router için dinamik sitemap oluşturma
export default async function sitemap() {
    // Baz URL
    const baseUrl = 'https://www.bicilingir.com';

    // Supabase client
    const supabase = getSupabaseServer();

    // Şimdiki zaman - son güncelleme zamanı olarak kullanılacak
    const now = new Date().toISOString();

    // Temel sayfalar
    const staticPages = [
        {
            url: `${baseUrl}`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/hakkimizda`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/iletisim`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/bilgi`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ];

    // Sadece Bursa'yı (id=16) getir
    const { data: provinces, error: provinceError } = await supabase
        .from('provinces')
        .select('id, name, slug')
        .eq('id', 16);  // Sadece Bursa'yı filtrele

    if (provinceError) {
        console.error('İller yüklenirken hata:', provinceError);
    }

    // Bursa'nın ilçelerini getir
    const { data: districts, error: districtError } = await supabase
        .from('districts')
        .select('id, name, slug, province_id')
        .eq('province_id', 16);  // Sadece Bursa'nın ilçelerini filtrele

    if (districtError) {
        console.error('İlçeler yüklenirken hata:', districtError);
    }

    // Bursa ilçelerinin mahallelerini getir
    const districtIds = districts ? districts.map(d => d.id) : [];

    const { data: neighborhoods, error: neighbourhoodError } = await supabase
        .from('neighborhoods')
        .select('id, name, slug, district_id')
        .in('district_id', districtIds);  // Sadece Bursa ilçelerinin mahallelerini filtrele

    if (neighbourhoodError) {
        console.error('Mahalleler yüklenirken hata:', neighbourhoodError);
    }

    // Hizmetler
    const { data: services, error: serviceError } = await supabase
        .from('services')
        .select('id, slug');

    if (serviceError) {
        console.error('Hizmetler yüklenirken hata:', serviceError);
    }

    // Çilingirler - Bursa'dakiler için filtrele 
    // NOT: Şu anda tüm çilingirleri alıyoruz, eğer çilingirlerin bir province_id'si varsa, 
    // .eq('province_id', 16) ekleyerek sadece Bursa'dakileri filtreleyin
    const { data: locksmiths, error: locksmithError } = await supabase
        .from('locksmiths')
        .select('id, slug, createdat')
        .eq('isactive', true);

    if (locksmithError) {
        console.error('Çilingirler yüklenirken hata:', locksmithError);
    }

    // İl, ilçe, mahalle ilişkilerini kur
    const districtsMap = districts ? districts.reduce((map, district) => {
        if (!map[district.province_id]) {
            map[district.province_id] = [];
        }
        map[district.province_id].push(district);
        return map;
    }, {}) : {};

    const neighborhoodsMap = neighborhoods ? neighborhoods.reduce((map, neighbourhood) => {
        if (!map[neighbourhood.district_id]) {
            map[neighbourhood.district_id] = [];
        }
        map[neighbourhood.district_id].push(neighbourhood);
        return map;
    }, {}) : {};

    // İl sayfaları URL'leri (Sadece Bursa)
    const provinceUrls = provinces ? provinces.map(province => {
        return {
            url: `${baseUrl}/${province.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
        };
    }) : [];

    // İl + Hizmet sayfaları URL'leri (Sadece Bursa)
    const provinceServiceUrls = [];
    if (provinces && services) {
        provinces.forEach(province => {
            services.forEach(service => {
                provinceServiceUrls.push({
                    url: `${baseUrl}/${province.slug}/${service.slug}`,
                    lastModified: now,
                    changeFrequency: 'weekly',
                    priority: 0.7,
                });
            });
        });
    }

    // İlçe sayfaları URL'leri (Sadece Bursa'nın ilçeleri)
    const districtUrls = [];
    if (provinces) {
        provinces.forEach(province => {
            const provinceDistricts = districtsMap[province.id] || [];
            provinceDistricts.forEach(district => {
                districtUrls.push({
                    url: `${baseUrl}/${province.slug}/${district.slug}`,
                    lastModified: now,
                    changeFrequency: 'weekly',
                    priority: 0.6,
                });
            });
        });
    }

    // İlçe + Hizmet sayfaları URL'leri (Sadece Bursa'nın ilçeleri)
    const districtServiceUrls = [];
    if (provinces && services) {
        provinces.forEach(province => {
            const provinceDistricts = districtsMap[province.id] || [];
            provinceDistricts.forEach(district => {
                services.forEach(service => {
                    districtServiceUrls.push({
                        url: `${baseUrl}/${province.slug}/${district.slug}/${service.slug}`,
                        lastModified: now,
                        changeFrequency: 'weekly',
                        priority: 0.6,
                    });
                });
            });
        });
    }

    // Mahalle sayfaları URL'leri (Sadece Bursa'nın ilçelerinin mahalleleri)
    const neighbourhoodUrls = [];
    if (provinces) {
        provinces.forEach(province => {
            const provinceDistricts = districtsMap[province.id] || [];
            provinceDistricts.forEach(district => {
                const districtneighborhoods = neighborhoodsMap[district.id] || [];
                districtneighborhoods.forEach(neighbourhood => {
                    neighbourhoodUrls.push({
                        url: `${baseUrl}/${province.slug}/${district.slug}/${neighbourhood.slug}`,
                        lastModified: now,
                        changeFrequency: 'weekly',
                        priority: 0.5,
                    });
                });
            });
        });
    }

    // Mahalle + Hizmet sayfaları URL'leri (Sadece Bursa'nın ilçelerinin mahalleleri)
    const neighborhoodserviceUrls = [];
    if (provinces && services) {
        provinces.forEach(province => {
            const provinceDistricts = districtsMap[province.id] || [];
            provinceDistricts.forEach(district => {
                const districtneighborhoods = neighborhoodsMap[district.id] || [];
                districtneighborhoods.forEach(neighbourhood => {
                    services.forEach(service => {
                        neighborhoodserviceUrls.push({
                            url: `${baseUrl}/${province.slug}/${district.slug}/${neighbourhood.slug}/${service.slug}`,
                            lastModified: now,
                            changeFrequency: 'weekly',
                            priority: 0.5,
                        });
                    });
                });
            });
        });
    }

    // Çilingir detay sayfaları URL'leri
    const locksmithUrls = locksmiths ? locksmiths.map(locksmith => {
        const lastMod = now; //locksmith.createdat ||

        return {
            url: `${baseUrl}/cilingirler/${locksmith.slug}`,
            lastModified: lastMod,
            changeFrequency: 'weekly',
            priority: 0.8, // Çilingir sayfaları daha yüksek önceliğe sahip olabilir
        };
    }) : [];

    // Tüm URL'leri birleştir
    return [
        ...staticPages,
        ...locksmithUrls, // Çilingir sayfalarını ekledik
        ...provinceUrls,
        ...provinceServiceUrls,
        ...districtUrls,
        ...districtServiceUrls,
        ...neighbourhoodUrls,
        ...neighborhoodserviceUrls,
    ];
} 