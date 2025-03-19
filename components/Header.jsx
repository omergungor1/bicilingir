'use client';

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const styles = {
  header: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  }
};

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (pathname === '/cilingir' || pathname === '/admin') {
    return null;
  }

  return (
    <header style={styles.header} className="w-full text-white">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-2 rounded-full flex items-center justify-center">
              <Image src="/logo.png" alt="Bi Çilingir" width={100} height={100} />
            </div>
            <Link href="/" className="text-xl font-bold text-white">Bi Çilingir</Link>
          </div>
          
          {/* Hamburger Menü Butonu - Sadece Mobil */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Menüyü Aç/Kapat"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Navbar - Mobil için açılır menü, Masaüstü için normal görünüm */}
        <nav className={`${isMenuOpen ? 'flex border-1 border-white rounded-lg p-2 shadow-lg' : 'hidden'} md:flex  flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0`}>
          <ul className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-6">
            <li>
              <Link 
                href="/" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/' ? ' border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link 
                href="/hizmetler" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/hizmetler' ? '  border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hizmetler
              </Link>
            </li>
            <li>
              <Link 
                href="/cilingirler" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/cilingirler' ? '  border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Çilingirler
              </Link>
            </li>
            <li>
              <Link 
                href="/hakkimizda" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/hakkimizda' ? '  border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link 
                href="/iletisim" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/iletisim' ? '  border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 