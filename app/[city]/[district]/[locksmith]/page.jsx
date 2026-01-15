import { createClient } from '@supabase/supabase-js';
import { notFound, permanentRedirect } from 'next/navigation';
import LocksmithDetail from '../../../cilingirler/[slug]/LocksmithDetail';

// Supabase istemcisini oluştur
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Build zamanında tüm çilingir sluglarını ve mahalle sluglarını getir
export async function generateStaticParams() {
    try {
        const params = [];

        // Çilingir sluglarını getir
        // locksmiths.slug artık city/district/locksmith formatında
        const { data: locksmiths, error: locksmithError } = await supabase
            .from('locksmiths')
            .select('slug')
            .eq('isactive', true)
            .eq('status', 'approved');

        if (!locksmithError && locksmiths) {
            // Her çilingir slug'ını parse et
            // Format: city/district/locksmith
            locksmiths.forEach((locksmith) => {
                if (locksmith.slug) {
                    const slugParts = locksmith.slug.split('/');
                    if (slugParts.length === 3) {
                        params.push({
                            city: slugParts[0],
                            district: slugParts[1],
                            locksmith: slugParts[2],
                        });
                    }
                }
            });
        }

        // Bursa'nın ilçelerini getir
        const { data: districts, error: districtsError } = await supabase
            .from('districts')
            .select('id, slug, province_id')
            .eq('province_id', 16); // Sadece Bursa

        if (!districtsError && districts) {
            const districtIds = districts.map(d => d.id);
            const districtMap = districts.reduce((map, d) => {
                map[d.id] = d.slug;
                return map;
            }, {});

            // Bursa'nın province slug'ını al
            const { data: bursa } = await supabase
                .from('provinces')
                .select('slug')
                .eq('id', 16)
                .single();

            if (bursa && districtIds.length > 0) {
                // Mahalle sluglarını getir
                const { data: neighborhoods, error: neighborhoodError } = await supabase
                    .from('neighborhoods')
                    .select('slug, district_id')
                    .in('district_id', districtIds);

                if (!neighborhoodError && neighborhoods) {
                    neighborhoods.forEach((neighborhood) => {
                        const districtSlug = districtMap[neighborhood.district_id];
                        if (districtSlug) {
                            params.push({
                                city: bursa.slug,
                                district: districtSlug,
                                locksmith: neighborhood.slug,
                            });
                        }
                    });
                }
            }
        }

        return params;
    } catch (error) {
        console.error('generateStaticParams hatası:', error);
        return [];
    }
}

// Her bir sayfa için metadata oluştur
export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const { city, district, locksmith } = resolvedParams;

        // locksmiths.slug artık city/district/locksmith formatında
        const fullSlug = `${city}/${district}/${locksmith}`;

        // Önce çilingir olup olmadığını kontrol et
        const { data: locksmithData, error: locksmithError } = await supabase
            .from('locksmiths')
            .select(`
        *,
        provinces!locksmiths_provinceid_fkey (
          name,
          slug
        ),
        districts!locksmiths_districtid_fkey (
          name,
          slug
        )
      `)
            .eq('slug', fullSlug)
            .eq('isactive', true)
            .eq('status', 'approved')
            .single();

        if (!locksmithError && locksmithData) {
            // Çilingir sayfası için metadata
            return {
                title: `${locksmithData.businessname || locksmithData.fullname} - 7/24 Çilingir Hizmeti`,
                description: locksmithData.tagline || `${locksmithData.provinces.name} ${locksmithData.districts.name} bölgesinde 7/24 çilingir hizmeti`,
                openGraph: {
                    title: `${locksmithData.businessname || locksmithData.fullname} | 7/24 Çilingir`,
                    description: locksmithData.tagline || `✓ 7/24 Hizmet\n✓ Hızlı Servis\n✓ Profesyonel Ekip`,
                    type: 'website',
                    locale: 'tr_TR',
                    url: `https://bicilingir.com/${city}/${district}/${locksmith}`,
                    siteName: 'Bi Çilingir',
                    images: locksmithData.locksmith_images?.find(img => img.is_profile)?.image_url ? [{
                        url: locksmithData.locksmith_images.find(img => img.is_profile).image_url,
                        width: 1200,
                        height: 630,
                        alt: `${locksmithData.businessname || locksmithData.fullname} Profil Resmi`
                    }] : undefined
                }
            };
        }

        // Mahalle sayfası için metadata (redirect edilecek)
        return {
            title: 'Çilingir Bulunamadı',
            description: 'Aradığınız sayfa bulunamadı.'
        };
    } catch (error) {
        console.error('generateMetadata hatası:', error);
        return {
            title: 'Çilingir Bulunamadı',
            description: 'Aradığınız sayfa bulunamadı.'
        };
    }
}

// Sayfa bileşeni
export default async function Page({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug, locksmith: locksmithSlug } = resolvedParams;

    // Özel path'leri filtrele (.well-known, vb.)
    if (citySlug?.startsWith('.') || districtSlug?.startsWith('.') || locksmithSlug?.startsWith('.')) {
        notFound();
    }

    // locksmiths.slug artık city/district/locksmith formatında
    // Örnek: bursa/nilufer/cilingir-emin
    const fullSlug = `${citySlug}/${districtSlug}/${locksmithSlug}`;

    try {
        // Önce çilingir olup olmadığını kontrol et
        // locksmiths.slug artık tam path formatında (city/district/locksmith)
        const { data: locksmith, error: locksmithError } = await supabase
            .from('locksmiths')
            .select(`
        *,
        provinces!locksmiths_provinceid_fkey (
          name,
          slug
        ),
        districts!locksmiths_districtid_fkey (
          name,
          slug
        ),
        locksmith_details (*),
        services (*),
        locksmith_certificates (*),
        locksmith_images (*),
        locksmith_working_hours (*),
        reviews (*)
      `)
            .eq('slug', fullSlug)
            .eq('isactive', true)
            .eq('status', 'approved')
            .single();

        if (!locksmithError && locksmith) {
            // Çilingir sayfası - çilingir detayını göster
            // Benzer çilingirleri getir
            const { data: similarLocksmiths, error: similarError } = await supabase
                .from('locksmiths')
                .select(`
          id,
          slug,
          businessname,
          fullname,
          provinceid,
          districtid,
          tagline,
          avgrating,
          totalreviewcount,
          provinces!locksmiths_provinceid_fkey (
            name,
            slug
          ),
          districts!locksmiths_districtid_fkey (
            name,
            slug
          ),
          locksmith_images (
            image_url,
            is_profile
          )
        `)
                .eq('isactive', true)
                .eq('status', 'approved')
                .eq('provinceid', locksmith.provinceid)
                .neq('id', locksmith.id)
                .limit(3);

            if (similarError) {
                console.error('Benzer çilingirler alınırken hata:', similarError);
            }

            // Breadcrumb navigasyonu için navbarList oluştur
            const navbarList = [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: locksmith.provinces.name, slug: `/${locksmith.provinces.slug}` },
                { id: 3, name: locksmith.districts.name, slug: `/${locksmith.provinces.slug}/${locksmith.districts.slug}` },
                { id: 4, name: locksmith.businessname || locksmith.fullname, slug: '#' }
            ];

            return (
                <LocksmithDetail
                    locksmith={locksmith}
                    similarLocksmiths={similarLocksmiths || []}
                    navbarList={navbarList}
                />
            );
        }
    } catch (error) {
        // Sadece gerçek hataları catch et, redirect exception'larını değil
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; // Redirect exception'ını tekrar fırlat
        }
        console.error('Page component hatası:', error);
        notFound();
    }

    // Mahalle sayfası - ilçe sayfasına redirect et
    // Redirect'i try-catch dışına alıyoruz çünkü permanentRedirect bir exception fırlatır
    permanentRedirect(`/${citySlug}/${districtSlug}`);
}

// Yapılandırma ayarları
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 5;
