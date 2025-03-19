"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { Info, Phone, Star, Eye, PhoneCall, Instagram, Menu, X } from "lucide-react";
import { useToast } from "../../components/ToastContext";
import Link from "next/link";
import Image from "next/image";

export default function CilingirPanel() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rocketBalance, setRocketBalance] = useState(1500); // Örnek roket bakiyesi
  const [dailyRockets, setDailyRockets] = useState({
    Pazartesi: 10,
    Salı: 10,
    Çarşamba: 10,
    Perşembe: 10,
    Cuma: 10,
    Cumartesi: 15,
    Pazar: 15
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
  const [services, setServices] = useState([
    { id: 1, name: "Kapı Açma", active: true, minPrice: 150, maxPrice: 300 },
    { id: 2, name: "Çelik Kapı Açma", active: true, minPrice: 250, maxPrice: 500 },
    { id: 3, name: "Kasa Açma", active: false, minPrice: 500, maxPrice: 1000 },
    { id: 4, name: "Anahtar Kopyalama", active: true, minPrice: 30, maxPrice: 100 },
    { id: 5, name: "Kilit Değiştirme", active: true, minPrice: 200, maxPrice: 400 },
    { id: 6, name: "Çilingir Anahtar Yapımı", active: false, minPrice: 50, maxPrice: 200 },
    { id: 7, name: "Kırılmaz Kilit Montajı", active: false, minPrice: 300, maxPrice: 600 },
    { id: 8, name: "Kapı Kilidi Değişimi", active: false, minPrice: 150, maxPrice: 350 },
    { id: 9, name: "Pencere Kilidi Değişimi", active: false, minPrice: 100, maxPrice: 250 },
    { id: 10, name: "Oto Kapı Açma", active: false, minPrice: 200, maxPrice: 400 }
  ]);

  const rocketPackages = [
    { id: 1, amount: 1000, price: 5000, description: "Başlangıç Paketi" },
    { id: 2, amount: 3000, price: 12000, description: "Orta Paket" },
    { id: 3, amount: 7000, price: 25000, description: "Pro Paket" },
    { id: 4, amount: 15000, price: 50000, description: "VIP Paket" }
  ];

  const [socialMedia, setSocialMedia] = useState({
    instagram: "@anahtarcilingir",
    facebook: "facebook.com/anahtarcilingir",
    twitter: "@anahtarcilingir",
    youtube: "",
    tiktok: "",
    linkedin: ""
  });

  const handleDailyRocketChange = (day, value) => {
    setDailyRockets(prev => ({
      ...prev,
      [day]: parseInt(value) || 0
    }));
  };

  const handleServiceActiveChange = (id, checked) => {
    setServices(prevServices => prevServices.map(service => 
      service.id === id ? { ...service, active: checked } : service
    ));
  };

  const handleServicePriceChange = (id, field, value) => {
    setServices(prevServices => prevServices.map(service => 
      service.id === id ? { ...service, [field]: parseInt(value) || 0 } : service
    ));
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
      
      <h1 className="hidden md:block text-xl md:text-3xl font-bold my-6">Bi Çilingir Yönetim Paneli</h1>
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
                  onClick={() => {
                    setActiveTab("dashboard");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "dashboard" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Panel</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("profile");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profil Bilgileri</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("services");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "services" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Hizmetlerim</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("jobs");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "jobs" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Aktivite Geçmişi</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("reviews");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "reviews" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <span>Değerlendirmeler</span>
                </button>

                <button 
                  onClick={() => {
                    setActiveTab("social");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "social" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>Sosyal Medya</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("advertising");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "advertising" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Reklam Yönetimi</span>
                </button>
                
                <button 
                  onClick={() => {
                    setActiveTab("settings");
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Hesap Ayarları</span>
                </button>

                <div className="border-t my-2"></div>

                <Link href="/cilingir/login">
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
                        icon: "user",
                        color: "indigo"
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
                              item.color === "indigo" ? "#6366f1" : "#3b82f6"
                            }}>
                        <CardContent className="p-4">
                          <div className="flex items-center">
                            <div className={`p-3 rounded-full mr-4 ${
                              item.color === "blue" ? "bg-blue-100 text-blue-600" : 
                              item.color === "yellow" ? "bg-yellow-100 text-yellow-600" : 
                              item.color === "green" ? "bg-green-100 text-green-600" :
                              item.color === "indigo" ? "bg-indigo-100 text-indigo-600" :
                              "bg-blue-100 text-blue-600"
                            }`}>
                              {item.icon === "eye" ? (
                                <Eye className="h-6 w-6" />
                              ) : item.icon === "star" ? (
                                <Star className="h-6 w-6" />
                              ) : item.icon === "phone" ? (
                                <PhoneCall className="h-6 w-6" />
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
                      <label className="block text-sm mb-1">Sahibi</label>
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
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Adres</label>
                      <Input defaultValue="Kadıköy, İstanbul" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1">Hakkında</label>
                      <textarea 
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        defaultValue="10 yıllık tecrübemizle İstanbul'un her bölgesinde hizmet vermekteyiz. 7/24 acil çilingir hizmeti sunuyoruz."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-4">Çalışma Saatleri</h4>
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
                            <Input 
                              defaultValue="09:00" 
                              disabled={!workDaysOpen[day]}
                              className={`w-24 ${!workDaysOpen[day] ? "bg-gray-100 text-gray-400" : ""}`}
                            />
                            <span className={!workDaysOpen[day] ? "text-gray-400" : ""}>-</span>
                            <Input 
                              defaultValue="18:00" 
                              disabled={!workDaysOpen[day]}
                              className={`w-24 ${!workDaysOpen[day] ? "bg-gray-100 text-gray-400" : ""}`}
                            />
                            <span className={`ml-2 text-sm ${workDaysOpen[day] ? "text-green-600" : "text-red-500"}`}>
                              {workDaysOpen[day] ? "Açık" : "Kapalı"}
                            </span>
                          </div>
                        </div>
                      ))}
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
                  {services.map((service, index) => (
                    <Card key={index} className={`${!service.active ? 'bg-gray-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                          <div className="flex items-center mb-2 md:mb-0">
                            <Checkbox 
                              id={`service-${service.id}`} 
                              checked={service.active}
                              onCheckedChange={(checked) => handleServiceActiveChange(service.id, checked)}
                              className="mr-3"
                            />
                            <label 
                              htmlFor={`service-${service.id}`} 
                              className={`font-medium ${!service.active ? 'text-gray-500' : ''}`}
                            >
                              {service.name}
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 pl-6 md:pl-0">
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm ${!service.active ? 'text-gray-400' : 'text-gray-600'}`}>₺</span>
                              <Input 
                                type="number" 
                                value={service.minPrice} 
                                onChange={(e) => handleServicePriceChange(service.id, 'minPrice', e.target.value)}
                                disabled={!service.active}
                                className={`w-24 ${!service.active ? 'bg-gray-100 text-gray-400' : ''}`}
                                placeholder="Min"
                              />
                              <span className={`text-sm ${!service.active ? 'text-gray-400' : 'text-gray-600'}`}>-</span>
                              <Input 
                                type="number" 
                                value={service.maxPrice} 
                                onChange={(e) => handleServicePriceChange(service.id, 'maxPrice', e.target.value)}
                                disabled={!service.active}
                                className={`w-24 ${!service.active ? 'bg-gray-100 text-gray-400' : ''}`}
                                placeholder="Max"
                              />
                            </div>
                          </div>
                        </div>
                        {!service.active && (
                          <div className="pl-9 mt-2">
                            <span className="text-xs text-gray-400 italic">Bu hizmet şu anda pasif durumda</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-star">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
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
                          style={{ borderLeftColor: activity.color === "blue" ? "#3b82f6" : activity.color === "yellow" ? "#f59e0b" : "#22c55e" }}>
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className={`p-3 rounded-full mr-4 flex-shrink-0 ${
                            activity.color === "blue" ? "bg-blue-100 text-blue-600" : 
                            activity.color === "yellow" ? "bg-yellow-100 text-yellow-600" : 
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
                  <p className="text-sm text-gray-500">120 aktivite gösteriliyor</p>
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
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2 mb-1">
                          <div className="text-sm w-2">{rating}</div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full" 
                              style={{ width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 5 : rating === 2 ? 3 : 2}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="border-b pb-6">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                          <div>
                            <p className="font-medium">Müşteri {item}</p>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-4 h-4 ${i < (6 - Math.min(item, 5)) ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">10 Mart 2024</div>
                      </div>
                      <p className="text-gray-700">
                        {item % 2 === 0 
                          ? "Çok hızlı ve profesyonel hizmet aldım. Kesinlikle tavsiye ederim." 
                          : "Zamanında geldi ve işini çok iyi yaptı. Fiyat da gayet uygundu. Teşekkürler."}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "advertising" && (
            <Card>
              <CardHeader>
                <CardTitle>Reklam Yönetimi</CardTitle>
                <CardDescription>Roket paketleri ve reklam ayarlarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Mevcut Roket Bakiyesi */}
                <div className="mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Roket Bakiyeniz</h3>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-3xl font-bold text-blue-600"> {rocketBalance} Roket</span>
                    </div>
                    <div className="flex items-center ml-2 mt-2 text-gray-600">
                      <Info className="w-4 h-4 mr-2"/>
                      <p className="text-sm">Tahmini roket bitiş tarihi: 10.04.2025</p> 
                    </div>
                  </div>
                </div>

                {/* Roket Paketleri */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Roket Paketleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {rocketPackages.map((pkg) => (
                      <div key={pkg.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="text-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <h4 className="font-bold text-lg">{pkg.amount} Roket</h4>
                          <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                          <p className="text-xl font-bold text-blue-600">{pkg.price}₺</p>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Satın Al
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Günlük Roket Ayarları */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Günlük Roket Kullanım Tercihleriniz</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(dailyRockets).map(([day, amount]) => (
                      <div key={day} className="border rounded-lg p-4 bg-gray-10">
                        <label className="block text-md font-bold text-gray-700 mb-2">{day}</label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            value={amount}
                            onChange={(e) => handleDailyRocketChange(day, e.target.value)}
                            className="w-16"
                          />
                          <span className="text-gray-600">Roket/gün</span>
                        </div>
                      </div>
                    ))}
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

          {activeTab === "social" && (
            <Card>
              <CardHeader>
                <CardTitle>Sosyal Medya Hesapları</CardTitle>
                <CardDescription>Sosyal medya hesaplarınızı yönetin</CardDescription>
              </CardHeader>
              <CardContent>
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

                  {/* Twitter/X */}
                  <div className="pb-6">
                    <div className="flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <h3 className="text-lg font-medium">X (Twitter)</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input 
                        placeholder="X (Twitter) kullanıcı adınız" 
                        value={socialMedia.twitter}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
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

                  {/* LinkedIn */}
                  <div className="pb-6">
                    <div className="flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <h3 className="text-lg font-medium">LinkedIn</h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Input 
                        placeholder="LinkedIn profil linkiniz" 
                        value={socialMedia.linkedin}
                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                        className="flex-grow"
                      />
                    </div>
                  </div>

                  <div className="pt-4 col-span-full">
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleSocialMediaUpdate}
                    >
                      Tüm Değişiklikleri Kaydet
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