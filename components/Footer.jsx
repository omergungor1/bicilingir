'use client';

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  const pathname = usePathname();


  if (pathname === '/cilingir' || pathname === '/admin') {
    return null;
  }

  return (
    <footer className="w-full bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Bi Çilingir</h3>
            <p className="text-gray-300">
              Türkiye'nin en büyük çilingir pazaryeri. 7/24 hizmet veren profesyonel çilingirler.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Hizmetlerimiz</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/cilingirler" className="hover:text-white">Çilingir Bul</Link></li>
              <li><Link href="/auth/register" className="hover:text-white">Çilingir Kayıt</Link></li>
              <li><Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link href="/hakkimizda" className="hover:text-white">Hakkımızda</Link></li>
              <li><Link href="/cilingirler" className="hover:text-white">Çilingir Ol</Link></li>
              <li><a href="#" className="hover:text-white">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">İletişim</h3>
            <ul className="space-y-2 text-gray-300">
              <li>info@bicilingir.com</li>
              <li>+90 850 123 45 67</li>
              <li>İstanbul, Türkiye</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-white hover:text-blue-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path></svg>
              </a>
              <a href="#" className="text-white hover:text-pink-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p>© 2023 Bi Çilingir. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
} 