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
  poweredByHeader: false,
  reactStrictMode: true,
  // Compiler optimizasyonları
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // CSS ve asset optimizasyonları
  swcMinify: true,
  // App Router için önbellek ayarları
  // onDemandEntries Pages Router için kullanılır, App Router'da gerek yok
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
      {
        // CSS ve font dosyaları için cache ve optimizasyon headers
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Font dosyaları için optimizasyon
        source: '/fonts/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        ],
      },
    ]
  },
};

export default nextConfig; 