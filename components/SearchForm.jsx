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

  const handleServiceSelect = (value) => {
    setSelectedValues({ 
      ...selectedValues,
      serviceId: value 
    });
    setWarnService(false);
  };

  // Servis seçimini temizle
  const handleClearService = () => {
    setSelectedValues({ 
      ...selectedValues,
      serviceId: null
    });
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

  // Seçili servis adını bul
  const getSelectedServiceName = () => {
    if (!selectedValues.serviceId) return null;
    const service = serviceList.find(s => s.id === selectedValues.serviceId);
    return service ? service.name : null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-center gap-4 mt-8 flex items-center justify-center">
        <div className={`w-full md:w-2/5 relative ${warnLocation ? 'border-red-500 border-2 rounded-lg' : ''}`}>
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
        
        <div className={`w-full md:w-1/4 mt-2 md:mt-0 ${warnService ? 'border-red-500 border-2 rounded-lg' : ''}`}>
          <div className="relative">
            <Select 
              onValueChange={handleServiceSelect} 
              defaultValue={selectedValues.serviceId}
              value={selectedValues.serviceId}
            >
              <SelectTrigger className={`h-10 md:h-14 bg-white text-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500`}>
                <SelectValue placeholder="Hizmet Seçin">
                  {getSelectedServiceName() || "Hizmet Seçin"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="select-content">
                {serviceList.map((service) => (
                  <SelectItem key={service.id} value={service.id} className="select-item">{service.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedValues.serviceId && (
              <button 
                type="button"
                onClick={handleClearService}
                className="absolute z-10 right-10 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 rounded-full flex items-center justify-center focus:outline-none"
                aria-label="Servisi Temizle"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
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