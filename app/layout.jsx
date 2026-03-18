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
  other: {
    // Preconnect için metadata
    'dns-prefetch': 'https://www.googletagmanager.com https://maps.googleapis.com',
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

        {/* TrafficGuard Integration */}
        <Script id="trafficguard" strategy="afterInteractive">
          {`
            var dataTrafficGuard = window.dataTrafficGuard || [];
            dataTrafficGuard.push(['property', 'tg-023507-001']);
            dataTrafficGuard.push(['event','pageview']);
            (function() {
              var tg = document.createElement('script');
              tg.type = 'text/javascript';
              tg.async = true;
              tg.src = '//tgtag.io/tg.js?pid=tg-023507-001';
              var s = document.getElementsByTagName('script')[0];
              s.parentNode.insertBefore(tg, s);
            })();
          `}
        </Script>
        <noscript>
          <img
            src="//p.tgtag.io/event?property_id=tg-023507-001&event_name=pageview&no_script=1"
            width="1"
            height="1"
            border="0"
            alt=""
          />
        </noscript>
        {/* TrafficGuard End */}

        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
} 