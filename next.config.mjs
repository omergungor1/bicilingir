/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ocljqspluklgxppjctnj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Statik dosyaların yolunu düzeltelim
  poweredByHeader: false,
  reactStrictMode: true,
  // CSS sorunlarını çözmek için ek yapılandırmalar
  experimental: {
    // optimizeCss: {
    //   // CSS optimizasyonu için critters ayarları
    //   critters: {
    //     // Tüm CSS'leri inline yapmak yerine, sadece kritik olanları inline yap
    //     pruneSource: true,
    //     // Yazı tiplerini inline yapma
    //     inlineFonts: false,
    //     // Medya sorgularını inline yapma
    //     reduceInlineStyles: true,
    //     // Kritik olmayan CSS'leri geciktir
    //     preload: "swap"
    //   }
    // },
    optimizeCss:false,
    forceSwcTransforms: true,
  },
  // Önbellek sorunlarını çözmek için
  onDemandEntries: {
    // Sayfaların bellekte tutulma süresi (ms)
    maxInactiveAge: 25 * 1000,
    // Aynı anda bellekte tutulacak sayfa sayısı
    pagesBufferLength: 2,
  },
};

export default nextConfig; 