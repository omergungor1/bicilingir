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
  trailingSlash: false,
  // Statik dosyaların yolunu düzeltelim
  poweredByHeader: false,
  reactStrictMode: true,
  // CSS sorunlarını çözmek için ek yapılandırmalar
  // experimental: {
  //   // optimizeCss: {
  //   //   // CSS optimizasyonu için critters ayarları
  //   //   critters: {
  //   //     // Tüm CSS'leri inline yapmak yerine, sadece kritik olanları inline yap
  //   //     pruneSource: true,
  //   //     // Yazı tiplerini inline yapma
  //   //     inlineFonts: false,
  //   //     // Medya sorgularını inline yapma
  //   //     reduceInlineStyles: true,
  //   //     // Kritik olmayan CSS'leri geciktir
  //   //     preload: "swap"
  //   //   }
  //   // },
  //   optimizeCss: false,
  //   forceSwcTransforms: true,
  // },
  // Önbellek sorunlarını çözmek için
  onDemandEntries: {
    // Sayfaların bellekte tutulma süresi (ms)
    maxInactiveAge: 25 * 1000,
    // Aynı anda bellekte tutulacak sayfa sayısı
    pagesBufferLength: 2,
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        destination: 'https://bicilingir.com/:path*',
        has: [
          {
            type: 'header',
            key: 'host',
            value: 'www.bicilingir.com',
          },
        ],
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Auth-Token, X-Requested-With, x-auth-token' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Max-Age', value: '86400' },
          { key: 'Access-Control-Expose-Headers', value: 'Authorization, X-Auth-Token' },
        ],
      },
    ]
  },
};

export default nextConfig; 