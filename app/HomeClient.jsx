"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "../components/ui/button";
import Hero from "../components/Hero";
import SearchForm from "../components/SearchForm";
import { useToast } from "../components/ToastContext";
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedValues as setReduxSelectedValues } from '../redux/features/searchSlice';
import { useRouter } from "next/navigation";
import { RatingModal } from "../components/RatingModal";
import LocksmithCard from "../components/ui/locksmith-card";
import { useUserTracking } from '../hooks/useUserTracking';


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

export default function HomeClient() {
  // Kullanıcı takibini başlat
  useUserTracking();

  // Redux state ve dispatch
  const dispatch = useDispatch();
  const {
    selectedValues: reduxSelectedValues = { serviceId: null, serviceSlug: null, districtId: null, provinceId: null },
    locksmiths: reduxLocksmiths = [],
    isLoading: reduxIsLoading = false,
    error: reduxError = null,
    showResults: reduxShowResults = false,
    hasSearched: reduxHasSearched = false
  } = useSelector(state => state.search) || {};

  // Lokal state - Redux tarafından yönetilecek alanlar için artık iskeleti tutuyoruz
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLocksmith, setSelectedLocksmith] = useState(null);

  // Local state tanımlamaları - serviceList burada tanımlıyoruz
  const [serviceList, setServiceList] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);


  // Form değerleri için local state - Redux store ile senkronize çalışacak
  const [selectedValues, setSelectedValues] = useState({
    serviceId: null,
    serviceSlug: null,
    districtId: null,
    provinceId: null
  });

  // Redux store değişince local state'i güncelle
  useEffect(() => {
    if (reduxSelectedValues) {
      // Mevcut değerlerle gelen değerleri karşılaştır, farklıysa güncelle
      const isDifferent =
        reduxSelectedValues.serviceId !== selectedValues.serviceId ||
        reduxSelectedValues.serviceSlug !== selectedValues.serviceSlug ||
        reduxSelectedValues.districtId !== selectedValues.districtId ||
        reduxSelectedValues.provinceId !== selectedValues.provinceId;

      if (isDifferent) {
        // Önce yeni değerleri oluşturalım
        const newValues = {
          serviceId: reduxSelectedValues.serviceId || null,
          serviceSlug: reduxSelectedValues.serviceSlug || null,
          districtId: reduxSelectedValues.districtId || null,
          provinceId: reduxSelectedValues.provinceId || null
        };

        // Tek bir state güncellemesi yapalım
        setSelectedValues(newValues);

        // Servis ID veya Slug'a göre UI'da servis filtresini seçelim
        // Burayı ayrı bir useEffect'e taşıyalım
      }
    }
  }, [reduxSelectedValues]); // selectedValues'u bağımlılıklardan çıkardık

  // Service ID ve slug'ı takip eden ayrı bir useEffect
  useEffect(() => {
    // ServiceList ve reduxSelectedValues hazır olduğunda
    if (serviceList?.length > 0 && reduxSelectedValues) {
      if (reduxSelectedValues.serviceId) {
        setSelectedServiceId(reduxSelectedValues.serviceId);
      } else if (reduxSelectedValues.serviceSlug) {
        // Slug'a göre servisi bul ve ID'sini ayarla
        const matchingService = serviceList.find(s => s.slug === reduxSelectedValues.serviceSlug);
        if (matchingService) {
          setSelectedServiceId(matchingService.id);
        }
      }
    }
  }, [serviceList, reduxSelectedValues]);

  const [customerFeedback, setCustomerFeedback] = useState({
    rating: 0,
    comment: ""
  });

  // Local state yerine Redux state kullan
  const locksmiths = reduxLocksmiths;
  const isLoading = reduxIsLoading;
  const error = reduxError;
  const showResults = reduxShowResults;

  // Tek bir loading state yerine, her çilingir ID'si için ayrı loading state tutacağız
  const [loadingLocksmithIds, setLoadingLocksmithIds] = useState({});

  // Toast context hook
  const { showToast } = useToast();

  // Local değişikliği Redux'a aktar
  const handleLocalSelectedValuesChange = (newValues) => {
    // İki çözüm var: ya bunu tamamen kaldırabilir ve sadece newValues ile çalışabiliriz
    // ya da gerçekten değişiklik olduğunda değer güncellemesi yapabiliriz

    // Değerler zaten aynıysa güncelleme yapma (boş incelemeleri kapat)
    let hasChanged = false;
    const mergedValues = { ...selectedValues };

    // Sadece gelen alanlara bak ve bunları güncelle
    Object.keys(newValues).forEach(key => {
      if (newValues[key] !== selectedValues[key]) {
        mergedValues[key] = newValues[key];
        hasChanged = true;
      }
    });

    // Değişiklik yoksa işlem yapma
    if (!hasChanged) return;

    // Redux'a değerleri gönder 
    dispatch(setReduxSelectedValues(mergedValues));

    // Local state'i güncelle (sadece bir kez)
    setSelectedValues(mergedValues);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();

    // Validasyon: Gerekli alanlar seçilmiş mi?
    if (!selectedValues.provinceId || !selectedValues.districtId) {
      showToast('Lütfen ilçenizi seçin');
      return;
    }

    // Redux durumunu güncelle (isLoading = true, showResults = true)
    dispatch({ type: 'search/searchLocksmiths/pending' });
    setLoadingLocksmithIds({});

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('provinceId', selectedValues.provinceId);
      searchParams.append('districtId', selectedValues.districtId);

      // Servis ID veya Slug varsa ekle
      if (selectedValues.serviceSlug) {
        searchParams.append('servicetypeSlug', selectedValues.serviceSlug);
      } else if (selectedValues.serviceId) {
        searchParams.append('serviceId', selectedValues.serviceId);
      }

      searchParams.append('count', 3);

      // API isteğini doğrudan /api/locksmiths endpointine yönlendir
      const response = await fetch(`/api/locksmiths?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Çilingir verisi geldi mi kontrol et
      if (data.locksmiths && data.locksmiths.length > 0) {
        // Redux durumunu güncelle
        dispatch({
          type: 'search/searchLocksmiths/fulfilled',
          payload: {
            locksmiths: data.locksmiths,
            selectedValues: selectedValues
          }
        });
      } else {
        // Sonuç bulunamadı bilgisini gönder
        dispatch({
          type: 'search/searchLocksmiths/fulfilled',
          payload: {
            locksmiths: [],
            selectedValues: selectedValues
          }
        });

        // Kullanıcıya bilgi ver
        showToast('Bu bölgede çilingir bulunamadı.', 'info');
      }

      // Sonuçları göster
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error('Arama hatası:', error);
      dispatch({
        type: 'search/searchLocksmiths/rejected',
        payload: 'Çilingir araması sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      });
    }
  };

  const handleSearchWithValues = async (values) => {
    // Validasyon: Gerekli alanlar seçilmiş mi?
    if (!values.provinceId || !values.districtId) {
      showToast('Lütfen ilçenizi seçin');
      return;
    }

    // Redux durumunu güncelle (isLoading = true, showResults = true)
    dispatch({ type: 'search/searchLocksmiths/pending' });
    setLoadingLocksmithIds({});

    try {
      const searchParams = new URLSearchParams();
      searchParams.append('provinceId', values.provinceId);
      searchParams.append('districtId', values.districtId);

      // Servis ID veya Slug varsa ekle
      if (values.serviceSlug) {
        searchParams.append('servicetypeSlug', values.serviceSlug);
      } else if (values.serviceId) {
        searchParams.append('serviceId', values.serviceId);
      }

      searchParams.append('count', 3);

      // API isteğini doğrudan /api/locksmiths endpointine yönlendir
      const response = await fetch(`/api/locksmiths?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Çilingir verisi geldi mi kontrol et
      if (data.locksmiths && data.locksmiths.length > 0) {
        // Redux durumunu güncelle
        dispatch({
          type: 'search/searchLocksmiths/fulfilled',
          payload: {
            locksmiths: data.locksmiths,
            selectedValues: values
          }
        });
      } else {
        // Sonuç bulunamadı bilgisini gönder
        dispatch({
          type: 'search/searchLocksmiths/fulfilled',
          payload: {
            locksmiths: [],
            selectedValues: values
          }
        });

        // Kullanıcıya bilgi ver
        showToast('Bu bölgede çilingir bulunamadı.', 'info');
      }

      // Sonuçları göster
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
      console.error('Arama hatası:', error);
      dispatch({
        type: 'search/searchLocksmiths/rejected',
        payload: 'Çilingir araması sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      });
    }
  };

  // SearchParamsHandler bileşeni
  const SearchParamsHandler = ({ searchParams }) => {
    useEffect(() => {
      if (searchParams.has('focusList')) {
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }

      // URL'de parametre varsa (başka sayfadan yönlendirildiyse)
      if (searchParams.has('location') || searchParams.has('service') || searchParams.has('fromDetail')) {
        // URL'de fromDetail parametresi varsa, bu geri dönüş aramasıdır
        const isFromDetailPage = searchParams.has('fromDetail');

        // Redux store'dan mevcut seçili değerleri al (null kontrolü ile)
        const currentProvinceId = reduxSelectedValues?.provinceId;
        const currentDistrictId = reduxSelectedValues?.districtId;
        const currentServiceId = reduxSelectedValues?.serviceId;
        const currentServiceSlug = reduxSelectedValues?.serviceSlug;

        // Kullanıcı detay sayfasından geri dönüyorsa filtreyi muhafaza edelim
        if (isFromDetailPage) {
          // Redux'ta kaydedilmiş ID varsa onu UI'da gösterelim 
          if (currentServiceId) {
            setSelectedServiceId(currentServiceId);
          } else if (currentServiceSlug && serviceList && serviceList.length > 0) {
            // Slug'a göre servisi bul ve ID'sini ayarla
            const matchingService = serviceList.find(s => s.slug === currentServiceSlug);
            if (matchingService) {
              setSelectedServiceId(matchingService.id);
            }
          }
        }

        // Eğer değerler zaten seçiliyse ve detay sayfasından geliyorsa,
        // sadece arama sonuçlarını göster ama loglama yapma
        if (isFromDetailPage && currentProvinceId && currentDistrictId) {
          // Redux loading durumunu güncelle
          dispatch({ type: 'search/searchLocksmiths/pending' });

          // API çağrısı yaparak çilingir verilerini getir
          const fetchData = async () => {
            try {
              const searchParams = new URLSearchParams();
              searchParams.append('provinceId', currentProvinceId);
              searchParams.append('districtId', currentDistrictId);
              searchParams.append('serviceId', currentServiceId);
              searchParams.append('count', 3);

              // Doğrudan API çağrısı yap
              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
              const url = `${baseUrl}/api/locksmiths?${searchParams.toString()}`;
              const response = await fetch(url);
              const data = await response.json();

              if (!response.ok) {
                throw new Error(data.error || 'Çilingir verilerini alırken bir hata oluştu');
              }

              // Redux store güncelleme
              if (data.locksmiths && data.locksmiths.length > 0) {
                // Çilingir sonuçları için ek veri hazırlığı
                const formattedLocksmiths = data.locksmiths.map(locksmith => {
                  return {
                    ...locksmith,
                    serviceNames: locksmith.serviceList?.map(service => service.name) || [],
                    price: {
                      min: locksmith.serviceList && locksmith.serviceList.length > 0 ?
                        Math.min(...locksmith.serviceList.map(s => s.price1.min)) : 0,
                      max: locksmith.serviceList && locksmith.serviceList.length > 0 ?
                        Math.max(...locksmith.serviceList.map(s => s.price1.max)) : 0
                    }
                  };
                });

                // Redux store'u başarılı sonuçla güncelle
                dispatch({
                  type: 'search/searchLocksmiths/fulfilled',
                  payload: {
                    locksmiths: formattedLocksmiths,
                    selectedValues: {
                      provinceId: currentProvinceId,
                      districtId: currentDistrictId,
                      serviceId: currentServiceId
                    }
                  }
                });
              } else {
                dispatch({
                  type: 'search/searchLocksmiths/fulfilled',
                  payload: {
                    locksmiths: [],
                    selectedValues: {
                      provinceId: currentProvinceId,
                      districtId: currentDistrictId,
                      serviceId: currentServiceId
                    }
                  }
                });
              }

              // Detay sayfasından dönüşte de sonuçlar bölümüne kaydır
              setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 100);
            } catch (error) {
              console.error("Arama hatası:", error);
              // Redux store'u hata ile güncelle
              dispatch({
                type: 'search/searchLocksmiths/rejected',
                payload: error.message
              });
            }
          };

          fetchData();
        } else if (searchParams.has('location') || searchParams.has('service')) {
          // Normal arama
          handleSearch();
        }
      }
    }, [searchParams]);

    return null;
  };

  const handleRatingSubmit = async ({ rating, comment }) => {
    try {
      if (!selectedLocksmith) {
        showToast("Bir hata oluştu, lütfen tekrar deneyin", "error", 3000);
        return;
      }

      // Form validasyonu
      if (rating === 0) {
        showToast("Lütfen bir değerlendirme puanı seçin", "warning", 3000);
        return;
      }

      // Değerlendirmeyi apiye gönder
      const response = await fetch('/api/public/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locksmithId: selectedLocksmith.id,
          rating: rating,
          comment: comment || "",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Değerlendirme gönderilirken bir hata oluştu");
      }

      // API üzerinden doğrudan aktivite kaydı oluştur
      const activityResponse = await fetch('/api/public/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activitytype: 'review_submit',
          level: 1,
          data: JSON.stringify({
            locksmithId: selectedLocksmith.id,
            reviewId: result.reviewId,
            searchProvinceId: reduxSelectedValues.provinceId,
            searchDistrictId: reduxSelectedValues.districtId,
            searchServiceId: reduxSelectedValues.serviceId
          }),
          userId: localStorage.getItem('userId'),
          sessionId: localStorage.getItem('sessionId'),
          userAgent: navigator.userAgent || ''
        }),
      });

      if (!activityResponse.ok) {
        console.error('Değerlendirme aktivite log hatası:', await activityResponse.text());
      }

      // Modal kapat
      setShowRatingModal(false);

      // Toast bildirimini göster
      showToast("Değerlendirmeniz için teşekkür ederiz! İncelendikten sonra yayınlanacaktır.", "success", 3000);

    } catch (error) {
      console.error("Değerlendirme gönderme hatası:", error);
      showToast("Değerlendirme gönderilirken bir hata oluştu. Lütfen tekrar deneyin.", "error", 3000);
    }
  };

  const LoadingSpinner = () => (
    <div className="w-full flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-lg font-medium text-gray-700">Çilingir bilgileri yükleniyor...</p>
    </div>
  );

  // Çilingir detay butonuna tıklama - aktivite kaydı ekle
  const router = useRouter();


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/public/services");
        const data = await response.json();

        setServiceList(data.data);
      } catch (error) {
        console.error("Hizmetler yüklenirken hata:", error);
        showToast("Hizmetler yüklenirken bir sorun oluştu", "error", 3000);
      }
    };

    fetchServices();
  }, []);

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
        description="Kapınız kilitli mi kaldı? Anahtarınızı mı kaybettiniz? Endişelenmeyin, Bi Çilingir yanınızda! Aşağıya ilçenizi yazınız..."
      >
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full">
              <SearchForm
                onSearch={handleSearch}
                selectedValues={selectedValues}
                setSelectedValues={handleLocalSelectedValuesChange}
              />
            </div>
          </div>
        </div>
      </Hero>

      {/* Çilingir Sonuçları */}
      {reduxShowResults && (
        <div className="w-full max-w-6xl mx-auto px-4 my-12" id="results-section">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">En Yakın Çilingirler</h2>
          </div>

          {/* Yüklenirken spinner göster */}
          {reduxIsLoading ? (
            <LoadingSpinner />
          ) : reduxError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{reduxError}</p>
              <Button onClick={() => window.location.reload()}>Tekrar Dene</Button>
            </div>
          ) : (
            <>
              {/* Servis Kategori Filtreleri */}
              <div className="mb-6 bg-white p-0 rounded-lg">
                {/* <h3 className="text-lg font-medium text-gray-700 mb-3">Hizmet Kategorileri</h3> */}
                <div className="flex overflow-x-auto no-scrollbar gap-1 pb-0">
                  <Button
                    variant={selectedServiceId === null ? "primary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedServiceId(null);
                      // Tüm servisleri göster (sadece ilçe bazlı filtreleme)
                      const newValues = { ...selectedValues, serviceId: null, serviceSlug: null };
                      setSelectedValues(newValues);
                      // Yeni değerlerle arama yap (doğrudan güncel değerleri kullan)
                      handleSearchWithValues(newValues);
                    }}
                    className={`rounded-full whitespace-nowrap flex-shrink-0 ${selectedServiceId === null
                      ? "bg-blue-600 text-white font-bold shadow-md border-2 border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    Tümü
                  </Button>
                  {/* Servis kategorileri (dinamik olarak yüklenecek) */}
                  {serviceList.map(service => (
                    <Button
                      key={service.id}
                      variant={selectedServiceId === service.id ? "primary" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        const newValues = {
                          ...selectedValues,
                          serviceSlug: service.slug
                        };
                        setSelectedValues(newValues);
                        handleSearchWithValues(newValues);
                      }}
                      className={`rounded-full whitespace-nowrap flex-shrink-0 ${selectedServiceId === service.id
                        ? "bg-blue-600 text-white font-bold shadow-md border-2 border-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {service.name.split(' ')[0]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* CSS sınıfı ekleyelim */}
              <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;  /* IE ve Edge */
                  scrollbar-width: none;     /* Firefox */
                }
              `}</style>

              {/* Çilingir Listesi */}
              <div className="space-y-6">
                {reduxLocksmiths.length === 0 ? (
                  <p className="text-center py-12 text-gray-500">Bu bölgede hiç çilingir bulunamadı.</p>
                ) : (
                  reduxLocksmiths.map((locksmith, index) => (
                    <LocksmithCard
                      key={locksmith.id}
                      locksmith={locksmith}
                      index={index}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {reduxLocksmiths.length === 0 && !reduxShowResults && (
        <>
          {/* Bi Çilingir Hakkında Bölümü */}
          <section className="w-full bg-white py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Neden Bi Çilingir?</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">Türkiye'nin ilk ve tek çilingir arama platformu</p>
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

          {/* Çilingirler İçin Bölüm */}
          <section className="w-full py-16 px-4 bg-gray-100">
            <div className="container mx-auto text-center">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Çilingir misin?</h2>
                <p className="text-xl mb-8 text-gray-700">
                  BiÇilingir'e katılın ve daha fazla müşteriye ulaşın! Platformumuzda listelenip, hizmet kapsamınızı genişletin ve işlerinizi büyütün.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl mb-4 text-blue-600">👥</div>
                    <h3 className="text-lg font-bold mb-2">Daha Fazla Müşteri</h3>
                    <p className="text-gray-600">Binlerce potansiyel müşteri ile buluşun ve iş hacminizi artırın.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl mb-4 text-blue-600">📱</div>
                    <h3 className="text-lg font-bold mb-2">Kolay Yönetim</h3>
                    <p className="text-gray-600">Hizmetlerinizi ve müşteri yorumlarınızı tek bir yerden yönetin.</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-4xl mb-4 text-blue-600">🚀</div>
                    <h3 className="text-lg font-bold mb-2">İşinizi Büyütün</h3>
                    <p className="text-gray-600">Çevrimiçi varlığınızı güçlendirin ve marka bilinirliğinizi artırın.</p>
                  </div>
                </div>
                <Link href="/bilgi">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg">
                    Detaylar
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Nasıl Çalışır? Bölümü */}
          <section className="text-center py-12">
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
          </section>

          {/* Müşteri Yorumları Bölümü */}
          <section className="w-full bg-blue-50 py-16 px-4">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4 text-gray-800">Müşterilerimiz Ne Diyor?</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  İlk kullanıcılarımızın değerli deneyimleri
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Yorum Kartı 1 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      MH
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">Ramazan A.</h4>
                      <div className="flex text-yellow-500">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Gece yarısı kapıda kaldığımda BiÇilingir sayesinde 20 dakika içinde yardım alabildim. Hızlı, güvenilir ve profesyonel hizmet için teşekkürler!"
                  </p>
                  <p className="text-sm text-gray-500">Bursa, Nilüfer</p>
                </div>

                {/* Yorum Kartı 2 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      AY
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">Ayşe Y.</h4>
                      <div className="flex text-yellow-500">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Anahtarımı kaybettiğimde çok endişelenmiştim. BiÇilingir'den bulduğum çilingir sayesinde sorunum hızlıca çözüldü. Çok profesyonel ve uygun fiyatlıydı."
                  </p>
                  <p className="text-sm text-gray-500">Bursa, Osmangazi</p>
                </div>

                {/* Yorum Kartı 3 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      OT
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">Oğuz T.</h4>
                      <div className="flex text-yellow-500">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Gece açık çilingir bulmak çok zordu, BiÇilingir sayesinde kolayca 7/24 hizmet veren bir çilingir bulabildim. Hem hızlı hem de ekonomik bir çözüm oldu."
                  </p>
                  <p className="text-sm text-gray-500">Bursa, Yıldırım</p>
                </div>

                {/* Yorum Kartı 4 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      EC
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">Elif C.</h4>
                      <div className="flex text-yellow-500">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Evimin kapısında kilitli kaldığımda panik olmuştum. BiÇilingir platformundan ulaştığım çilingir 15 dakikada yanımdaydı. Çok teşekkür ederim!"
                  </p>
                  <p className="text-sm text-gray-500">Bursa, Gemlik</p>
                </div>

                {/* Yorum Kartı 5 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      SB
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">Serkan B.</h4>
                      <div className="flex text-yellow-500">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "Arabamın anahtarını kaybettiğimde BiÇilingir'den oto çilingir buldum. Fiyatları şeffaf ve hizmet kalitesi yüksekti. Kesinlikle tavsiye ederim."
                  </p>
                  <p className="text-sm text-gray-500">Bursa, Gürsu</p>
                </div>

                {/* Yorum Kartı 6 */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      ZK
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-lg">Zeynep K.</h4>
                      <div className="flex text-yellow-500">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">
                    "BiÇilingir sayesinde güvenilir bir çilingir kolayca bulabildim. Fiyatları görüntüleme imkanı sunması çok faydalı. Teşekkürler BiÇilingir!"
                  </p>
                  <p className="text-sm text-gray-500">Bursa, Kestel</p>
                </div>
              </div>

              <div className="text-center mt-12">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Hemen Arama Yap
                </Button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Derecelendirme Modalı */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        locksmith={selectedLocksmith}
      />
    </main>
  );
}
