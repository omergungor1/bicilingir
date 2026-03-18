"use client";

import React, { useState } from "react";
import IlIlceArama from "./IlIlceArama";

/**
 * En yakın çilingir arama - Hero tarzı modern kart
 * Mobil uyumlu, container içinde
 */
export default function EnYakinCilingirHero() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="w-full py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 md:p-8 shadow-xl shadow-blue-900/25">
          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-blue-900/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
                <span className="text-sm font-medium text-white">Yönlendiriliyor...</span>
              </div>
            </div>
          )}
          {/* Dekoratif arka plan - kart içinde kalacak şekilde */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-40 h-40 -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
            <div className="absolute bottom-0 left-0 w-24 h-24 translate-y-1/2 -translate-x-1/2 rounded-full bg-white" />
          </div>

          <div className="relative z-10">
            {/* Başlık */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 text-center">
              En Yakın Çilingir
            </h2>
            <p className="text-blue-100 text-sm md:text-base text-center mb-6 md:mb-8">
              En yakın çilingiri bulmak için il veya ilçenizi yazınız
            </p>

            {/* Arama kutusu - beyaz kart içinde */}
            <div className="relative z-20 bg-white rounded-xl shadow-lg p-2 md:p-3">
              <div className="relative">
                <svg
                  className="absolute z-10 left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <IlIlceArama
                  placeholder="İl veya ilçe yazınız..."
                  className="pl-10 md:pl-12 pr-10 md:pr-12 h-12 md:h-14 py-3 bg-gray-50 text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-base"
                  onNavigateStart={() => setIsLoading(true)}
                />
              </div>
            </div>

            {/* Alt bilgi */}
            <p className="text-blue-200/90 text-xs md:text-sm text-center mt-4">
              İlçe seçerek sana en yakın çilingirler telefon numarasını ve adreslerini görebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
