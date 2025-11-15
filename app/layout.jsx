import "./globals.css";
import Script from 'next/script';
// import { Inter } from 'next/font/google';
import localFont from "next/font/local";
import ClientLayout from './ClientLayout';

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Inter-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://bicilingir.com'),
  title: "Bi Çilingir - En yakın çilingiri bul",
  description: "Türkiye'nin ilk ve tek çilingir arama platformu. En yakın çilingir bul, fiyatları görün, karşılaştırın.",
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    canonical: 'https://bicilingir.com',
  },
  openGraph: {
    title: "Bi Çilingir - En yakın çilingiri bul",
    description: "Türkiye'nin ilk ve tek çilingir arama platformu. En yakın çilingir bul, fiyatları görün, karşılaştırın.",
    url: 'https://bicilingir.com',
    siteName: 'Bi Çilingir',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bi Çilingir - En yakın çilingiri bul",
    description: "Türkiye'nin ilk ve tek çilingir arama platformu. En yakın çilingir bul, fiyatları görün, karşılaştırın.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* DNS Prefetch ve Preconnect - Kritik kaynaklar için */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />

        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l] = w[l] || [];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-KNCFWKZ6');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KNCFWKZ6"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>

        {/* ClickCease - Lazy load, sadece gerektiğinde yükle */}
        <Script
          src="https://www.clickcease.com/monitor/stat.js"
          // strategy="afterInteractive"
          strategy="lazyOnload"
        />

        {/* ClickCease noscript fallback (isteğe bağlı) */}
        <noscript>
          <a href="https://www.clickcease.com" rel="nofollow">
            <img src="https://monitor.clickcease.com" alt="ClickCease" />
          </a>
        </noscript>

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 