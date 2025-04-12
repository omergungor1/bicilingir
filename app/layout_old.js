import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Bi Çilingir - En yakın çilingiri bul',
  description: 'Türkiye\'nin ilk ve tek çilingir arama platformu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
} 