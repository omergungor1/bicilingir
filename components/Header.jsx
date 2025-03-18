'use client';

import React, { useState } from "react";
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
  
  return (
    <header style={styles.header} className="w-full text-white">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-2 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
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
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/' ? ' border-2 md:border-0 border-white md:border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link 
                href="/hizmetler" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/hizmetler' ? '  border-2 md:border-0 border-white md:border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hizmetler
              </Link>
            </li>
            <li>
              <Link 
                href="/cilingirler" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/cilingirler' ? '  border-2 md:border-0 border-white md:border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Çilingirler
              </Link>
            </li>
            <li>
              <Link 
                href="/hakkimizda" 
                className={`text-white hover:text-blue-200 transition-colors block py-2 p-2 md:py-0 ${pathname === '/hakkimizda' ? '  border-2 md:border-0 border-white md:border-b-2 border-white' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 