"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Link from "next/link";
import { SelectableCard } from "../../../components/ui/selectable-card";

export default function CilingirKayit() {
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    email: "",
    isletmeAdi: "",
    il: "",
    ilce: "",
    acikAdres: "",
    postaKodu: "",
    tecrube: "",
    hizmetBolgeleri: [],
    hizmetler: [],
    kimlikBelgesi: null,
    ruhsat: null,
    isletmeBelgesi: null,
    digerBelgeler: []
  });

  const [previewUrls, setPreviewUrls] = useState({
    kimlikBelgesi: null,
    ruhsat: null,
    isletmeBelgesi: null,
    digerBelgeler: []
  });

  // İlleri temsil eden örnek veri
  const iller = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya"];
  
  // Seçilen ile göre ilçeler (örnek veri)
  const ilceler = {
    "İstanbul": ["Kadıköy", "Beşiktaş", "Şişli", "Üsküdar", "Beyoğlu", "Ataşehir", "Maltepe", "Kartal", "Pendik", "Tuzla"],
    "Ankara": ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut"],
    "İzmir": ["Konak", "Karşıyaka", "Bornova", "Karabağlar", "Buca"],
    "Bursa": ["Osmangazi", "Nilüfer", "Yıldırım", "Gemlik", "Mudanya"],
    "Antalya": ["Muratpaşa", "Konyaaltı", "Kepez", "Alanya", "Manavgat"]
  };

  // Çilingir hizmetleri örnek veri
  const hizmetListesi = [
    { id: 1, name: "Kapı Açma" },
    { id: 2, name: "Çelik Kapı Açma" },
    { id: 3, name: "Kilitli Kapı Açma" },
    { id: 4, name: "Kasa Açma" },
    { id: 5, name: "Çilingir Oto Anahtarı" },
    { id: 6, name: "Anahtar Kopyalama" },
    { id: 7, name: "Elektronik Kilit Kurulumu" },
    { id: 8, name: "Kilit Değiştirme" },
    { id: 9, name: "Multlock Kilit Sistemi" },
    { id: 10, name: "Kale Kilit Sistemi" },
    { id: 11, name: "Yale Kilit Sistemi" },
    { id: 12, name: "Çelik Kasa Açma" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleIlceChange = (ilce) => {
    let yeniHizmetBolgeleri = [...formData.hizmetBolgeleri];
    
    if (yeniHizmetBolgeleri.includes(ilce)) {
      yeniHizmetBolgeleri = yeniHizmetBolgeleri.filter(i => i !== ilce);
    } else {
      yeniHizmetBolgeleri.push(ilce);
    }
    
    setFormData({
      ...formData,
      hizmetBolgeleri: yeniHizmetBolgeleri
    });
  };

  const handleHizmetChange = (hizmetId) => {
    let yeniHizmetler = [...formData.hizmetler];
    
    if (yeniHizmetler.includes(hizmetId)) {
      yeniHizmetler = yeniHizmetler.filter(i => i !== hizmetId);
    } else {
      yeniHizmetler.push(hizmetId);
    }
    
    setFormData({
      ...formData,
      hizmetler: yeniHizmetler
    });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        [fieldName]: file
      });
      
      // Dosya önizleme URL'sini oluştur
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrls({
        ...previewUrls,
        [fieldName]: fileUrl
      });
    }
  };

  const handleMultipleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Dosyaları form verisine ekle
      setFormData({
        ...formData,
        digerBelgeler: [...formData.digerBelgeler, ...files]
      });
      
      // Önizleme URL'lerini oluştur
      const newPreviewUrls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls({
        ...previewUrls,
        digerBelgeler: [...previewUrls.digerBelgeler, ...newPreviewUrls]
      });
    }
  };

  const removeDiğerBelge = (index) => {
    // Dosyayı form verisinden kaldır
    const yeniBelgeler = [...formData.digerBelgeler];
    yeniBelgeler.splice(index, 1);
    setFormData({
      ...formData,
      digerBelgeler: yeniBelgeler
    });
    
    // Önizleme URL'sini kaldır
    const yeniPreviewUrls = [...previewUrls.digerBelgeler];
    URL.revokeObjectURL(yeniPreviewUrls[index]); // Önizleme URL'sini serbest bırak
    yeniPreviewUrls.splice(index, 1);
    setPreviewUrls({
      ...previewUrls,
      digerBelgeler: yeniPreviewUrls
    });
  };

  const nextStep = () => {
    setActiveStep(activeStep + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form verilerini işleme ve API'ye gönderme işlemleri burada yapılacak
    console.log("Form verileri:", formData);
    // Başvuru tamamlandı mesajını göster
    setActiveStep(5);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Çilingir Kayıt</h1>
      
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center relative z-10">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center 
                  ${activeStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}
              >
                {step}
              </div>
              <span className={`mt-2 text-sm ${activeStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
                {step === 1 && "Kişisel Bilgiler"}
                {step === 2 && "Hizmet Bölgeleri"}
                {step === 3 && "Hizmetler"}
                {step === 4 && "Evrak Yükleme"}
              </span>
            </div>
          ))}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div 
              className="h-full bg-blue-600 transition-all" 
              style={{ width: `${(activeStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>
            {activeStep === 1 && "Kişisel ve İşletme Bilgileri"}
            {activeStep === 2 && "Hizmet Verdiğiniz Bölgeler"}
            {activeStep === 3 && "Sunduğunuz Hizmetler"}
            {activeStep === 4 && "Evrak Yükleme"}
            {activeStep === 5 && "Başvuru Tamamlandı"}
          </CardTitle>
          <CardDescription>
            {activeStep === 1 && "Lütfen kişisel ve işletme bilgilerinizi girin"}
            {activeStep === 2 && "Hizmet verdiğiniz bölgeleri seçin"}
            {activeStep === 3 && "Sunduğunuz hizmetleri işaretleyin"}
            {activeStep === 4 && "Gerekli belgeleri yükleyin"}
            {activeStep === 5 && "Başvurunuz başarıyla alınmıştır"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Adım 1: Kişisel ve İşletme Bilgileri */}
            {activeStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Ad Soyad *</label>
                    <Input 
                      name="adSoyad"
                      value={formData.adSoyad}
                      onChange={handleChange}
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefon *</label>
                    <Input 
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleChange}
                      placeholder="05XX XXX XX XX"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-posta *</label>
                  <Input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">İşletme Adı *</label>
                  <Input 
                    name="isletmeAdi"
                    value={formData.isletmeAdi}
                    onChange={handleChange}
                    placeholder="İşletmenizin adı"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">İl *</label>
                    <select 
                      name="il"
                      value={formData.il}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">İl seçin</option>
                      {iller.map((il) => (
                        <option key={il} value={il}>{il}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">İlçe *</label>
                    <select 
                      name="ilce"
                      value={formData.ilce}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md"
                      required
                      disabled={!formData.il}
                    >
                      <option value="">İlçe seçin</option>
                      {formData.il && ilceler[formData.il].map((ilce) => (
                        <option key={ilce} value={ilce}>{ilce}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Açık Adres *</label>
                  <textarea 
                    name="acikAdres"
                    value={formData.acikAdres}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md min-h-[100px]"
                    placeholder="İşletmenizin açık adresi"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Posta Kodu</label>
                    <Input 
                      name="postaKodu"
                      value={formData.postaKodu}
                      onChange={handleChange}
                      placeholder="34XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tecrübe Yılı *</label>
                    <Input 
                      name="tecrube"
                      value={formData.tecrube}
                      onChange={handleChange}
                      type="number"
                      placeholder="Örn: 5"
                      min="0"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 2: Hizmet Bölgeleri */}
            {activeStep === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Hizmet verdiğiniz ilçeleri seçin. Birden fazla seçebilirsiniz.
                </p>
                
                {!formData.il ? (
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <p className="text-yellow-700">Lütfen önce bir il seçin.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ilceler[formData.il].map((ilce) => (
                      <SelectableCard
                        key={ilce}
                        selected={formData.hizmetBolgeleri.includes(ilce)}
                        onClick={() => handleIlceChange(ilce)}
                        className="p-4"
                      >
                        <span className="text-sm font-medium">{ilce}</span>
                      </SelectableCard>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 3: Hizmetler */}
            {activeStep === 3 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Sunduğunuz hizmetleri seçin. Birden fazla seçebilirsiniz.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hizmetListesi.map((hizmet) => (
                    <SelectableCard
                      key={hizmet.id}
                      selected={formData.hizmetler.includes(hizmet.id)}
                      onClick={() => handleHizmetChange(hizmet.id)}
                      className="p-4"
                    >
                      <span className="text-sm font-medium">{hizmet.name}</span>
                    </SelectableCard>
                  ))}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="button" onClick={nextStep}>İleri</Button>
                </div>
              </div>
            )}

            {/* Adım 4: Evrak Yükleme */}
            {activeStep === 4 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-500 mb-4">
                  Lütfen aşağıdaki belgeleri yükleyin. Kimlik ve işletme belgeleri zorunludur.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Kimlik Belgesi *</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Nüfus cüzdanı veya ehliyet fotoğrafı yükleyin.
                    </p>
                    <div className="flex items-center space-x-4">
                      <label className="block w-full">
                        <div className={`border-2 border-dashed ${formData.kimlikBelgesi ? 'border-blue-400' : 'border-gray-300'} rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 relative`}>
                          {!formData.kimlikBelgesi ? (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">
                                Dosya seçin veya buraya sürükleyin
                              </p>
                            </>
                          ) : (
                            <>
                              {formData.kimlikBelgesi.type.startsWith('image/') ? (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={previewUrls.kimlikBelgesi} 
                                    alt="Kimlik belgesi önizleme" 
                                    className="max-h-40 object-contain mb-3 rounded"
                                  />
                                  <p className="text-sm text-gray-500">{formData.kimlikBelgesi.name}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-blue-600 font-medium">PDF dosyası</p>
                                  <p className="text-sm text-gray-500 mt-1">{formData.kimlikBelgesi.name}</p>
                                </div>
                              )}
                            </>
                          )}
                          <input 
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "kimlikBelgesi")}
                            required
                          />
                        </div>
                      </label>
                      {formData.kimlikBelgesi && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            URL.revokeObjectURL(previewUrls.kimlikBelgesi);
                            setFormData({...formData, kimlikBelgesi: null});
                            setPreviewUrls({...previewUrls, kimlikBelgesi: null});
                          }}
                          className="shrink-0"
                        >
                          Kaldır
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">İşyeri Ruhsatı</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      İşyeri açma ve çalışma ruhsatı veya ilgili belgeyi yükleyin.
                    </p>
                    <div className="flex items-center space-x-4">
                      <label className="block w-full">
                        <div className={`border-2 border-dashed ${formData.ruhsat ? 'border-blue-400' : 'border-gray-300'} rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 relative`}>
                          {!formData.ruhsat ? (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">
                                Dosya seçin veya buraya sürükleyin
                              </p>
                            </>
                          ) : (
                            <>
                              {formData.ruhsat.type.startsWith('image/') ? (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={previewUrls.ruhsat} 
                                    alt="Ruhsat önizleme" 
                                    className="max-h-40 object-contain mb-3 rounded"
                                  />
                                  <p className="text-sm text-gray-500">{formData.ruhsat.name}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-blue-600 font-medium">PDF dosyası</p>
                                  <p className="text-sm text-gray-500 mt-1">{formData.ruhsat.name}</p>
                                </div>
                              )}
                            </>
                          )}
                          <input 
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "ruhsat")}
                          />
                        </div>
                      </label>
                      {formData.ruhsat && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            URL.revokeObjectURL(previewUrls.ruhsat);
                            setFormData({...formData, ruhsat: null});
                            setPreviewUrls({...previewUrls, ruhsat: null});
                          }}
                          className="shrink-0"
                        >
                          Kaldır
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">İşletme Belgesi *</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Vergi levhası, ticaret sicil belgesi veya esnaf sicil belgesi yükleyin.
                    </p>
                    <div className="flex items-center space-x-4">
                      <label className="block w-full">
                        <div className={`border-2 border-dashed ${formData.isletmeBelgesi ? 'border-blue-400' : 'border-gray-300'} rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 relative`}>
                          {!formData.isletmeBelgesi ? (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-500">
                                Dosya seçin veya buraya sürükleyin
                              </p>
                            </>
                          ) : (
                            <>
                              {formData.isletmeBelgesi.type.startsWith('image/') ? (
                                <div className="flex flex-col items-center">
                                  <img 
                                    src={previewUrls.isletmeBelgesi} 
                                    alt="İşletme belgesi önizleme" 
                                    className="max-h-40 object-contain mb-3 rounded"
                                  />
                                  <p className="text-sm text-gray-500">{formData.isletmeBelgesi.name}</p>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <svg className="w-12 h-12 text-blue-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-blue-600 font-medium">PDF dosyası</p>
                                  <p className="text-sm text-gray-500 mt-1">{formData.isletmeBelgesi.name}</p>
                                </div>
                              )}
                            </>
                          )}
                          <input 
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange(e, "isletmeBelgesi")}
                            required
                          />
                        </div>
                      </label>
                      {formData.isletmeBelgesi && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            URL.revokeObjectURL(previewUrls.isletmeBelgesi);
                            setFormData({...formData, isletmeBelgesi: null});
                            setPreviewUrls({...previewUrls, isletmeBelgesi: null});
                          }}
                          className="shrink-0"
                        >
                          Kaldır
                        </Button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Diğer Belgeler</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Varsa sertifikalar, diplomalar veya diğer destekleyici belgeleri yükleyin.
                    </p>
                    <div className="flex items-center space-x-4">
                      <label className="block w-full">
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            Dosya seçin veya buraya sürükleyin (birden fazla seçebilirsiniz)
                          </p>
                          <input 
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={handleMultipleFileChange}
                            multiple
                          />
                        </div>
                      </label>
                    </div>
                    
                    {formData.digerBelgeler.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Yüklenen Dosyalar</h4>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {formData.digerBelgeler.map((belge, index) => (
                            <li key={index} className="bg-gray-50 p-3 rounded-md border border-gray-200">
                              <div className="flex flex-col h-full">
                                {belge.type?.startsWith('image/') && previewUrls.digerBelgeler[index] && (
                                  <div className="mb-2 flex-1 flex items-center justify-center">
                                    <img 
                                      src={previewUrls.digerBelgeler[index]} 
                                      alt={`Belge ${index + 1} önizleme`} 
                                      className="max-h-28 max-w-full object-contain rounded-md"
                                    />
                                  </div>
                                )}
                                {belge.type === 'application/pdf' && (
                                  <div className="mb-2 flex-1 flex flex-col items-center justify-center text-blue-600">
                                    <svg className="w-10 h-10 mb-1" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm">PDF dosyası</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-auto">
                                  <span className="text-xs truncate max-w-[120px]">{belge.name}</span>
                                  <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeDiğerBelge(index)}
                                    className="h-6 w-6 p-0 rounded-full"
                                  >
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </Button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep}>Geri</Button>
                  <Button type="submit">Başvuruyu Tamamla</Button>
                </div>
              </div>
            )}

            {/* Adım 5: Başvuru Tamamlandı */}
            {activeStep === 5 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-4">Başvurunuz Alındı!</h2>
                <p className="text-gray-600 mb-8">
                  Başvurunuz inceleme için ekibimize iletilmiştir. En kısa sürede size dönüş yapacağız. Başvurunuzun durumunu panel üzerinden takip edebilirsiniz. Bunun için size mail ile gönderdiğimiz şifre ve mail adresiniz ile giriş yapabilirsiniz. Giriş yapmak için <Link className="text-blue-500" href="cilingir/login">buraya</Link> tıklayınız.
                </p>
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 justify-center">
                  <Button variant="outline" type="button" onClick={() => window.location.href = "/"}>Ana Sayfaya Dön</Button>
                  <Button type="button" onClick={() => window.location.href = "/cilingir"}>Panele Git</Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 