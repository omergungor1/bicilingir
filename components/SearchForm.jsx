"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdresArama from "@/components/AdresArama";

export default function SearchForm() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedService, setSelectedService] = useState("");

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    console.log("Seçilen adres:", place.formatted_address);
  };

  const handleServiceSelect = (value) => {
    setSelectedService(value);
    console.log("Seçilen hizmet:", value);
  };

  const handleSearch = () => {
    if (!selectedPlace) {
      alert("Lütfen bir adres girin");
      return;
    }

    console.log("Arama yapılıyor:", {
      adres: selectedPlace.formatted_address,
      hizmet: selectedService
    });
    
    // Burada arama işlemini gerçekleştirebilirsiniz
    // Örneğin: router.push(`/search?address=${encodeURIComponent(selectedPlace.formatted_address)}&service=${selectedService}`);
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-2 justify-center items-center w-full">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>

          <AdresArama 
            onPlaceSelect={handlePlaceSelect}
            placeholder="Adresinizi girin (İl veya İlçe)"
            className="pl-10 h-10 md:h-14 py-3 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        
        <div className="w-full md:w-1/4 mt-2 md:mt-0">
          <Select onValueChange={handleServiceSelect}>
            <SelectTrigger className="h-10 md:h-14 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500">
              <SelectValue placeholder="Hizmet Seçin" />
            </SelectTrigger>
            <SelectContent className="select-content">
              <SelectItem value="kapi-acma" className="select-item">Kapı Açma</SelectItem>
              <SelectItem value="oto-cilingir" className="select-item">Oto Çilingir</SelectItem>
              <SelectItem value="kasa-cilingir" className="select-item">Kasa Çilingir</SelectItem>
              <SelectItem value="kilit-degistirme" className="select-item">Kilit Değiştirme</SelectItem>
              <SelectItem value="celik-kapi" className="select-item">Çelik Kapı</SelectItem>
              <SelectItem value="anahtar-kopyalama" className="select-item">Anahtar Kopyalama</SelectItem>
              <SelectItem value="elektronik-kilit" className="select-item">Elektronik Kilit</SelectItem>
              <SelectItem value="acil-cilingir" className="select-item">Acil Çilingir</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleSearch}
          className="bg-blue-600 h-10 md:h-14 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-2 md:mt-0 w-full md:w-auto"
        >
          Çilingir Bul
        </Button>
      </div>
    </div>
  );
} 