"use client";

import React, { useState, useEffect, useRef } from "react";
import turkiyeIlIlce from "../data/turkiye-il-ilce";

export default function AdresArama({ onPlaceSelect, placeholder, className }) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Kullanıcı girişine göre önerileri filtrele
  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = [];
    const searchTerm = inputValue.toLowerCase();

    // İl adına göre ilçeleri filtrele
    const matchingProvinces = turkiyeIlIlce.provinces.filter(il => 
      il.name.toLowerCase().includes(searchTerm)
    );
    
    if (matchingProvinces.length > 0) {
      // Eşleşen illerin ilçelerini listele
      matchingProvinces.forEach(province => {
        const districtsByProvince = turkiyeIlIlce.districts.filter(ilce => 
          ilce.province_id === province.id
        );
        
        districtsByProvince.forEach(ilce => {
          filteredSuggestions.push({
            type: "ilce",
            name: ilce.name,
            parent: ilce.province_id,
            fullAddress: `${ilce.name}, ${province.name}`
          });
        });
      });
    } else {
      // İlçe adına göre filtrele
      turkiyeIlIlce.districts.forEach(ilce => {
        if (ilce.name.toLowerCase().includes(searchTerm)) {
          const parentProvince = turkiyeIlIlce.provinces.find(p => p.id === ilce.province_id);
          if (parentProvince) {
            filteredSuggestions.push({
              type: "ilce",
              name: ilce.name,
              parent: ilce.province_id,
              fullAddress: `${ilce.name}, ${parentProvince.name}`
            });
          }
        }
      });
    }

    // En fazla 10 öneri göster
    setSuggestions(filteredSuggestions.slice(0, 10));
  }, [inputValue]);

  // Dışarı tıklandığında öneri listesini kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Öneri seçildiğinde
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.fullAddress);
    setShowSuggestions(false);
    
    if (onPlaceSelect) {
      onPlaceSelect({
        formatted_address: suggestion.fullAddress,
        name: suggestion.name,
        type: suggestion.type,
        parent: suggestion.parent
      });
    }
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder || "Adresinizi girin"}
        className={className}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-left"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium text-gray-900">
                {suggestion.fullAddress} 
                <span className="ml-2 text-xs text-gray-600 font-normal inline-block">
                  ({suggestion.type === "il" ? "İl" : "İlçe"})
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 