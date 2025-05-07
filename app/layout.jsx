import "./globals.css";
import Script from 'next/script';
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastProvider from '../components/ToastContext'
import Providers from './providers'


//Bunu sonradan ekledik
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })
// Bunu sonradan ekledik *** Cach hatası için

export const metadata = {
  title: "Bi Çilingir - En yakın çilingiri bul",
  description: "Türkiye'nin ilk ve tek çilingir arama platformu. En yakın çilingir bul, fiyatları görün, karşılaştırın.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Schema.org yapıları bu alanda olacak - Next.js tarafından otomatik eklenir */}
      </head>
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4Y185JLHGY"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-4Y185JLHGY');
          `}
        </Script>

        {/* Kullanıcı ID ve Oturum Yönetimi */}
        <Script id="user-tracking" strategy="beforeInteractive">
          {`
            // UUID oluşturma fonksiyonu
            function generateUUID() {
              return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, function (c) {
                const r = Math.random() * 16 | 0;
                return r.toString(16);
              });
            }
            
            // Kullanıcı ID'si varsa al, yoksa oluştur
            if (!localStorage.getItem('userId')) {
              localStorage.setItem('userId', generateUUID());
            }
            
            // Oturum ID'si - her sayfa yüklemesinde veya belirli aralıklarla yenilenir
            const sessionId = localStorage.getItem('sessionId') || generateUUID();
            localStorage.setItem('sessionId', sessionId);
          `}
        </Script>

        <Providers>
          <ToastProvider>
            <Header />
            <div className="global-loading-container">
              <div className="global-loader"></div>
            </div>
            <div className="custom-notification-container"></div>
            {children}
            <Footer />
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
} 