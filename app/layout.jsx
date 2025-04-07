import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ToastProvider from '../components/ToastContext'
import Providers from './providers'

export const metadata = {
  title: "Bi Çilingir - En yakın çilingiri bul",
  description: "Türkiye'nin en büyük çilingir arama platformu",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="font-sans">
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