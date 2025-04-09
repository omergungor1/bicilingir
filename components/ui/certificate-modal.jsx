"use client";

import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";

export function CertificateModal({ isOpen, onClose, onSave }) {
  const [file, setFile] = useState(null);
  const [certificateName, setCertificateName] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleSave = () => {
    if (!file) {
      setErrorMessage("Lütfen bir dosya seçin");
      return;
    }

    if (!certificateName.trim()) {
      setErrorMessage("Lütfen sertifika adını girin");
      return;
    }

    onSave({
      file,
      name: certificateName,
      previewUrl
    });

    // Formu temizle
    setFile(null);
    setCertificateName("");
    setPreviewUrl(null);
    setErrorMessage("");
    
    // Modalı kapat
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6">
        <h3 className="text-lg font-medium mb-4">Sertifika Yükle</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Sertifika Adı *</label>
            <Input 
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Örn: Ustalık Belgesi"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Sertifika Dosyası *</label>
            <label htmlFor="certificateFile" className={`border-2 border-dashed ${file ? 'border-blue-400' : 'border-gray-300'} rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 block`}>
              {!file ? (
                <>
                  <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">
                    Dosya seçin veya buraya sürükleyin
                  </p>
                </>
              ) : (
                <>
                  {file.type.startsWith('image/') ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={previewUrl} 
                        alt="Sertifika önizleme" 
                        className="max-h-36 object-contain mb-2 rounded"
                      />
                      <p className="text-sm text-gray-500">{file.name}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg className="w-10 h-10 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-blue-600 font-medium">PDF dosyası</p>
                      <p className="text-sm text-gray-500 mt-1">{file.name}</p>
                    </div>
                  )}
                </>
              )}
            </label>
            <input 
              id="certificateFile"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </div>
          
          {errorMessage && (
            <div className="text-red-500 text-sm">{errorMessage}</div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={handleCancel}>
            İptal
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!isFormValid}
            className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
} 