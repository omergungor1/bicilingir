import { getSupabaseServer } from '../lib/supabase';

// Next.js App Router için dinamik sitemap oluşturma
export default async function sitemap() {
    // Baz URL - kesin URL kullan
    const baseUrl = 'https://bicilingir.com';

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
            {
                url: `${baseUrl}/fiyat-listesi`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/cilingir-cagirmadan-once-bilmeniz-gerekenler`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.8,
            },
        ];


        const { data: provinces, error: provinceError } = await supabase
            .from('provinces')
            .select('id, name, slug')
            .in('id', [34, 6, 35, 16, 7, 42, 1, 63, 27, 41]);

        if (provinceError) {
            console.error('İller yüklenirken hata:', provinceError);
            // Hata durumunda en azından statik sayfaları döndür
            return staticPages;
        }

        // Bursa, İstanbul, İzmir ve Ankara illerinin ilçelerini getir
        const { data: districts, error: districtError } = await supabase
            .from('districts')
            .select('id, name, slug, province_id')
            .in('province_id', [34, 6, 35, 16, 7, 42, 1, 63, 27, 41]);

        if (districtError) {
            console.error('İlçeler yüklenirken hata:', districtError);
            return staticPages;
        }

        // Bursa, İstanbul, İzmir ve Ankara ilçelerinin mahallelerini getir
        const districtIds = districts ? districts.map(d => d.id) : [];

        const { data: neighborhoods, error: neighbourhoodError } = await supabase
            .from('neighborhoods')
            .select('id, name, slug, district_id')
            .in('district_id', districtIds);  // Bursa, İstanbul, İzmir ve Ankara ilçelerinin mahallelerini filtrele

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
            .eq('isactive', true)
            .eq('status', 'approved');

        if (locksmithError) {
            console.error('Çilingirler yüklenirken hata:', locksmithError);
        }

        // Blog yazıları - Sadece yayınlanmış olanları getir (neighborhoods da dahil et)
        const { data: blogs, error: blogError } = await supabase
            .from('blogs')
            .select(`
                id, 
                slug, 
                updated_at, 
                published_at,
                provinces (slug),
                districts (slug),
                neighborhoods (slug),
                services (slug)
            `)
            .eq('status', 'published')
            .order('published_at', { ascending: false });

        if (blogError) {
            console.error('Blog yazıları yüklenirken hata:', blogError);
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

        // İl sayfaları URL'leri (Bursa ve İstanbul)
        const provinceUrls = provinces ? provinces.map(province => {
            return {
                url: `${baseUrl}/${province.slug}`,
                lastModified: now,
                changeFrequency: 'weekly',
                priority: 0.7,
            };
        }) : [];

        // İl + Hizmet sayfaları URL'leri kaldırıldı - 301 redirect yapıldı
        const provinceServiceUrls = [];


        // İlçe sayfaları URL'leri (Bursa ve İstanbul'un ilçeleri)
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


        // Çilingir detay sayfaları URL'leri
        const locksmithUrls = [];
        if (locksmiths && locksmiths.length > 0) {
            locksmiths.forEach(locksmith => {
                if (locksmith && locksmith.slug) {
                    const lastMod = now;
                    locksmithUrls.push({
                        url: `${baseUrl}/${locksmith.slug}`,
                        lastModified: lastMod,
                        changeFrequency: 'weekly',
                        priority: 0.8, // Çilingir sayfaları daha yüksek önceliğe sahip olabilir
                    });
                }
            });
        }

        // Blog sayfaları URL'leri
        const blogUrls = [
            {
                url: `${baseUrl}/blog`,
                lastModified: now,
                changeFrequency: 'daily',
                priority: 0.8,
            }
        ];

        // Blog detay sayfaları
        if (blogs && blogs.length > 0) {
            blogs.forEach(blog => {
                if (blog && blog.slug) {
                    const lastMod = blog.updated_at || blog.published_at || now;
                    blogUrls.push({
                        url: `${baseUrl}/blog/${blog.slug}`,
                        lastModified: lastMod,
                        changeFrequency: 'weekly',
                        priority: 0.7,
                    });
                }
            });
        }


        // Tüm URL'leri birleştir
        return [
            ...staticPages,
            ...blogUrls, // Blog sayfalarını ekledik
            ...locksmithUrls, // Çilingir sayfalarını ekledik
            ...provinceUrls,
            ...districtUrls,
            // Mahalle ve servis detay sayfaları kaldırıldı - 301 redirect yapıldı
        ];
    } catch (error) {
        console.error('Sitemap oluşturulurken hata:', error);
        // Hata durumunda en azından statik sayfaları döndür
        return [
            {
                url: 'https://bicilingir.com',
                lastModified: new Date().toISOString(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: 'https://bicilingir.com/hakkimizda',
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: 'https://bicilingir.com/iletisim',
                lastModified: new Date().toISOString(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: 'https://bicilingir.com/bilgi',
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
        ];
    }
} 