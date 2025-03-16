/** @type {import('next').NextConfig} */
const nextConfig = {
  // Font optimizasyonunu devre dışı bırakalım
  optimizeFonts: false,
  // Statik dosyaların yolunu düzeltelim
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  // CSS sorunlarını çözmek için ek yapılandırmalar
  experimental: {
    optimizeCss: true,
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
