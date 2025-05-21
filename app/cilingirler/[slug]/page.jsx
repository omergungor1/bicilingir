import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import LocksmithDetail from './LocksmithDetail';

// Supabase istemcisini oluştur
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Build zamanında tüm çilingir sluglarını getir
export async function generateStaticParams() {
  try {
    const { data: locksmiths, error } = await supabase
      .from('locksmiths')
      .select('slug')
      .eq('isactive', true)
      .eq('status', 'approved');

    if (error) {
      console.error('Çilingir slugları alınırken hata:', error);
      return [];
    }

    return locksmiths.map((locksmith) => ({
      slug: locksmith.slug,
    }));
  } catch (error) {
    console.error('generateStaticParams hatası:', error);
    return [];
  }
}

// Her bir çilingir sayfası için metadata oluştur
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const { data: locksmith, error } = await supabase
      .from('locksmiths')
      .select(`
        *,
        provinces!locksmiths_provinceid_fkey (
          name
        ),
        districts!locksmiths_districtid_fkey (
          name
        )
      `)
      .eq('slug', resolvedParams.slug)
      .single();

    if (error || !locksmith) {
      return {
        title: 'Çilingir Bulunamadı',
        description: 'Aradığınız çilingir bulunamadı.'
      };
    }

    return {
      title: `${locksmith.businessname || locksmith.fullname} - 7/24 Çilingir Hizmeti`,
      description: locksmith.tagline || `${locksmith.provinces.name} ${locksmith.districts.name} bölgesinde 7/24 çilingir hizmeti`,
      openGraph: {
        title: `${locksmith.businessname || locksmith.fullname} | 7/24 Çilingir`,
        description: locksmith.tagline || `✓ 7/24 Hizmet\n✓ Hızlı Servis\n✓ Profesyonel Ekip`,
        type: 'website',
        locale: 'tr_TR',
        url: `https://bicilingir.com/cilingirler/${locksmith.slug}`,
        siteName: 'Bi Çilingir',
        images: locksmith.locksmith_images?.find(img => img.is_profile)?.image_url ? [{
          url: locksmith.locksmith_images.find(img => img.is_profile).image_url,
          width: 1200,
          height: 630,
          alt: `${locksmith.businessname || locksmith.fullname} Profil Resmi`
        }] : undefined
      }
    };
  } catch (error) {
    console.error('generateMetadata hatası:', error);
    return {
      title: 'Çilingir Bulunamadı',
      description: 'Aradığınız çilingir bulunamadı.'
    };
  }
}

// Sayfa bileşeni
export default async function Page({ params }) {
  try {
    const resolvedParams = await params;
    // Ana çilingir verilerini getir
    const { data: locksmith, error: locksmithError } = await supabase
      .from('locksmiths')
      .select(`
        *,
        provinces!locksmiths_provinceid_fkey (
          name
        ),
        districts!locksmiths_districtid_fkey (
          name
        ),
        locksmith_details (*),
        services (*),
        locksmith_certificates (*),
        locksmith_images (*),
        locksmith_working_hours (*),
        reviews (*)
      `)
      .eq('slug', resolvedParams.slug)
      .eq('isactive', true)
      .eq('status', 'approved')
      .single();

    if (locksmithError || !locksmith) {
      console.error('Çilingir verileri alınırken hata:', locksmithError);
      notFound();
    }

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
        provinces (
          name
        ),
        districts!locksmiths_districtid_fkey (
          name
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

    return (
      <LocksmithDetail
        locksmith={locksmith}
        similarLocksmiths={similarLocksmiths || []}
      />
    );
  } catch (error) {
    console.error('Page component hatası:', error);
    notFound();
  }
}

// Yapılandırma ayarları
export const dynamic = 'force-static';
export const revalidate = 86400; // Günde bir kez yeniden oluştur
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 5; 