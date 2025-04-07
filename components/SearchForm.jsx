"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import AdresArama from "./AdresArama";
import { useToast } from "./ToastContext";

export default function SearchForm({ onSearch, selectedValues, setSelectedValues }) {
  const [warnLocation, setWarnLocation] = useState(false);
  const [warnService, setWarnService] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const { showToast } = useToast();

  const getServices = async () => {
    const response = await fetch('/api/public/services');
    const data = await response.json();
    setServiceList(data.services);
  };

  useEffect(() => {
    getServices();
  }, []);

  const handlePlaceSelect = (place) => {
    setSelectedValues({
      ...selectedValues, 
      districtId: place.id,
      provinceId: place.province_id
    });
    setWarnLocation(false);
  };

  const handleServiceSelect = (value) => {
    setSelectedValues({...selectedValues, serviceId: value});
    setWarnService(false);
  };

  const handleSearch = () => {
    if (selectedValues.districtId === null) {
      setWarnLocation(true);
      showToast("Lütfen ilçenizi seçiniz", "warning", 3000);
    } else if (selectedValues.serviceId === null) {
      setWarnService(true);
      showToast("Lütfen bir hizmet türü seçiniz", "warning", 3000);
    } else {
      if (onSearch) onSearch();
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
            placeholder="Lütfen ilçenizi seçiniz"
            className={`pl-10 h-10 md:h-14 py-3 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 w-full`}
          />
        </div>
        
        <div className={`w-full md:w-1/4 mt-2 md:mt-0 ${warnService ? 'border-red-500 border-2 rounded-lg' : ''}`}>
          <Select onValueChange={handleServiceSelect}>
            <SelectTrigger className={`h-10 md:h-14 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500`}>
              <SelectValue placeholder="Hizmet Seçin" />
            </SelectTrigger>
            <SelectContent className="select-content">
              {serviceList.map((service) => (
                <SelectItem key={service.id} value={service.id} className="select-item">{service.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleSearch}
          className={`bg-blue-600 h-10 md:h-14 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg mt-2 md:mt-0 w-full md:w-auto ${!(selectedValues.districtId && selectedValues.serviceId) ? 'opacity-90 cursor-pointer' : ''}`}
        >
          Çilingir Bul
        </Button>
      </div>
    </div>
  );
} 