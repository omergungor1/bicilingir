"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export const ImageGallery = ({ images, locksmithName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imgError, setImgError] = useState({});

  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = "hidden"; // Sayfanın scroll'unu engelle
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = ""; // Sayfanın scroll'unu serbest bırak
  };

  const goToNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageError = (index) => {
    setImgError(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Klavye kısayolları için event listener
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") closeGallery();
      else if (e.key === "ArrowRight") goToNext(e);
      else if (e.key === "ArrowLeft") goToPrev(e);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Boş resim verilmişse
  if (!images || images.length === 0) {
    return <div className="text-gray-500">Galeri resimleri bulunamadı</div>;
  }

  // Kullanılabilir resim sayısını kontrol et
  const validImages = images.filter((img, idx) => !imgError[idx]);
  if (validImages.length === 0) {
    return <div className="text-gray-500">Resimleri yüklerken bir sorun oluştu</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="aspect-square relative overflow-hidden rounded-lg cursor-pointer"
            onClick={() => openGallery(index)}
          >
            {!imgError[index] ? (
              <Image
                src={image.image_url}
                alt={`${locksmithName} - Resim ${index + 1}`}
                width={300}
                height={300}
                className="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                onError={() => handleImageError(index)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                Resim Yüklenemedi
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tam Ekran Galeri */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeGallery}
        >
          <button 
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            onClick={closeGallery}
          >
            <X size={24} />
          </button>
          
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            onClick={goToPrev}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] relative">
            {/* Tam ekran modda normal img kullanıyoruz çünkü boyut sınırlamaları ve remote URL'ler için daha esneklik sağlıyor */}
            <img
              src={images[currentIndex].image_url}
              alt={`${locksmithName} - Resim ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
              onError={() => handleImageError(currentIndex)}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-3 py-1 text-white text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
          
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
            onClick={goToNext}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}; 