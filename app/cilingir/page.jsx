"use client";

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Info, Phone, Star, Eye, PhoneCall, Instagram, Menu, X,Footprints, File, ExternalLinkIcon, Clock } from "lucide-react";
import { useToast } from "../../components/ToastContext";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../../components/ui/dialog"
import turkiyeIlIlce from "../../data/turkiye-il-ilce.js";
import { getServices,getLocksmithsReviews } from "../actions";

function CilingirPanelContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const locksmithId = searchParams.get('locksmithId')||1;

  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");
  const [isCertificateDialogOpen, setIsCertificateDialogOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [keyBalance, setKeyBalance] = useState(1500); // Örnek roket bakiyesi
  const [maxCustomersPerHour, setMaxCustomersPerHour] = useState(2);
  const [selectedCity, setSelectedCity] = useState("İstanbul");
  const [selectedDistrict, setSelectedDistrict] = useState("Kadıköy");
  const [activeReviewFilter, setActiveReviewFilter] = useState("all");
  const [dailyKeys, setDailyKeys] = useState({
    Pazartesi: {key: 50, isOpen: true},
    Salı: {key: 50, isOpen: true},
    Çarşamba: {key: 50, isOpen: true},
    Perşembe: {key: 50, isOpen: true},
    Cuma: {key: 50, isOpen: true},
    Cumartesi: {key: 100, isOpen: true},
    Pazar: {key: 100, isOpen: true},
  });
  const [keyUsageHistory, setKeyUsageHistory] = useState([
    { id: 1, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00"},
    { id: 2, keyUsage: 30, activite: "Bir arama aldınız", date: "2025-03-23 10:00:00" },
    { id: 3, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    { id: 4, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    { id: 5, keyUsage: 30, activite: "Bir arama aldınız", date: "2025-03-23 10:00:00" },
    { id: 6, keyUsage: 30, activite: "Bir arama aldınız", date: "2025-03-23 10:00:00" },
    { id: 7, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    { id: 8, keyUsage: 5, activite: "Aramada listelendin", date: "2025-03-23 10:00:00" },
    
  ]);

  const [dailyHours, setDailyHours] = useState({
    Pazartesi: { start: "09:00", end: "18:00", is24Hours: false },
    Salı: { start: "09:00", end: "18:00", is24Hours: false },
    Çarşamba: { start: "09:00", end: "18:00", is24Hours: false },
    Perşembe: { start: "09:00", end: "18:00", is24Hours: false },
    Cuma: { start: "09:00", end: "18:00", is24Hours: false },
    Cumartesi: { start: "09:00", end: "18:00", is24Hours: false },
    Pazar: { start: "09:00", end: "18:00", is24Hours: false }
  });

  const [workDaysOpen, setWorkDaysOpen] = useState({
    Pazartesi: true,
    Salı: true,
    Çarşamba: true,
    Perşembe: true,
    Cuma: true,
    Cumartesi: true,
    Pazar: true
  });

  const [serviceList, setServiceList] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getServices();
      setServiceList(response.services);
    };
    fetchServices();

    const fetchReviews = async () => {
      const response = await getLocksmithsReviews(locksmithId);
      setReviews(response.reviews);
      console.log(response,'Locksmith ID:',locksmithId);
    };
    fetchReviews();
  }, []);

  const [activeServices, setActiveServices] = useState([1,2,4]);

  const [businessImages, setBusinessImages] = useState([
    "/images/dukkan1.jpg",
    "/images/dukkan2.jpg",
    "/images/dukkan3.jpg",
    "/images/dukkan4.jpg",
  ]);

  const [mainImageIndex, setMainImageIndex] = useState(0);

  const keyPackages = [
    { id: 1, amount: 1000, price: 5000, description: "Başlangıç Paketi" },
    { id: 2, amount: 3000, price: 12000, description: "Orta Paket" },
    { id: 3, amount: 7000, price: 25000, description: "Pro Paket" },
    { id: 4, amount: 15000, price: 50000, description: "VIP Paket" }
  ];

  const [socialMedia, setSocialMedia] = useState({
    instagram: "www.instagram.com/anahtarcilingir",
    facebook: "www.facebook.com/anahtarcilingir",
    youtube: "www.youtube.com/anahtarcilingir",
    tiktok: "www.tiktok.com/anahtarcilingir",
  });

  const [certificates, setCertificates] = useState([
    { name: "TSE Belgesi", url: "https://www.tse.gov.tr/images/belge/tse-belgesi.pdf" },
    { name: "Mesleki Yeterlilik Belgesi", url: "https://www.tse.gov.tr/images/belge/mesleki-yeterlilik-belgesi.pdf" },
    { name: "Ustalık Belgesi", url: "https://www.tse.gov.tr/images/belge/ustalik-belgesi.pdf" },
  ]);


  const [newCertificate, setNewCertificate] = useState({ name: '', file: null, fileSize: 0, fileType: '' });

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // URL'yi güncelle
    const params = new URLSearchParams(searchParams);
    params.set('tab', tab);
    router.push(`?${params.toString()}`);
  };

  const handleDailyKeyChange = (day, value) => {
    setDailyKeys(prev => ({
      ...prev,
      [day]: { ...prev[day], key: parseInt(value) || 0 }
    }));
  };

  const handleServiceActiveChange = (id, checked) => {
    if (checked) {
      setActiveServices(prevServices => [...prevServices, id]);
    } else {
      setActiveServices(prevServices => prevServices.filter(s => s !== id));
    }
  };

  const handleSocialMediaChange = (platform, value) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleSocialMediaUpdate = () => {
    // API çağrısı simülasyonu
    showToast(`Sosyal medya hesaplarınız başarıyla güncellendi!`, "success");
  };

  // İşletme resimleri için fonksiyonlar
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (businessImages.length + files.length > 10) {
      showToast("En fazla 10 resim yükleyebilirsiniz.", "error");
      return;
    }
    
    const validFiles = files.filter(file => {
      // 5MB kontrolü
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${file.name} dosyası 5MB'dan büyük!`, "error");
        return false;
      }

      // Resim kontrolü
      if (!file.type.startsWith('image/')) {
        showToast(`${file.name} bir resim dosyası değil!`, "error");
        return false;
      }
      
      return true;
    });
    
    setBusinessImages(prev => [...prev, ...validFiles]);
    showToast(`${validFiles.length} resim başarıyla yüklendi.`, "success");
  };

  const handleRemoveImage = (index) => {
    setBusinessImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      
      // Ana görsel kaldırıldıysa, ana görseli ilk resme ayarla
      if (index === mainImageIndex) {
        setMainImageIndex(newImages.length > 0 ? 0 : -1);
      } else if (index < mainImageIndex) {
        // Eğer kaldırılan görsel ana görselden önceyse, ana görsel indexini güncelle
        setMainImageIndex(mainImageIndex - 1);
      }
      
      return newImages;
    });
    showToast("Resim başarıyla kaldırıldı.", "success");
  };

  const setMainImage = (index) => {
    setMainImageIndex(index);
    showToast("Ana görsel güncellendi.", "success");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleImageUpload({ target: { files } });
  };

  const handlePackagePurchase = (id) => {
    showToast("Anahtar paketi satın almak için lütfen iletişime geçiniz.", "info");
  };


  const handleAddCertificate = () => {
    if (!newCertificate.name || !newCertificate.file) return;
    
    if (certificates.length < 5) {
      setCertificates([...certificates, newCertificate]);
      // Formu temizle
      setNewCertificate({ name: '', file: null, fileSize: 0, fileType: '' });
      showToast('Sertifika başarıyla eklendi.', "success");
    } else {
      showToast('En fazla 5 sertifika ekleyebilirsiniz.', "error");
    }
    setIsCertificateDialogOpen(false);
  };

  const handleRemoveCertificate = (index) => {
    const updatedCertificates = [...certificates];
    updatedCertificates.splice(index, 1);
    setCertificates(updatedCertificates);
    showToast("Sertifika başarıyla kaldırıldı.", "success");
  };

  // Sertifika görüntüleme
  const handleViewCertificate = (cert) => {
    if (cert.file) {
      if (cert.file instanceof File) {  
        // Dosya henüz yüklendi ve bir File objesi
        showToast(`${cert.name} sertifikası başarıyla yüklendi, kaydedildikten sonra görüntülenebilecek.`, "success");
      } else {
        // Dosya zaten sunucuda ve bir URL
        window.open(cert.file, '_blank');
      }
    }
  };

  return (
    <div className="container mx-auto pb-10 px-2">
      <div className="md:hidden sticky top-2 flex justify-between items-center mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Bi Çilingir" width={40} height={40} />
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Bi Çilingir</h1>
            <p className="text-sm">Yönetim Paneli</p>
          </div>
        </div>
        <button 
          className="md:hidden p-2 rounded-md bg-blue-50 text-blue-600"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(!mobileMenuOpen)}
          }
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      
      <div className="hidden md:flex items-center gap-2">
        <Image src="/logo.png" alt="Bi Çilingir" width={40} height={40} />
        <h1 className="text-xl md:text-2xl font-bold my-6">Bi Çilingir Yönetim Paneli</h1>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Desktop */}
        <div className={`md:col-span-3 col-span-12 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <Card className="sticky top-4">
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Beyoğlu Çilingir</h3>
                    <p className="text-sm text-gray-500">Çilingir Paneli</p>
                  </div>
                </div>
              </div>
              <nav className="flex flex-col p-2">
                <button 
                  onClick={() => handleTabChange("dashboard")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Panel</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("profile")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profil Bilgileri</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("services")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "services" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Hizmetlerim</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("jobs")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "jobs" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Aktivite Geçmişi</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("reviews")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "reviews" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Değerlendirmeler</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("advertising")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "advertising" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>Reklam Yönetimi</span>
                </button>
                
                <button 
                  onClick={() => handleTabChange("settings")}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Hesap Ayarları</span>
                </button>

                <div className="border-t my-2"></div>

                <Link href="/auth/login">
                  <button 
                    onClick={() => {/* Güvenli çıkış işlemi */}}
                    className="flex items-center space-x-3 p-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Güvenli Çıkış</span>
                  </button>
                </Link>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          {activeTab === "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>Panel</CardTitle>
                <CardDescription>Hesap genel bakış</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Toplam Görüntülenme</p>
                          <h3 className="text-3xl font-bold text-gray-800">345</h3>
                          <p className="text-sm text-green-600 mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            %12.5 artış
                          </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-blue-500 rounded" style={{ width: '70%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Toplam Arama</p>
                          <h3 className="text-3xl font-bold text-gray-800">213</h3>
                          <p className="text-sm text-green-600 mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                            %8.3 artış
                          </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-purple-500 rounded" style={{ width: '60%' }}></div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ortalama Puan</p>
                          <h3 className="text-3xl font-bold text-gray-800">4.8/5</h3>
                          <div className="flex items-center mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg key={star} className={`w-4 h-4 ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="bg-yellow-100 p-3 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-4 h-1 w-full bg-gray-100 rounded">
                        <div className="h-1 bg-yellow-500 rounded" style={{ width: '95%' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-medium mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Son İşlemler
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Bir Müşteri Profilinizi Ziyaret Etti",
                        location: "Kadıköy - Profil Görüntüleme",
                        date: "16 Mart 2024, 16:45",
                        icon: "Footprints",
                        color: "orange"
                      },
                      {
                        title: "Bir Aramada Görüntülendiniz",
                        location: "Gemlik - Oto Çilingir",
                        date: "15 Mart 2024, 15:30",
                        icon: "eye",
                        color: "blue"
                      },
                      {
                        title: "Yeni Değerlendirme Aldınız",
                        location: "İstanbul - Kapı Açma",
                        date: "14 Mart 2024, 13:45",
                        icon: "star",
                        color: "yellow"
                      },
                      {
                        title: "Bir Arama Aldınız",
                        location: "Beşiktaş - Kilit Değiştirme",
                        date: "12 Mart 2024, 10:15",
                        icon: "phone",
                        color: "green"
                      }
                    ].map((item, index) => (
                      <Card key={index} className="hover:shadow-md transition-all border-l-4" 
                            style={{ borderLeftColor: 
                              item.color === "blue" ? "#3b82f6" : 
                              item.color === "yellow" ? "#f59e0b" : 
                              item.color === "green" ? "#22c55e" :
                              item.color === "orange" ? "#f97316":
                              item.color === "indigo" ? "#6366f1" : "#3b82f6"
                            }}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className={`p-3 rounded-full mr-4 ${
                              item.color === "blue" ? "bg-blue-100 text-blue-600" : 
                              item.color === "yellow" ? "bg-yellow-100 text-yellow-600" : 
                              item.color === "green" ? "bg-green-100 text-green-600" :
                              item.color === "orange" ? "bg-orange-100 text-orange-600" :
                              item.color === "indigo" ? "bg-indigo-100 text-indigo-600" :
                              "bg-blue-100 text-blue-600"
                            }`}>
                              {item.icon === "eye" ? (
                                <Eye className="h-6 w-6" />
                              ) : item.icon === "star" ? (
                                <Star className="h-6 w-6" />
                              ) : item.icon === "phone" ? (
                                <PhoneCall className="h-6 w-6" />
                              ) : item.icon === "Footprints" ? (
                                <Footprints className="h-6 w-6" />
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex md:justify-between items-start md:items-center md:flex-row flex-col justify-between">
                                <h5 className="font-medium text-gray-900">{item.title}</h5>
                                <span className="text-sm text-gray-500 flex items-center md:mt-0 mt-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {item.date}
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center text-sm text-gray-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {item.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button 
                    onClick={() => {
                      setActiveTab("jobs")
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                      Tüm İşlemleri Görüntüle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>İşletme bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <Button>Fotoğraf Yükle</Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm mb-1">İşletme Adı</label>
                      <Input defaultValue="Anahtar Çilingir" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Ad Soyad</label>
                      <Input defaultValue="Ahmet Yılmaz" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">E-posta</label>
                      <Input defaultValue="info@anahtarcilingir.com" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Telefon</label>
                      <Input defaultValue="+90 555 123 4567" />
                    </div>
                    {/* İl - ilçe seçimi */}  
                    <div className="md:col-span-1">
                      <label className="block text-sm mb-1">İl</label>
                      <select 
                        className="w-full p-2 border rounded-md" 
                        onChange={(e) => setSelectedCity(e.target.value)}
                        value={selectedCity}
                      >
                        {Object.keys(turkiyeIlIlce).map((il) => (
                          <option key={il} value={il}>{il}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm mb-1">İlçe</label>
                      <select 
                        className="w-full p-2 border rounded-md" 
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        value={selectedDistrict}
                      >
                        {turkiyeIlIlce[selectedCity].map((ilce) => (
                          <option key={ilce} value={ilce}>{ilce}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Hakkında</label>
                      <textarea 
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        defaultValue="10 yıllık tecrübemizle İstanbul'un her bölgesinde hizmet vermekteyiz. 7/24 acil çilingir hizmeti sunuyoruz."
                      ></textarea>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />

                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Sertifikalar</h4>
                    <div className="space-y-4">
                      {/* Sertifika Yükleme Alanı */}

                      <Dialog
                        open={isCertificateDialogOpen}
                        onOpenChange={setIsCertificateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button>Sertifika Yükle</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sertifika Yükle</DialogTitle>
                            <DialogDescription>Yeni bir sertifika yüklemek için lütfen dosyayı seçin ve sertifika adını girin.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <Input type="file" onChange={(e) => {
                              setNewCertificate({ ...newCertificate, file: e.target.files[0] });
                            }} />
                            <Input type="text" placeholder="Sertifika Adı" onChange={(e) => setNewCertificate({ ...newCertificate, name: e.target.value })} />
                          </div>
                          <DialogFooter>
                            <Button onClick={handleAddCertificate}>Yükle</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>


                      {certificates.length > 0 ? (
                        <div className="mt-4">
                          <h5 className="font-medium mb-3">Mevcut Sertifikalar ({certificates.length}/5)</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {certificates.map((cert, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square overflow-hidden rounded-lg hover:border hover:transition-all hover:duration-100 hover:border-blue-500">
                                  {/* name and Url */}
                                  <div 
                                  onClick={() => handleViewCertificate(cert)}
                                  className="w-full h-full flex items-center justify-center bg-gray-100 border-2 cursor-pointer"
                                  >
                                    <div className="text-center">
                                        <ExternalLinkIcon className="h-10 w-10 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                                <h3 className="text-sm text-center font-medium">{cert.name}</h3>
                                <button
                                  onClick={() => handleRemoveCertificate(index)}
                                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ):(
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-2">
                          <Info className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">Henüz sertifika yüklemediniz.</p>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">İşletme Fotoğrafları</h4>
                    <div className="space-y-4">
                      {/* Fotoğraf Yükleme Alanı */}
                      <div 
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
                        }}
                      >
                        <label htmlFor="businessImages" className="cursor-pointer flex flex-col items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-gray-500 mb-1">Fotoğrafları buraya sürükleyin veya</p>
                          <Button variant="outline" size="sm" className="mt-2">Dosya Seç</Button>
                          <p className="text-sm text-gray-500 mt-2">En fazla 10 resim, her biri 5MB'dan küçük (JPEG, PNG)</p>
                          <input 
                            id="businessImages" 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      
                      {/* Mevcut Fotoğraflar */}
                      {businessImages.length > 0 ? (
                        <div className="mt-4">
                          <h5 className="font-medium mb-3">Mevcut Fotoğraflar ({businessImages.length}/10)</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {businessImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
                                  <img
                                    src={typeof image === 'string' && image ? image : image instanceof File ? URL.createObjectURL(image) : null}
                                    alt={`İşletme fotoğrafı ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setMainImage(index)}
                                    className={`bg-white text-xs rounded-full px-2 py-1 text-gray-700 font-medium border ${mainImageIndex === index ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300'}`}
                                  >
                                    {mainImageIndex === index ? 'Ana Görsel' : 'Ana Görsel Yap'}
                                  </button>
                                </div>
                                <button
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ):
                      <div className="mt-4">
                        <div className="flex items-center justify-center gap-2">
                          <Info className="h-5 w-5 text-gray-400" />
                          <p className="text-sm text-gray-500">Henüz fotoğraf yüklemediniz.</p>
                        </div>
                      </div>
                      }
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />

                  <div>
                    <h4 className="font-medium mb-4 mt-6">Bir saat içinde maksimum kaç müşteriye hizmet verebilirsiniz?</h4>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-500">Maksimum müşteri sayısı</p>
                      <Input 
                      className="w-24"
                      type="number" 
                      defaultValue={maxCustomersPerHour} 
                      onChange={(e) => setMaxCustomersPerHour(e.target.value)} 
                      placeholder="Örn: 10" />
                      <p className="text-sm text-gray-500">/saat</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />
                  
                  <div>
                    <h4 className="font-medium mb-4 mt-6">Çalışma Saatleri</h4>
                    <div className="space-y-4">
                      {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"].map((day) => (
                        <div key={day} className="flex md:items-center items-start md:flex-row flex-col justify-between border p-3 rounded-md bg-gray-50">
                          <div className="flex items-center space-x-3">
                            <Checkbox 
                              id={`workday-${day}`} 
                              checked={workDaysOpen[day]}
                              onCheckedChange={(checked) => {
                                setWorkDaysOpen(prev => ({
                                  ...prev,
                                  [day]: !!checked
                                }));
                              }}
                            />
                            <label 
                              htmlFor={`workday-${day}`} 
                              className={`font-medium ${!workDaysOpen[day] ? "text-gray-400" : ""}`}
                            >
                              {day}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 md:mt-0 mt-2">
                            <div className="flex items-center space-x-2 mr-4">
                              <Checkbox 
                                id={`24hours-${day}`}
                                checked={workDaysOpen[day] && dailyHours?.[day]?.is24Hours}
                                onCheckedChange={(checked) => {
                                  setDailyHours(prev => ({
                                    ...prev,
                                    [day]: {
                                      ...prev?.[day],
                                      is24Hours: checked,
                                      start: checked ? "00:00" : "09:00",
                                      end: checked ? "00:00" : "18:00"
                                    }
                                  }));
                                }}
                                disabled={!workDaysOpen[day]}
                              />
                              <label 
                                htmlFor={`24hours-${day}`}
                                className={`text-sm ${!workDaysOpen[day] ? "text-gray-400" : ""}`}
                              >
                                24 Saat
                              </label>
                            </div>
                            <Input 
                              type="time"
                              value={dailyHours?.[day]?.start || "09:00"}
                              onChange={(e) => {
                                setDailyHours(prev => ({
                                  ...prev,
                                  [day]: {
                                    ...prev?.[day],
                                    start: e.target.value
                                  }
                                }));
                              }}
                              disabled={!workDaysOpen[day] || dailyHours?.[day]?.is24Hours}
                              className={`w-24 ${(!workDaysOpen[day] || dailyHours?.[day]?.is24Hours) ? "bg-gray-100 text-gray-400" : ""}`}
                            />
                            <span className={!workDaysOpen[day] ? "text-gray-400" : ""}>-</span>
                            <Input 
                              type="time"
                              value={dailyHours?.[day]?.end || "18:00"}
                              onChange={(e) => {
                                setDailyHours(prev => ({
                                  ...prev,
                                  [day]: {
                                    ...prev?.[day],
                                    end: e.target.value
                                  }
                                }));
                              }}
                              disabled={!workDaysOpen[day] || dailyHours?.[day]?.is24Hours}
                              className={`w-24 ${(!workDaysOpen[day] || dailyHours?.[day]?.is24Hours) ? "bg-gray-100 text-gray-400" : ""}`}
                            />
                            <span className={`ml-2 text-sm ${workDaysOpen[day] ? "text-green-600" : "text-red-500"}`}>
                              {workDaysOpen[day] ? "Açık" : "Kapalı"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-6" />

                  <h4 className="font-medium mb-4 mt-6">Sosyal Medya Hesapları</h4>
                  <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Instagram */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <Instagram className="h-6 w-6 text-pink-600 mr-2" />
                        <h3 className="text-lg font-medium">Instagram</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="Instagram kullanıcı adınız" 
                          value={socialMedia.instagram}
                          onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>

                    {/* Facebook */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        <h3 className="text-lg font-medium">Facebook</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="Facebook sayfa linkiniz" 
                          value={socialMedia.facebook}
                          onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>

                    {/* YouTube */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                        </svg>
                        <h3 className="text-lg font-medium">YouTube</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="YouTube kanal linkiniz" 
                          value={socialMedia.youtube}
                          onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>

                    {/* TikTok */}
                    <div className="pb-6">
                      <div className="flex items-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                        </svg>
                        <h3 className="text-lg font-medium">TikTok</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Input 
                          placeholder="TikTok kullanıcı adınız" 
                          value={socialMedia.tiktok}
                          onChange={(e) => handleSocialMediaChange('tiktok', e.target.value)}
                          className="flex-grow"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        showToast("Profil bilgileri kaydedildi", "success");
                      }}
                    >Değişiklikleri Kaydet</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "services" && (
            <Card>
              <CardHeader>
                <CardTitle>Hizmetlerim</CardTitle>
                <CardDescription>Sunduğunuz hizmetleri yönetin ve fiyatlandırın</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {serviceList.map((service, index) => (
                    <Card key={index} className={`${!activeServices.includes(service.id) ? 'bg-gray-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="flex items-center mb-2 md:mb-0">
                            <Checkbox 
                              id={`service-${service.id}`} 
                              checked={activeServices.includes(service.id)}
                              onCheckedChange={(checked) => handleServiceActiveChange(service.id, checked)}
                              className="mr-3"
                            />
                            <label 
                              htmlFor={`service-${service.id}`} 
                              className={`font-medium ${!activeServices.includes(service.id) ? 'text-gray-500' : ''}`}
                            >
                              {service.name}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 pl-6 md:pl-0">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm ${!activeServices.includes(service.id) ? 'text-gray-400' : 'text-gray-600'}`}>₺</span>
                              <Input 
                                type="number" 
                                value={service.price.min} 
                                disabled={true}
                                className={`w-24 ${!activeServices.includes(service.id) ? 'bg-gray-100 text-gray-400' : ''}`}
                                placeholder="Min"
                              />
                              <span className={`text-sm ${!activeServices.includes(service.id) ? 'text-gray-400' : 'text-gray-600'}`}>-</span>
                              <Input 
                                type="number" 
                                value={service.price.max} 
                                disabled={true}
                                className={`w-24 ${!activeServices.includes(service.id) ? 'bg-gray-100 text-gray-400' : ''}`}
                                placeholder="Max"
                              />
                              <Info 
                              onClick={()=>showToast('Varsayılan hizmet fiyat listesidir. Müşteriler bu fiyatı görecektir.', "info")}
                              className="h-6 w-6 text-gray-400"/>
                            </div>
                          </div>
                        </div>
                        {!activeServices.includes(service.id) && (
                          <div className="pl-9 mt-2">
                            <span className="text-xs text-gray-400 italic">Bu hizmeti vermiyorsunuz</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-start">
                  <Button 
                  onClick={()=>console.log(activeServices)}
                  className="bg-blue-600 hover:bg-blue-700 text-white">
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "jobs" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Platform Aktivitelerim
                </CardTitle>
                <CardDescription>Görüntülenmeler, çağrılar ve değerlendirmelerinizi görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex space-x-2 w-full overflow-x-auto scrollbar-hide ">
                    <Button variant="outline" className={`${activeFilter === 'all' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('all')}>Tümü</Button>
                    <Button variant="outline" className={`${activeFilter === 'views' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('views')}>Görüntülenmeler</Button>
                    <Button variant="outline" className={`${activeFilter === 'calls' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('calls')}>Çağrılar</Button>
                    <Button variant="outline" className={`${activeFilter === 'reviews' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`} onClick={() => setActiveFilter('reviews')}>Değerlendirmeler</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    {
                      type: 'view',
                      title: 'Bir Aramada Görüntülendiniz',
                      description: 'Oto Çilingir hizmeti aramasında profiliniz görüntülendi',
                      location: 'Gemlik',
                      service: 'Oto Çilingir',
                      date: '15 Mart 2024, 15:30',
                      icon: <Eye className="h-6 w-6" />,
                      color: 'blue'
                    },
                    {
                      type: 'visit',
                      title: 'Profiliniz Ziyaret Edildi',
                      description: 'Oto Çilingir hizmeti aramasında profiliniz ziyaret edildi',
                      location: 'Osmangazi',
                      service: 'Oto Çilingir',
                      date: '15 Mart 2024, 15:30',
                      icon: <Footprints className="h-6 w-6" />,
                      color: 'orange'
                    },
                    {
                      type: 'call',
                      title: 'Bir Arama Aldınız',
                      description: 'Müşteri, Kilit Değiştirme hizmeti için sizi aradı',
                      location: 'Beşiktaş',
                      service: 'Kilit Değiştirme',
                      date: '15 Mart 2024, 14:20',
                      icon: <PhoneCall className="h-6 w-6" />,
                      color: 'green'
                    },
                    {
                      type: 'review',
                      title: 'Bir Değerlendirme Aldınız',
                      description: '5 üzerinden 5 yıldız aldınız: "Zamanında geldi, çok profesyonel"',
                      location: 'Kadıköy',
                      service: 'Kapı Açma',
                      date: '14 Mart 2024, 11:45',
                      icon: <Star className="h-6 w-6" />,
                      color: 'yellow'
                    },
                    {
                      type: 'view',
                      title: 'Bir Aramada Görüntülendiniz',
                      description: 'Kapı Açma hizmeti aramasında profiliniz görüntülendi',
                      location: 'Üsküdar',
                      service: 'Kapı Açma',
                      date: '13 Mart 2024, 18:10',
                      icon: <Eye className="h-6 w-6" />,
                      color: 'blue'
                    },
                    {
                      type: 'call',
                      title: 'Bir Arama Aldınız',
                      description: 'Müşteri, Anahtar Kopyalama hizmeti için sizi aradı',
                      location: 'Şişli',
                      service: 'Anahtar Kopyalama',
                      date: '13 Mart 2024, 15:35',
                      icon: <PhoneCall className="h-6 w-6" />,
                      color: 'green'
                    },
                    {
                      type: 'review',
                      title: 'Bir Değerlendirme Aldınız',
                      description: '5 üzerinden 4 yıldız aldınız: "İyi hizmet, teşekkürler"',
                      location: 'Beylikdüzü',
                      service: 'Çelik Kapı Açma',
                      date: '12 Mart 2024, 20:15',
                      icon: <Star className="h-6 w-6" />,
                      color: 'yellow'
                    },
                    {
                      type: 'view',
                      title: 'Bir Aramada Görüntülendiniz',
                      description: 'Kasa Açma hizmeti aramasında profiliniz görüntülendi',
                      location: 'Bakırköy',
                      service: 'Kasa Açma',
                      date: '11 Mart 2024, 14:40',
                      icon: <Eye className="h-6 w-6" />,
                      color: 'blue'
                    },
                    {
                      type: 'call',
                      title: 'Bir Arama Aldınız',
                      description: 'Müşteri, Kapı Açma hizmeti için sizi aradı',
                      location: 'Mecidiyeköy',
                      service: 'Kapı Açma',
                      date: '10 Mart 2024, 09:25',
                      icon: <PhoneCall className="h-6 w-6" />,
                      color: 'green'
                    }
                  ].map((activity, index) => (
                    <Card key={index} className="hover:shadow-md transition-all border-l-4" 
                          style={{ borderLeftColor: activity.color === "blue" ? "#3b82f6" : activity.color === "yellow" ? "#f59e0b" : activity.color === "orange" ? "#f97316" : "#22c55e" }}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${
                            activity.color === "blue" ? "bg-blue-100 text-blue-600" : 
                            activity.color === "yellow" ? "bg-yellow-100 text-yellow-600" : 
                            activity.color === "orange" ? "bg-orange-100 text-orange-600" : 
                            "bg-green-100 text-green-600"
                          }`}>
                            {activity.icon}
                          </div>
                          <div className="flex-grow">
                            <div className="flex md:flex-row flex-col justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">{activity.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                              </div>
                              <span className="text-sm text-gray-500 flex items-center md:mt-0 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {activity.date}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {activity.location} - {activity.service}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">10 aktivite gösteriliyor</p>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm">Sayfa 1 / 15</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Önceki</Button>
                      <Button variant="outline" size="sm">Sonraki</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "reviews" && (
            <Card>
              <CardHeader>
                <CardTitle>Değerlendirmeler</CardTitle>
                <CardDescription>Müşteri değerlendirmelerinizi görüntüleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold">4.8</div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < 5 ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">124 değerlendirme</div>
                    </div>
                    
                    <div className="flex-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2 mb-1">
                          <div className="text-sm w-2">{5-i}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${i === 0 ? 70 : i === 1 ? 20 : i === 2 ? 5 : i === 3 ? 3 : 2}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {i === 0 ? 70 : i === 1 ? 20 : i === 2 ? 5 : i === 3 ? 3 : 2}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Yıldız Filtreleme Butonları */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button 
                      className={`flex items-center space-x-1 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${activeReviewFilter === "all" ? "bg-blue-50 border-blue-200" : ""}`}
                      onClick={() => setActiveReviewFilter("all")}
                    >
                      Tümü
                    </button>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button 
                        key={star}
                        className={`flex items-center space-x-1 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${activeReviewFilter === star.toString() ? "bg-blue-50 border-blue-200" : ""}`}
                        onClick={() => setActiveReviewFilter(star.toString())}
                      >
                        <span className="font-medium">{star}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">{review.userName}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">{review.createdAt.split(' ')[0]}</div>
                      </div>
                      <p className="text-gray-700">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-6">
                  <p className="text-sm text-gray-500">10 yorum gösteriliyor</p>
                  <div className="flex items-center">
                    <span className="mr-4 text-sm">Sayfa 1 / 1</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Önceki</Button>
                      <Button variant="outline" size="sm">Sonraki</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "advertising" && (
            <Card>
              <CardHeader>
                <CardTitle>Reklam Yönetimi</CardTitle>
                <CardDescription>Anahtar paketleri ve reklam ayarlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mevcut Anahtar Bakiyesi */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Anahtar Bakiyeniz</h3>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <span className="text-3xl font-bold text-blue-600"> {keyBalance} Anahtar</span>
                    </div>
                    <div className="flex items-center ml-2 mt-2 text-gray-600">
                      <Info className="w-4 h-4 mr-2"/>
                      <p className="text-sm">Tahmini anahtar bitiş tarihi: 10.04.2025</p> 
                    </div>
                  </div>
                </div>

                {/* Anahtar Paketleri */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Anahtar Paketleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {keyPackages.map((pkg) => (
                      <div key={pkg.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                          <h4 className="font-bold text-lg">{pkg.amount} Anahtar</h4>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">{pkg.price} ₺</span>
                          <Button 
                          onClick={() => handlePackagePurchase(pkg.id)}
                          variant="outline" size="sm">Satın Al</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Günlük Anahtar Kullanım Tercihleri */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Günlük Anahtar Kullanım Tercihleriniz</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center"><Info className="w-4 h-4 mr-2"/> Tahmini Aylık Anahtar Kullanımı: {Object.values(dailyKeys).reduce((sum, day) => sum + (4*day.key || 0), 0)} Anahtar</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(dailyKeys).map(([day, _]) => (
                      <div key={day} className="border rounded-lg p-4 bg-gray-10">
                        <label className="block text-md font-bold text-gray-700 mb-2">{day}</label>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id={`adday-${day}`} 
                            checked={dailyKeys[day].isOpen}
                            onCheckedChange={(checked) => {
                              setDailyKeys(prev => ({
                                ...prev,
                                [day]: { ...prev[day], isOpen: !!checked }
                              }));
                            }}
                          />
                          <label 
                            htmlFor={`adday-${day}`} 
                            className={`font-medium ${!dailyKeys[day].isOpen ? "text-gray-400" : ""}`}
                          >
                            Reklam Açık
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 md:mt-2 mt-2">
                          <label className={`font-medium ${!dailyKeys[day].isOpen ? "text-gray-400" : ""}`}>
                            Günlük Anahtar:
                          </label>
                          <Input 
                            type="number"
                            min="1"
                            max="100"
                            value={dailyKeys[day].key || 10}
                            onChange={(e) => handleDailyKeyChange(day, parseInt(e.target.value))}
                            disabled={!dailyKeys[day].isOpen}
                            className={`w-20 ${!dailyKeys[day].isOpen ? "bg-gray-100 text-gray-400" : ""}`}
                          />
                          <span className={`ml-2 text-sm ${dailyKeys[day].isOpen ? "text-green-600" : "text-red-500"}`}>
                            {dailyKeys[day].isOpen ? "Reklam Açık" : "Reklam Kapalı"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                {/* Anahtar Kullanım Geçmişi */}
                <div className="my-8">
                  <div className="flex items-center mb-4">
                    <Clock className="h-6 w-6 text-blue-600 mr-2" />
                    <h3 className="text-xl font-bold text-gray-800">Anahtar Kullanım Geçmişi</h3>
                  </div>
                  <div className="bg-white shadow-sm rounded-lg border border-gray-100">
                    {keyUsageHistory.length === 0 ? (
                      <div className="p-6 text-center text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <p>Henüz anahtar kullanım geçmişiniz bulunmamaktadır.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {keyUsageHistory.map((activity) => (
                          <li key={activity.id} className="flex items-center p-4 hover:bg-blue-50 transition-colors">
                            <div className="flex-shrink-0 mr-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{activity.activite}</p>
                              <p className="text-sm text-gray-500">{activity.date}</p>
                            </div>
                            <div className="inline-flex items-center text-base font-semibold text-blue-600">
                              {activity.keyUsage} Anahtar
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {keyUsageHistory.length > 0 && (
                      <div className="px-4 py-3 bg-gray-50 text-right rounded-b-lg">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Tüm Geçmişi Görüntüle
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                  <div className="mt-6">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Değişiklikleri Kaydet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "settings" && (
            <Card>
              <CardHeader>
                <CardTitle>Hesap Ayarları</CardTitle>
                <CardDescription>Hesap ayarlarınızı güncelleyin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Şifre Değiştir</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-1">Mevcut Şifre</label>
                        <Input type="password" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Yeni Şifre</label>
                        <Input type="password" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Yeni Şifre (Tekrar)</label>
                        <Input type="password" />
                      </div>
                      <Button>Şifreyi Güncelle</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Bildirim Ayarları</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="email-notifications" defaultChecked />
                        <label htmlFor="email-notifications">E-posta bildirimleri</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sms-notifications" defaultChecked />
                        <label htmlFor="sms-notifications">SMS bildirimleri</label>
                      </div>
                      <Button>Bildirimleri Güncelle</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4">Hesap Durumu</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="account-active" defaultChecked />
                        <label htmlFor="account-active">Hesabım aktif</label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Hesabınızı devre dışı bırakırsanız, profiliniz ve hizmetleriniz platformda görünmeyecektir.
                      </p>
                      <Button>Durumu Güncelle</Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-4 text-red-600">Tehlikeli Bölge</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
                    </p>
                    <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                      Hesabımı Sil
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CilingirPanel() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Yükleniyor...</h2>
          <p className="text-gray-500">Lütfen bekleyin, çilingir paneli hazırlanıyor.</p>
        </div>
      </div>
    }>
      <CilingirPanelContent />
    </Suspense>
  );
} 