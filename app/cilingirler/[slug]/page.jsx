import { permanentRedirect } from 'next/navigation';

// Eski slug'lardan yeni slug'lara manuel mapping (301 redirect için)
const OLD_TO_NEW_SLUG_MAP = {
  '23-nisan-cilingir-2176': 'bursa/nilufer/23-nisan-cilingir',
  'cilingir-erol-9dc6': 'bursa/mudanya/cilingir-erol',
  'inegol-cilingir-f100': 'bursa/inegol/inegol-cilingir',
  'susurluk-cilingir-ef5c': 'balikesir/susurluk/susurluk-cilingir',
  'cilingir-ayhan-45b1': 'bursa/gemlik/cilingir-ayhan',
  'mudanya-cilingir-7e49': 'bursa/mudanya/mudanya-cilingir',
  'akgul-cilingir-479d': 'bursa/nilufer/akgul-cilingir',
  'osmangazi-cilingir-6e71': 'bursa/osmangazi/osmangazi-cilingir',
  'nilufer-cilingir-a790': 'bursa/nilufer/nilufer-cilingir',
  'anahtarci-emin-cda2': 'bursa/nilufer/anahtarci-emin',
  'yasa-cilingir-4905': 'istanbul/bayrampasa/yasa-cilingir',
  'tarsus-cilingir-erat-ev-oto-anahtarci-e774': 'mersin/tarsus/tarsus-cilingir-erat-ev-oto-anahtarci',
  'cilingir-omer-94dd': 'bursa/nilufer/cilingir-omer',
  'bursa-bati-cilingir-cabd': 'bursa/osmangazi/bursa-bati-cilingir',
  'cilingir-gemlik-7b97': 'bursa/gemlik/cilingir-gemlik',
  'acar-anahtar-10cc': 'bursa/inegol/acar-anahtar',
  'pasa-cilingir-4f17': 'bursa/mustafakemalpasa/pasa-cilingir',
  'cilingir-kasim-3a8d': 'istanbul/basaksehir/cilingir-kasim',
  'ozmen-cilingir-6667': 'bursa/yildirim/ozmen-cilingir',
};

// Build zamanında sayfa oluşturma - sadece manuel mapping'deki eski slug'lar için
// Bu sayfalar sadece redirect yapacak, içerik render etmeyecek
export async function generateStaticParams() {
  // Sadece manuel mapping'deki eski slug'lar için sayfa oluştur
  // Bu sayfalar sadece redirect yapacak
  return Object.keys(OLD_TO_NEW_SLUG_MAP).map((oldSlug) => ({
    slug: oldSlug,
  }));
}

// Sayfa bileşeni - 301 redirect
export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Önce manuel mapping'de kontrol et
  if (OLD_TO_NEW_SLUG_MAP[slug]) {
    const newUrl = `/${OLD_TO_NEW_SLUG_MAP[slug]}`;
    permanentRedirect(newUrl);
  }

  // Eğer mapping'de yoksa, slug'ın zaten yeni format olduğunu varsay
  // (locksmiths.slug artık city/district/locksmith formatında)
  const newUrl = `/${slug}`;
  permanentRedirect(newUrl);
}

// Yapılandırma ayarları - redirect sayfaları için
// Bu sayfalar sadece redirect yapacak, içerik render etmeyecek
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
