"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import AdresArama from "./AdresArama";
import { useRouter } from "next/navigation";
import { useToast } from "./ToastContext";

export default function SearchForm({ onSearch }) {
  const router = useRouter();
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedService, setSelectedService] = useState("");
  const [warnLocation, setWarnLocation] = useState(false);
  const [warnService, setWarnService] = useState(false);
  const { showToast } = useToast();

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    console.log("Seçilen adres:", place.formatted_address);
    setWarnLocation(false);
  };

  const handleServiceSelect = (value) => {
    setSelectedService(value);
    console.log("Seçilen hizmet:", value);
    setWarnService(false);
  };

  const handleSearch = () => {
    // Form kontrolü
    if (selectedPlace === null && selectedService === "") {
      showToast("Lütfen hem konum hem de hizmet seçiniz", "error", 3000);
      return;
    } else if (selectedPlace === null) {
      showToast("Lütfen bir konum (il veya ilçe) seçiniz", "error", 3000);
      return;
    } else if (selectedService === "") {
      showToast("Lütfen bir hizmet türü seçiniz", "error", 3000);
      return;
    }
    // Eğer ana sayfada değilsek, ana sayfaya yönlendir
    const isHomePage = window.location.pathname === "/" || window.location.pathname === "";
    
    if (!isHomePage) {
      // URL'ye parametre ekleyerek ana sayfaya yönlendir
      const params = new URLSearchParams();
      if (selectedPlace) {
        params.append("location", selectedPlace.formatted_address);
      }
      if (selectedService) {
        params.append("service", selectedService);
      }
      
      const searchParams = params.toString() ? `?${params.toString()}` : "";
      router.push(`/${searchParams}`);
    } else {
      // Ana sayfadaysak, doğrudan arama fonksiyonunu çağır
      if (onSearch) onSearch();
    }
  };

  const handleButtonClick = () => {
    if (selectedPlace === null && selectedService === "") {
      setWarnLocation(true);
      setWarnService(true);
      showToast("Lütfen ilçenizi seçiniz", "warning", 3000);
    } else if (selectedPlace === null) {
      setWarnLocation(true);
      showToast("Lütfen ilçenizi seçiniz", "warning", 3000);
    } else if (selectedService === "") {
      setWarnService(true);
      showToast("Lütfen bir hizmet türü seçiniz", "warning", 3000);
    } else {
      handleSearch();
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-2 justify-center items-center w-full">
        <div className={`relative w-full md:w-1/3 ${warnLocation ? 'border-red-500 border-2 rounded-lg' : ''}`}>
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>

          <AdresArama 
            onPlaceSelect={handlePlaceSelect}
            placeholder="Adresinizi girin (İl veya İlçe)"
            className={`pl-10 h-10 md:h-14 py-3 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 w-full`}
          />
        </div>
        
        <div className={`w-full md:w-1/4 mt-2 md:mt-0 ${warnService ? 'border-red-500 border-2 rounded-lg' : ''}`}>
          <Select onValueChange={handleServiceSelect}>
            <SelectTrigger className={`h-10 md:h-14 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500`}>
              <SelectValue placeholder="Hizmet Seçin" />
            </SelectTrigger>
            <SelectContent className="select-content">
              <SelectItem value="69fe5a65-88ee-4e23-b3e8-b53370f5721a" className="select-item">Acil Çilingir</SelectItem>
              <SelectItem value="a5570d34-ee52-4f69-8010-0dce311cbc7e" className="select-item">7/24 Çilingir</SelectItem>
              <SelectItem value="915e4a47-b6b6-42c0-a3eb-424262b7b238" className="select-item">Kapı Açma</SelectItem>
              <SelectItem value="a782c9d0-e2d6-48fd-b537-ad3d7482ef0e" className="select-item">Oto Çilingir</SelectItem>
              <SelectItem value="7e18c529-faf1-4139-be87-92e2c3ed98aa" className="select-item">Kasa Çilingir</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleButtonClick}
          className={`bg-blue-600 h-10 md:h-14 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-2 md:mt-0 w-full md:w-auto ${!(selectedPlace && selectedService) ? 'opacity-90 cursor-pointer' : ''}`}
        >
          Çilingir Bul
        </Button>
      </div>
    </div>
  );
} 