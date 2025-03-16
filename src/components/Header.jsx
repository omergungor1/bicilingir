'use client';

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const styles = {
  header: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  }
};

export default function Header() {
  const pathname = usePathname();
  
  return (
    <header style={styles.header} className="w-full text-white">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        {/* Logo */}
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 mr-2 bg-white rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
            </svg>
          </div>
          <Link href="/" className="text-xl font-bold text-white">Bi Çilingir</Link>
        </div>

        {/* Navbar - Orta */}
        <nav className="flex mb-4 md:mb-0">
          <ul className="flex space-x-6">
            <li>
              <Link 
                href="/" 
                className={`text-white hover:text-blue-200 transition-colors ${pathname === '/' ? 'font-bold border-b-2 border-white' : ''}`}
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link 
                href="/hizmetler" 
                className={`text-white hover:text-blue-200 transition-colors ${pathname === '/hizmetler' ? 'font-bold border-b-2 border-white' : ''}`}
              >
                Hizmetler
              </Link>
            </li>
            <li>
              <Link 
                href="/cilingirler" 
                className={`text-white hover:text-blue-200 transition-colors ${pathname === '/cilingirler' ? 'font-bold border-b-2 border-white' : ''}`}
              >
                Çilingirler
              </Link>
            </li>
            <li>
              <Link 
                href="/hakkimizda" 
                className={`text-white hover:text-blue-200 transition-colors ${pathname === '/hakkimizda' ? 'font-bold border-b-2 border-white' : ''}`}
              >
                Hakkımızda
              </Link>
            </li>
          </ul>
        </nav>
        
        <div>

        </div>
      </div>
    </header>
  );
} 