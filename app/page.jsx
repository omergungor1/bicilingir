"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";

const styles = {
  accentButton: {
    backgroundColor: '#6495ED',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontWeight: 'bold',
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
  },
  companyLogo: {
    width: '50px',
    height: '50px',
    backgroundColor: '#4169E1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
  },
  starRating: {
    display: 'flex',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    marginRight: '2px',
  }
};

// Örnek çilingir verileri
const locksmithData = [
  {
    id: 1,
    name: "Anahtar Usta",
    location: "İstanbul, Kadıköy",
    rating: 4.8,
    reviewCount: 124,
    services: ["Kapı Açma", "Kilit Değiştirme", "Çelik Kapı"],
    price: "150₺ - 300₺",
    timeAgo: "2 saat önce",
    description: "7/24 acil kapı açma ve kilit değiştirme hizmetleri. Profesyonel ekip ile hızlı ve güvenilir çözümler sunuyoruz."
  },
  {
    id: 2,
    name: "Hızlı Çilingir",
    location: "İstanbul, Beşiktaş",
    rating: 4.6,
    reviewCount: 98,
    services: ["Acil Çilingir", "Oto Çilingir", "Kasa Çilingir"],
    price: "200₺ - 350₺",
    timeAgo: "5 saat önce",
    description: "15 dakika içinde kapınızdayız. Oto, ev ve iş yeri için profesyonel çilingir hizmetleri."
  },
  {
    id: 3,
    name: "Güvenli Anahtar",
    location: "İstanbul, Şişli",
    rating: 4.9,
    reviewCount: 156,
    services: ["Çelik Kapı", "Kasa Çilingir", "Kilit Değiştirme"],
    price: "180₺ - 400₺",
    timeAgo: "1 gün önce",
    description: "Yüksek güvenlikli kilit sistemleri ve çelik kapı uzmanı. 20 yıllık tecrübe ile hizmetinizdeyiz."
  },
  {
    id: 4,
    name: "Usta Çilingir",
    location: "İstanbul, Ümraniye",
    rating: 4.7,
    reviewCount: 87,
    services: ["Kapı Açma", "Oto Çilingir", "Anahtar Kopyalama"],
    price: "120₺ - 250₺",
    timeAgo: "3 saat önce",
    description: "Uygun fiyat garantisi ile tüm çilingir hizmetleri. Anahtar kopyalama ve oto çilingir konusunda uzmanız."
  },
  {
    id: 5,
    name: "Profesyonel Çilingir",
    location: "İstanbul, Maltepe",
    rating: 4.5,
    reviewCount: 76,
    services: ["Acil Çilingir", "Kilit Değiştirme", "Çelik Kapı"],
    price: "170₺ - 320₺",
    timeAgo: "6 saat önce",
    description: "Profesyonel ekip ve ekipmanlarla kaliteli çilingir hizmetleri. 7/24 acil servis mevcuttur."
  },
];

// Yıldız puanı gösterme fonksiyonu
const StarRating = ({ rating }) => {
  return (
    <div style={styles.starRating}>
      {[...Array(5)].map((_, i) => (
        <span key={i} style={styles.star}>
          {i < Math.floor(rating) ? "★" : (i < rating ? "★" : "☆")}
        </span>
      ))}
      <span className="ml-1 text-gray-700">{rating}</span>
    </div>
  );
};

// Loading Spinner Komponenti
const LoadingSpinner = () => (
  <div className="w-full flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
    <p className="text-lg font-medium text-gray-700">En yakın çilingirler bulunuyor...</p>
  </div>
);

// SearchParamsWrapper bileşeni
function SearchParamsWrapper({ children }) {
  const searchParams = useSearchParams();
  return children(searchParams);
}

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // API çağrısını simüle etmek için 2 saniye bekle
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  // SearchParamsHandler bileşeni
  const SearchParamsHandler = ({ searchParams }) => {
    useEffect(() => {
      // URL'de parametre varsa (başka sayfadan yönlendirildiyse)
      if (searchParams.has('location') || searchParams.has('service')) {
        handleSearch();
      }
    }, [searchParams]);

    return null;
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Suspense sınırı ile searchParams kullanımı */}
      <Suspense fallback={<LoadingSpinner />}>
        <SearchParamsWrapper>
          {(searchParams) => <SearchParamsHandler searchParams={searchParams} />}
        </SearchParamsWrapper>
      </Suspense>
      
      {/* Hero Bölümü */}
      <Hero 
        title="En yakın çilingirleri bulun" 
        description="Kapınız kilitli mi kaldı? Anahtarınızı mı kaybettiniz? Endişelenmeyin, Bi Çilingir yanınızda!"
      >
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </Hero>

      {/* Loading Göstergesi */}
      {isLoading && <LoadingSpinner />}

      {/* Çilingir Listesi Bölümü - Sadece sonuçlar gösterildiğinde görünür */}
      {showResults && !isLoading && (
        <section className="w-full bg-gray-50 py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Çilingirler</h2>
              <span className="text-gray-500">5 çilingir bulundu</span>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8">
              {/* Sol Sidebar - Filtreler */}
              <div className="w-full md:w-1/4">
                {/* Mobil görünümde sadece filtreler butonu görünsün */}
                <div className="mb-4 block md:hidden">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? 'Filtreleri Gizle' : 'Filtreleri Göster'}
                    {showFilters ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Button>
                </div>

                {/* Filtreler - Masaüstünde her zaman görünür, mobilde butona tıklayınca görünür */}
                <div className={`bg-white p-6 rounded-lg shadow-sm mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Hizmet Türü</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Checkbox id="acilCilingir" />
                      <label htmlFor="acilCilingir" className="ml-2 text-gray-700">Acil Çilingir</label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox id="kapiAcma" />
                      <label htmlFor="kapiAcma" className="ml-2 text-gray-700">Kapı Açma</label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox id="otoCilingir" />
                      <label htmlFor="otoCilingir" className="ml-2 text-gray-700">Oto Çilingir</label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox id="kasaCilingir" />
                      <label htmlFor="kasaCilingir" className="ml-2 text-gray-700">Kasa Çilingir</label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox id="celikKapi" />
                      <label htmlFor="celikKapi" className="ml-2 text-gray-700">Çelik Kapı</label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox id="kilitDegistirme" />
                      <label htmlFor="kilitDegistirme" className="ml-2 text-gray-700">Kilit Değiştirme</label>
                    </div>

                    <div className="flex items-center">
                      <Checkbox id="anahtarKopyalama" />
                      <label htmlFor="anahtarKopyalama" className="ml-2 text-gray-700">Anahtar Kopyalama</label>
                    </div>
                  </div>
                  
                  

                  <h3 className="text-lg font-bold mb-4 mt-6 text-gray-800">Fiyat Aralığı</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Checkbox id="price1" />
                      <label htmlFor="price1" className="ml-2 text-gray-700">100₺ - 200₺</label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox id="price2" />
                      <label htmlFor="price2" className="ml-2 text-gray-700">200₺ - 300₺</label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox id="price3" />
                      <label htmlFor="price3" className="ml-2 text-gray-700">300₺ - 400₺</label>
                    </div>
                    
                    <div className="flex items-center">
                      <Checkbox id="price4" />
                      <label htmlFor="price4" className="ml-2 text-gray-700">400₺+</label>
                    </div>
                  </div>
                  
                  <Button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                    Filtreleri Uygula
                  </Button>
                  
                  <Button className="mt-2 w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                    Temizle
                  </Button>
                </div>
              </div>
              
              {/* Çilingir Listesi */}
              <div className="w-full md:w-3/4">
                <div className="space-y-4">
                  {locksmithData.map((locksmith) => (
                    <div key={locksmith.id} style={styles.jobCard} className="hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row md:items-center">
                        <div className="mb-4 md:mb-0 md:mr-4">
                          <div style={styles.companyLogo}>
                            <span>{locksmith.name.substring(0, 2)}</span>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-1">{locksmith.name}</h3>
                              <p className="text-gray-600 mb-2">{locksmith.location}</p>
                            </div>
                            <div className="flex items-center">
                              <StarRating rating={locksmith.rating} />
                              <span className="ml-2 text-gray-500">({locksmith.reviewCount} yorum)</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-2">
                            {locksmith.services.map((service, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{service}</span>
                            ))}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{locksmith.price}</span>
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{locksmith.timeAgo}</span>
                          </div>
                          
                          <p className="text-gray-500 text-sm mb-3">
                            {locksmith.description}
                          </p>
                        </div>
                        
                        <div className="mt-4 md:mt-0 md:ml-4 flex flex-col gap-2">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                            Ara
                          </Button>
                          <Button className="bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 w-full">
                            <Link href={`/jobs/${locksmith.id}`} className="flex items-center justify-center">
                              Detaylar
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bi Çilingir Hakkında Bölümü */}
      <section className="w-full bg-white py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Neden Bi Çilingir?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Türkiye'nin en büyük ve güvenilir çilingir ağı</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Güvenilir Çilingirler</h3>
              <p className="text-gray-600">Platformumuzdaki tüm çilingirler titizlikle seçilir ve kimlik doğrulamasından geçer. Sadece lisanslı ve onaylı çilingirler hizmet verebilir.</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Hızlı Hizmet</h3>
              <p className="text-gray-600">Acil durumlar için 7/24 hizmet veren çilingirlerimiz en kısa sürede kapınızda. Ortalama yanıt süremiz 15 dakikanın altında!</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">Müşteri Memnuniyeti</h3>
              <p className="text-gray-600">Gerçek müşteri yorumları ve derecelendirmeleri ile en iyi çilingiri seçebilirsiniz. %98 müşteri memnuniyet oranıyla hizmet veriyoruz.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Nasıl Çalışır?</h3>
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3">1</div>
                <p className="text-gray-700">Konumunuzu ve ihtiyacınız olan hizmeti seçin</p>
              </div>
              <div className="flex items-center justify-center hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3">2</div>
                <p className="text-gray-700">Size en yakın çilingirleri görüntüleyin</p>
              </div>
              <div className="flex items-center justify-center hidden md:block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold mb-3">3</div>
                <p className="text-gray-700">Dilediğiniz çilingiri seçin ve hemen arayın</p>
              </div>
            </div>
            
            <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-lg shadow-lg" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          > Hemen Çilingir Arayın
            </Button>
          </div>
        </div>
      </section>

      {/* Çilingir Lazım Bölümü */}
      <section className="w-full bg-yellow-400 py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Çilingir mi lazım?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-800">
            7/24 hizmet veren çilingir ağımız ile en yakın çilingire hemen ulaşın.
          </p>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 text-lg rounded-lg shadow-lg" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Hemen Çilingir Çağır
          </Button>
        </div>
      </section>
    </main>
  );
} 