import "./globals.css";
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
  description: "Türkiye'nin ilk ve tek çilingir arama platformu",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-17009716148"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17009716148');
          `
        }} />
      </head>
      {/* <body className="font-sans"> */}
      <body className={inter.className}>
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