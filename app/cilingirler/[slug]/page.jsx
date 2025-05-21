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
}

// Her bir çilingir sayfası için metadata oluştur
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/locksmith/${resolvedParams.slug}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    return {
      title: 'Çilingir Bulunamadı',
      description: 'Aradığınız çilingir bulunamadı.'
    };
  }

  const locksmith = data.locksmith;

  return {
    title: `${locksmith.businessname || locksmith.fullname} - 7/24 Çilingir Hizmeti`,
    description: locksmith.tagline || `${locksmith.province} ${locksmith.district} bölgesinde 7/24 çilingir hizmeti`,
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
}

// Sayfa bileşeni
export default async function Page({ params }) {
  const resolvedParams = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/public/locksmith/${resolvedParams.slug}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    notFound();
  }

  const locksmith = data.locksmith;

  // Benzer çilingirleri getir
  const { data: similarLocksmiths } = await supabase
    .from('locksmiths')
    .select(`
      id,
      slug,
      businessname,
      fullname,
      province,
      district,
      tagline,
      avgrating,
      totalreviewcount
    `)
    .eq('isactive', true)
    .eq('status', 'approved')
    .eq('province', locksmith.province)
    .neq('id', locksmith.id)
    .limit(3);

  return (
    <LocksmithDetail
      locksmith={locksmith}
      similarLocksmiths={similarLocksmiths || []}
    />
  );
}

// Yapılandırma ayarları
export const dynamic = 'force-static';
export const revalidate = 86400; // Günde bir kez yeniden oluştur
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 5; 