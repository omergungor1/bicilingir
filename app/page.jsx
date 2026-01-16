import HomeClient from './HomeClient';

// SEO uyumlu metadata
export const metadata = {
  title: 'En Yakın Çilingir Bul | 7/24 Acil Çilingir Hizmeti - Bi Çilingir',
  description: 'Türkiye\'nin en büyük çilingir arama platformu. En yakın çilingir, anahtarcı ve oto anahtarcı telefonlarını bulun. 7/24 acil çilingir hizmeti, kapı açma, kilit değiştirme ve anahtar çoğaltma. Fiyatları karşılaştırın, hemen arayın!',
  keywords: 'en yakın çilingir, çilingir telefonu, acil çilingir, 7/24 çilingir, kapı açma, kilit değiştirme, anahtarcı, oto anahtarcı, çilingir fiyatları, kapıda kaldım, anahtar içeride kaldı, çilingir rehberi, biçilingir, bursa çilingir, istanbul çilingir',
  authors: [{ name: 'Bi Çilingir' }],
  creator: 'Bi Çilingir',
  publisher: 'Bi Çilingir',
  openGraph: {
    title: 'En Yakın Çilingir Bul | 7/24 Acil Çilingir Hizmeti - Bi Çilingir',
    description: 'Türkiye\'nin en büyük çilingir arama platformu. En yakın çilingir, anahtarcı ve oto anahtarcı telefonlarını bulun. 7/24 acil çilingir hizmeti.',
    url: 'https://bicilingir.com',
    siteName: 'Bi Çilingir',
    images: [
      {
        url: 'https://bicilingir.com/images/infocard.png',
        width: 1200,
        height: 630,
        alt: 'Bi Çilingir - En Yakın Çilingir Bul',
      }
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'En Yakın Çilingir Bul | 7/24 Acil Çilingir Hizmeti - Bi Çilingir',
    description: 'Türkiye\'nin en büyük çilingir arama platformu. En yakın çilingir, anahtarcı ve oto anahtarcı telefonlarını bulun.',
    images: ['https://bicilingir.com/images/infocard.png'],
    creator: '@bicilingir',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://bicilingir.com',
  },
};

export default function Home() {
  return <HomeClient />;
}
