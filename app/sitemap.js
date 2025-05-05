import { getSupabaseServer } from '../lib/supabase';

// Next.js App Router için dinamik sitemap oluşturma
export default async function sitemap() {
    // Baz URL - kesin URL kullan
    const baseUrl = 'https://www.bicilingir.com';

    try {
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
            // Hata durumunda en azından statik sayfaları döndür
            return staticPages;
        }

        // Bursa'nın ilçelerini getir
        const { data: districts, error: districtError } = await supabase
            .from('districts')
            .select('id, name, slug, province_id')
            .eq('province_id', 16);  // Sadece Bursa'nın ilçelerini filtrele

        if (districtError) {
            console.error('İlçeler yüklenirken hata:', districtError);
            return staticPages;
        }

        // Bursa ilçelerinin mahallelerini getir
        const districtIds = districts ? districts.map(d => d.id) : [];

        const { data: neighborhoods, error: neighbourhoodError } = await supabase
            .from('neighborhoods')
            .select('id, name, slug, district_id')
            .in('district_id', districtIds);  // Sadece Bursa ilçelerinin mahallelerini filtrele

        if (neighbourhoodError) {
            console.error('Mahalleler yüklenirken hata:', neighbourhoodError);
            return [...staticPages, ...provinces.map(p => ({
                url: `${baseUrl}/${p.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.7
            }))];
        }

        // Hizmetler
        const { data: services, error: serviceError } = await supabase
            .from('services')
            .select('id, slug');

        if (serviceError) {
            console.error('Hizmetler yüklenirken hata:', serviceError);
            return [...staticPages, ...provinces.map(p => ({
                url: `${baseUrl}/${p.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.7
            }))];
        }

        // Çilingirler - Sadece aktif olanları getir
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
        if (provinces && services && services.length > 0) {
            provinces.forEach(province => {
                services.forEach(service => {
                    if (service && service.slug) {
                        provinceServiceUrls.push({
                            url: `${baseUrl}/${province.slug}/${service.slug}`,
                            lastModified: now,
                            changeFrequency: 'weekly',
                            priority: 0.7,
                        });
                    }
                });
            });
        }

        // İlçe sayfaları URL'leri (Sadece Bursa'nın ilçeleri)
        const districtUrls = [];
        if (provinces && provinces.length > 0) {
            provinces.forEach(province => {
                const provinceDistricts = districtsMap[province.id] || [];
                provinceDistricts.forEach(district => {
                    if (district && district.slug) {
                        districtUrls.push({
                            url: `${baseUrl}/${province.slug}/${district.slug}`,
                            lastModified: now,
                            changeFrequency: 'weekly',
                            priority: 0.6,
                        });
                    }
                });
            });
        }

        // İlçe + Hizmet sayfaları URL'leri (Sadece Bursa'nın ilçeleri)
        const districtServiceUrls = [];
        if (provinces && services && services.length > 0) {
            provinces.forEach(province => {
                const provinceDistricts = districtsMap[province.id] || [];
                provinceDistricts.forEach(district => {
                    services.forEach(service => {
                        if (district && district.slug && service && service.slug) {
                            districtServiceUrls.push({
                                url: `${baseUrl}/${province.slug}/${district.slug}/${service.slug}`,
                                lastModified: now,
                                changeFrequency: 'weekly',
                                priority: 0.6,
                            });
                        }
                    });
                });
            });
        }

        // Mahalle sayfaları URL'leri (Sadece Bursa'nın ilçelerinin mahalleleri)
        const neighbourhoodUrls = [];
        if (provinces && provinces.length > 0) {
            provinces.forEach(province => {
                const provinceDistricts = districtsMap[province.id] || [];
                provinceDistricts.forEach(district => {
                    const districtneighborhoods = neighborhoodsMap[district.id] || [];
                    districtneighborhoods.forEach(neighbourhood => {
                        if (neighbourhood && neighbourhood.slug) {
                            neighbourhoodUrls.push({
                                url: `${baseUrl}/${province.slug}/${district.slug}/${neighbourhood.slug}`,
                                lastModified: now,
                                changeFrequency: 'weekly',
                                priority: 0.5,
                            });
                        }
                    });
                });
            });
        }

        // Mahalle + Hizmet sayfaları URL'leri (Sadece Bursa'nın ilçelerinin mahalleleri)
        const neighborhoodserviceUrls = [];
        if (provinces && services && services.length > 0) {
            provinces.forEach(province => {
                const provinceDistricts = districtsMap[province.id] || [];
                provinceDistricts.forEach(district => {
                    const districtneighborhoods = neighborhoodsMap[district.id] || [];
                    districtneighborhoods.forEach(neighbourhood => {
                        services.forEach(service => {
                            if (neighbourhood && neighbourhood.slug && service && service.slug) {
                                neighborhoodserviceUrls.push({
                                    url: `${baseUrl}/${province.slug}/${district.slug}/${neighbourhood.slug}/${service.slug}`,
                                    lastModified: now,
                                    changeFrequency: 'weekly',
                                    priority: 0.5,
                                });
                            }
                        });
                    });
                });
            });
        }

        // Çilingir detay sayfaları URL'leri
        const locksmithUrls = [];
        if (locksmiths && locksmiths.length > 0) {
            locksmiths.forEach(locksmith => {
                if (locksmith && locksmith.slug) {
                    const lastMod = now;
                    locksmithUrls.push({
                        url: `${baseUrl}/cilingirler/${locksmith.slug}`,
                        lastModified: lastMod,
                        changeFrequency: 'weekly',
                        priority: 0.8, // Çilingir sayfaları daha yüksek önceliğe sahip olabilir
                    });
                }
            });
        }

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
    } catch (error) {
        console.error('Sitemap oluşturulurken hata:', error);
        // Hata durumunda en azından statik sayfaları döndür
        return [
            {
                url: 'https://www.bicilingir.com',
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: 'https://www.bicilingir.com/hakkimizda',
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: 'https://www.bicilingir.com/iletisim',
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: 'https://www.bicilingir.com/bilgi',
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
        ];
    }
} 