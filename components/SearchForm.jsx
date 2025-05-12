"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import AdresArama from "./AdresArama";
import { useToast } from "./ToastContext";

export default function SearchForm({ onSearch, selectedValues, setSelectedValues }) {
  const [warnLocation, setWarnLocation] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { showToast } = useToast();

  const handlePlaceSelect = (place) => {
    if (place === null) {
      // Temizleme butonu tıklandığında
      setSelectedValues({
        ...selectedValues,
        districtId: null,
        provinceId: null
      });
    } else {
      setSelectedValues({
        ...selectedValues,
        districtId: place.id,
        provinceId: place.province_id
      });
    }
    setWarnLocation(false);
  };

  const handleSearch = () => {
    if (selectedValues.districtId === null) {
      setWarnLocation(true);
      showToast("Lütfen ilçenizi seçiniz", "warning", 3000);
    } else {
      setIsSearching(true);
      if (onSearch) {
        onSearch().finally(() => {
          setIsSearching(false);
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 mt-8 flex items-center justify-center">
        <div className={`w-full md:w-2/3 relative ${warnLocation ? 'border-red-500 border-2 rounded-lg' : ''}`}>
          <svg className="absolute z-10 left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>

          <AdresArama
            onPlaceSelect={handlePlaceSelect}
            placeholder="Lütfen ilçenizi seçiniz"
            className={`pl-10 h-10 md:h-14 py-3 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 w-full`}
            defaultValue={selectedValues}
          />
        </div>

        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className={`bg-blue-600 h-10 md:h-14 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-2 md:mt-0 w-full md:w-auto ${!selectedValues.districtId ? 'opacity-90 cursor-pointer' : ''} ${isSearching ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSearching ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Aranıyor...
            </div>
          ) : (
            "Çilingir Bul"
          )}
        </Button>
      </div>
    </div>
  );
} 