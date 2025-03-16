/** @type {import('next').NextConfig} */
const nextConfig = {
  // Font optimizasyonunu devre dışı bırakalım
  optimizeFonts: false,
  // Statik dosyaların yolunu düzeltelim
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
