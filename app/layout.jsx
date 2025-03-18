import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata = {
  title: "Bi Çilingir",
  description: "Türkiye'nin en büyük çilingir pazaryeri",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
} 