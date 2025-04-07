"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import { useToast } from "../components/ToastContext";
import { getLocksmiths } from "./actions";
import { ChevronRight } from "lucide-react";
import { testServices } from "../lib/test-data";
import { useDispatch, useSelector } from 'react-redux'
import { logUserActivity } from '../redux/features/userSlice'
import Image from 'next/image';

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

// Yıldız puanı gösterme fonksiyonu - Çakışmayı önlemek için ismi değiştiriliyor
const RatingStars = ({ rating }) => {
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

// SearchParamsWrapper bileşeni
function SearchParamsWrapper({ children }) {
  const searchParams = useSearchParams();
  return children(searchParams);
}

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLocksmith, setSelectedLocksmith] = useState(null);
  const [hoverRating, setHoverRating] = useState(0);

  const [selectedValues, setSelectedValues] = useState({
    serviceId: null,
    districtId: null,
    provinceId: null
  });

  useEffect(() => {
    console.log('serviceId ve districtId değişti:  ServiceId: ',selectedValues.serviceId, 'DistrictId: ', selectedValues.districtId, 'ProvinceId: ', selectedValues.provinceId);
  }, [selectedValues]);

  const [customerFeedback, setCustomerFeedback] = useState({
    rating: 0,
    comment: "",
    phone: "",
  });

  const [locksmiths, setLocksmiths] = useState([]);
  const [error, setError] = useState(null);
  
  // Tek bir loading state yerine, her çilingir ID'si için ayrı loading state tutacağız
  const [loadingLocksmithIds, setLoadingLocksmithIds] = useState({});
  
  // Toast context hook
  const { showToast } = useToast();
  
  const dispatch = useDispatch()

  // Sayfa yüklendiğinde sayfa görüntüleme aktivitesi kaydet
  useEffect(() => {
    dispatch(logUserActivity({
      action: 'sayfa-goruntuleme',
      details: 'anasayfa',
      entityType: 'page',
      entityId: 'home'
    }))
  }, [dispatch])

  const handleSearch = async () => {
    try {
      // Redux aktivite izlemesi
      if (!selectedValues.provinceId || !selectedValues.districtId || !selectedValues.serviceId) {
        setError('Lütfen il, ilçe ve servis seçiniz');
        return;
      }
      
      setError(null);
      setShowResults(true);
      setIsLoading(true);
      setLocksmiths([]);
      setSelectedLocksmith(null);
      
      const searchParams = new URLSearchParams({
        provinceId: selectedValues.provinceId,
        districtId: selectedValues.districtId,
        serviceId: selectedValues.serviceId,
      });
      
      // Kullanıcı arama aktivitesi kaydı
      dispatch(logUserActivity({
        action: 'arama-yapildi',
        additionalData: {
          searchProvinceId: selectedValues.provinceId,
          searchDistrictId: selectedValues.districtId,
          searchServiceId: selectedValues.serviceId
        }
      }));
      
      const response = await fetch(`/api/public/search?${searchParams.toString()}`);
      const data = await response.json();
      
      if (data && data.locksmiths && data.locksmiths.length > 0) {
        setLocksmiths(data.locksmiths);
        console.log('locksmiths****:', data.locksmiths);
      } else {
        setError('Bu bölgede çilingir bulunamadı');
      }
    } catch (error) {
      console.error('Arama hatası:', error);
      setError('Arama sırasında bir hata oluştu');
    } finally {
      console.log('finally****:');
      setIsLoading(false);
    }
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

  const handleCallLocksmith = (locksmith) => {
    setSelectedLocksmith(locksmith);

    // Çilingir arama aktivitesini kaydet
    dispatch(logUserActivity({
      action: 'cilingir-arama',
      details: `${locksmith.name}, ${locksmith.phone}`,
      entityType: 'locksmith',
      entityId: locksmith.id
    }))

    // Telefon numarasını çağırma işlemi
    const phoneNumber = locksmith.phone;
    // if (phoneNumber) {
    //   window.location.href = `tel:${phoneNumber}`;
    // } else {
    //   showToast("Bu çilingirin telefon numarası bulunamadı", "error", 3000);
    // }
    
    setTimeout(() => {
      setShowRatingModal(true);
    }, 1000);
  };

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    // Burada API'ye gönderilecek
    console.log(`Değerlendirme: ${customerFeedback.rating} yıldız, Yorum: ${customerFeedback.comment}, Çilingir: ${selectedLocksmith.name}`);
    
    // Form temizle
    setCustomerFeedback({
      rating: 0,
      comment: "",
      phone: ""
    });
    
    // Modal kapat
    setShowRatingModal(false);
    
    // Toast bildirimini göster
    showToast("Değerlendirmeniz için teşekkür ederiz!", "success", 3000);
  };

  const LoadingSpinner = () => (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Çilingir bilgileri yükleniyor...</p>
    </div>
  );

  // Çilingir detay butonuna tıklama - aktivite kaydı ekle
  const handleViewDetails = (locksmithId, locksmithSlug) => {
    // Aktivite kaydı yap
    dispatch(logUserActivity({
      action: 'cilingir-detay-goruntuleme',
      entityId: locksmithId,
      entityType: 'locksmith',
      additionalData: {
        locksmithId: locksmithId
      }
    }));
    
    // Çilingir detayını göster
    setLoadingLocksmithIds(prev => ({
      ...prev,
      [locksmithId]: true
    }));
    
    // Router ile yönlendirmeye gerek yok, Link componenti zaten bunu yapıyor
    // Burada sadece loading state'i güncelliyoruz
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
              <SearchForm onSearch={handleSearch} selectedValues={selectedValues} setSelectedValues={setSelectedValues} />
            </div>
          </div>
        </div>
      </Hero>

      {/* Çilingir Sonuçları */}
      {showResults && (
        <div className="w-full max-w-6xl mx-auto px-4 my-12" id="results-section">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">En Yakın Çilingirler</h2>
            {/* <button 
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 flex items-center gap-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
              </svg>
              {showFilters ? "Gizle" : "Filtrele"}
            </button> */}
          </div>
          
          {/* Yüklenirken spinner göster */}
          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
            </div>
          ) : (
            <>
              {/* Filtre Paneli */}
              {showFilters && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Hizmet Türü</h3>
                      <div className="space-y-2">
                        {['Kapı Açma', 'Kilit Değiştirme', 'Çelik Kapı', 'Oto Çilingir', 'Kasa Çilingir'].map((service) => (
                          <div key={service} className="flex items-center">
                            <Checkbox id={service} />
                            <label htmlFor={service} className="ml-2 text-sm text-gray-700">{service}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Değerlendirme</h3>
                      <div className="space-y-2">
                        {[4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <Checkbox id={`rating-${rating}`} />
                            <label htmlFor={`rating-${rating}`} className="ml-2 text-sm text-gray-700">
                              {rating}+ <span className="text-yellow-500">★</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Çalışma Saatleri</h3>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox id="24-hours" />
                          <label htmlFor="24-hours" className="ml-2 text-sm text-gray-700">24 Saat Açık</label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox id="weekend" />
                          <label htmlFor="weekend" className="ml-2 text-sm text-gray-700">Hafta Sonu Açık</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button variant="outline" className="mr-2">Temizle</Button>
                    <Button>Filtrele</Button>
                  </div>
                </div>
              )}
              
              {/* Çilingir Listesi */}
              <div className="space-y-6">
                {locksmiths.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">Bu bölgede hiç çilingir bulunamadı.</p>
                ) : (
                  locksmiths.map((locksmith, index) => (
                    <div key={locksmith.id} className={`border ${index === 0 ? 'border-blue-400 border-2 shadow-lg relative transform transition hover:scale-[1.02]' : 'border-gray-200 hover:shadow-md transition'} rounded-lg overflow-hidden ${index === 0 ? 'bg-blue-50' : ''}`}>
                      {index === 0 && (
                        <div className="bg-blue-600 text-white py-1 px-4 absolute top-0 left-0 rounded-br-lg font-medium text-sm shadow-md z-10">
                          En İyi Eşleşme
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row">
                        <div className={`p-6 flex-1 ${index === 0 ? 'pt-10' : ''}`}>
                          <div className="flex items-start mb-4">
                            <div style={styles.companyLogo} className={`mr-4 flex-shrink-0 ${index === 0 ? 'bg-blue-600 text-white shadow-md' : ''}`}>
                              <span>{locksmith.name.substring(0, 2)}</span>
                            </div>
                            <div>
                              <div className="flex flex-col md:flex-row md:items-center mt-1 gap-2">
                                <h3 className={`text-xl font-bold ${index === 0 ? 'text-blue-800' : 'text-gray-800'}`}>{locksmith.name}</h3>
                                {index === 0 && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Onaylı Çilingir
                                  </span>
                                )}
                                <div className="w-1 h-1 bg-gray-400 rounded-full hidden md:block" />
                                <p className="text-gray-600">{locksmith.city} - {locksmith.district}</p>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center mt-1">
                                <RatingStars rating={locksmith.rating.toFixed(1)} />
                                <span className="md:ml-2 text-sm text-gray-500">({locksmith.reviewCount} değerlendirme)</span>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{locksmith.description}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {locksmith.serviceNames.map((serviceName, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{serviceName}</span>
                            ))}
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">{locksmith.price.min}₺ - {locksmith.price.max}₺</span>
                          </div>
                        </div>
                        
                        <div className="p-6 flex flex-col justify-center md:w-64">
                          <div className="space-y-3">
                            <Button 
                              onClick={() => handleCallLocksmith(locksmith)}
                              className={`w-full ${index === 0 ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold animate-pulse shadow-md' : 'bg-[#4169E1]'}`}
                            >
                              {index === 0 ? 'Hemen Ara' : 'Ara'}
                              {index === 0 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                              )}
                            </Button>
                            <Link href={`/${locksmith.slug}`} passHref>
                              <Button 
                                variant="outline" 
                                className="w-full"
                                disabled={loadingLocksmithIds[locksmith.id]}
                                onClick={() => handleViewDetails(locksmith.id, locksmith.slug)}
                              >
                                {loadingLocksmithIds[locksmith.id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    Detaylar
                                    <ChevronRight className="w-4 h-4" />
                                  </>
                                )}
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
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

      {/* Derecelendirme Modalı */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button 
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowRatingModal(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Çilingir Hizmet Değerlendirmesi</h3>
              <p className="text-gray-600">
                {selectedLocksmith?.name} çilingiri için değerlendirmenizi paylaşın
              </p>
            </div>
            
            <form onSubmit={handleRatingSubmit}>
              <div className="mb-6">
                <div className="text-center mb-2">
                  <p className="text-gray-700 mb-2">Hizmet kalitesini puanlayın</p>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setCustomerFeedback({ ...customerFeedback, rating: star })}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl focus:outline-none"
                      >
                        {star <= (hoverRating || customerFeedback.rating) ? (
                          <span className="text-yellow-400">★</span>
                        ) : (
                          <span className="text-gray-300">☆</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {customerFeedback.rating === 1 && "Çok Kötü"}
                    {customerFeedback.rating === 2 && "Kötü"}
                    {customerFeedback.rating === 3 && "Orta"}
                    {customerFeedback.rating === 4 && "İyi"}
                    {customerFeedback.rating === 5 && "Çok İyi"}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="comment" className="block text-gray-700 mb-2">
                  Yorumunuz
                </label>
                <textarea
                  id="comment"
                  value={customerFeedback.comment}
                  onChange={(e) => setCustomerFeedback({ ...customerFeedback, comment: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Deneyiminizi paylaşın (opsiyonel)"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={customerFeedback.rating === 0 }
                >
                  Gönder
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 