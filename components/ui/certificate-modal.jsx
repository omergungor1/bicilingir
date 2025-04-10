"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

// camelCase dönüştürme fonksiyonu
const toCamelCase = (str) => {
  if (!str) return '';
  
  // Türkçe karakterleri ve boşlukları düzelt
  const turkishToEnglish = {
    'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S',
    'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C'
  };
  
  let result = str.trim();
  
  // Türkçe karakterleri değiştir
  Object.keys(turkishToEnglish).forEach(key => {
    result = result.replace(new RegExp(key, 'g'), turkishToEnglish[key]);
  });
  
  // CamelCase'e dönüştür
  return result
    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (_, c) => c.toLowerCase())
    .replace(/[^a-zA-Z0-9]/g, ''); // Alfanümerik olmayanları temizle
};

export function CertificateModal({ isOpen, onClose, onSave }) {
  const [file, setFile] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [certificateKey, setCertificateKey] = useState("");

  // Forma girilen değerlere göre kaydetme düğmesinin aktif olup olmayacağını kontrol et
  const isFormValid = file !== null && certificateName.trim() !== "";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Dosya tipi ve boyut kontrolü
      const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      const acceptedDocTypes = ['application/pdf'];
      const isImage = acceptedImageTypes.includes(selectedFile.type);
      const isPdf = acceptedDocTypes.includes(selectedFile.type);
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if ((!isImage && !isPdf) || selectedFile.size > maxSize) {
        setErrorMessage("Geçersiz dosya. Lütfen en fazla 5MB büyüklüğünde PDF veya görseller yükleyin.");
        return;
      }

      setFile(selectedFile);
      
      // Dosya önizleme URL'sini oluştur (sadece görseller için)
      if (isImage) {
        const fileUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(fileUrl);
      }
      
      setErrorMessage("");
    }
  };

  const handleSubmit = () => {    
    // Form doğrulaması
    if (!certificateName || !file) {
      setErrorMessage("Lütfen sertifika adı girin ve bir dosya seçin");
      return;
    }
    
    // Sertifika verisini oluştur
    const certificateData = {
      name: certificateName,
      key: certificateKey || toCamelCase(certificateName), // camelCase anahtarı kullan
      file: file,
      previewUrl: previewUrl
    };
    
    // Sertifikayı ekle
    onSave(certificateData);
    
    // Modal'ı kapat ve formu temizle
    setFile(null);
    setCertificateName("");
    setCertificateKey("");
    setPreviewUrl(null);
    setErrorMessage("");
    onClose();
  };

  const handleCancel = () => {
    // Önizleme URL'sini serbest bırak
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
    // Formu temizle
    setFile(null);
    setCertificateName("");
    setPreviewUrl(null);
    setErrorMessage("");
    
    // Modalı kapat
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Sertifika Ekle</h3>
            
            {errorMessage && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
            
            <div>
              <div className="mb-4">
                <label htmlFor="certificateName" className="block text-sm font-medium text-gray-700 mb-1">
                  Sertifika Adı
                </label>
                <Input 
                  id="certificateName"
                  type="text"
                  value={certificateName}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Değeri her zaman set et
                    setCertificateName(inputValue);
                    
                    // Ayrıca camelCase versiyonunu da güncelle
                    if (inputValue) {
                      const camelCased = toCamelCase(inputValue);
                      setCertificateKey(camelCased);
                    }
                  }}
                  placeholder="Örn: Ustalık Belgesi"
                  required
                />
                
                {certificateName && (
                  <div className="mt-2 text-sm text-gray-500">
                    Sistem adı: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{toCamelCase(certificateName)}</span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="certificateFile" className="block text-sm font-medium text-gray-700 mb-1">
                  Sertifika Dosyası
                </label>
                <div className="mt-1 flex items-center">
                  <label className="block">
                    <span className="sr-only">Dosya Seç</span>
                    <input
                      id="certificateFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                      "
                      required
                    />
                  </label>
                </div>
                {previewUrl && (
                  <div className="mt-2">
                    <img src={previewUrl} alt="Önizleme" className="h-32 w-auto object-contain" />
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Formu temizle ve modalı kapat
                    setFile(null);
                    setCertificateName("");
                    setCertificateKey("");
                    setPreviewUrl(null);
                    setErrorMessage("");
                    onClose();
                  }}
                >
                  İptal
                </Button>
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  Kaydet
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 