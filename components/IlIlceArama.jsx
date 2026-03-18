"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import turkiyeIlIlce from "../data/turkiye-il-ilce";

/**
 * İl ve ilçe arama bileşeni - Seçime göre sayfa yönlendirmesi yapar
 * İl seçilirse: /province_slug
 * İlçe seçilirse: /province_slug/district_slug
 */
export default function IlIlceArama({ placeholder, className, onNavigateStart }) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Kullanıcı girişine göre önerileri filtrele (hem il hem ilçe)
  useEffect(() => {
    if (inputValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filteredSuggestions = [];
    const searchTerm = inputValue.toLocaleLowerCase("tr-TR");

    // İl adına göre eşleşen iller
    const matchingProvinces = turkiyeIlIlce.provinces.filter((il) =>
      il.name.toLocaleLowerCase("tr-TR").includes(searchTerm)
    );

    // İlçe adına göre eşleşen ilçeler
    const matchingDistricts = turkiyeIlIlce.districts.filter((ilce) =>
      ilce.name.toLocaleLowerCase("tr-TR").includes(searchTerm)
    );

    // Önce eşleşen illeri ekle (tekil eşleşme - il adı tam eşleşiyorsa il sayfasına yönlendir)
    matchingProvinces.forEach((province) => {
      filteredSuggestions.push({
        type: "il",
        name: province.name,
        slug: province.slug,
        fullAddress: province.name,
      });
    });

    // Eşleşen ilçeleri ekle (province_slug + district_slug ile)
    matchingDistricts.forEach((district) => {
      const parentProvince = turkiyeIlIlce.provinces.find(
        (p) => p.id === district.province_id
      );
      if (parentProvince) {
        filteredSuggestions.push({
          type: "ilce",
          name: district.name,
          province_id: district.province_id,
          province_slug: parentProvince.slug,
          district_slug: district.slug,
          fullAddress: `${district.name}, ${parentProvince.name}`,
        });
      }
    });

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

  // Öneri seçildiğinde yönlendir
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.fullAddress);
    setShowSuggestions(false);
    onNavigateStart?.();

    if (suggestion.type === "il") {
      router.push(`/${suggestion.slug}`);
    } else {
      router.push(`/${suggestion.province_slug}/${suggestion.district_slug}`);
    }
  };

  // Arama kutusunu temizle
  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
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
        placeholder={placeholder || "İl veya ilçe yazınız..."}
        className={className}
      />

      {/* Temizleme butonu (X) */}
      {inputValue.trim() !== "" && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute z-10 right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 rounded-full flex items-center justify-center focus:outline-none"
          aria-label="Temizle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.type}-${suggestion.name}-${index}`}
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
