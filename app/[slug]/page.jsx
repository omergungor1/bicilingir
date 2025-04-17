"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import { EmergencyCallButton } from "../../components/emergency-button";
import { ImageGallery } from "../../components/image-gallery";
import { logUserActivity } from '../../redux/features/userSlice';
import { RatingModal } from "../../components/RatingModal";
import { useToast } from "../../components/ToastContext";

const styles = {
  header: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff'
  },
  companyLogo: {
    width: '60px',
    height: '60px',
    backgroundColor: '#4169E1',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    overflow: 'hidden',
  },
  smallCompanyLogo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#4169E1',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: '12px'
  },
  jobCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    backgroundColor: '#ffffff',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  newsletterSection: {
    background: 'linear-gradient(to right, #4169E1, #6495ED)',
    color: '#ffffff',
    padding: '48px 0',
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

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="w-full flex flex-col items-center justify-center py-12">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
    <p className="text-lg font-medium text-gray-700">Çilingir bilgileri yükleniyor...</p>
  </div>
);

export default function LocksmithDetail({ params }) {
  // Redux state'ini al
  const dispatch = useDispatch();
  const { hasSearched } = useSelector(state => state.search);

  // Next.js 14'te iki yoldan slug alabiliriz: 
  // 1. React.use ile params'ı unwrap ederek (server component uyumlu)
  // 2. useParams hook'u ile (client component uyumlu)

  // Önce useParams ile deneyelim, olmazsa params'ı kullanacağız
  const routeParams = useParams();
  // Slug'ı routeParams'dan veya normal params'dan al
  const slug = routeParams.slug || (params ? React.use(params).slug : null);

  const { showToast } = useToast();

  const [locksmith, setLocksmith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [visibleReviews, setVisibleReviews] = useState(3); // İlk başta kaç yorum gösterileceği
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLocksmith, setSelectedLocksmith] = useState(null);

  useEffect(() => {
    const fetchLocksmithDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/locksmith/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Çilingir detayları yüklenirken bir hata oluştu');
        }

        if (data.success && data.locksmith) {
          setLocksmith(data.locksmith);
          setFilteredReviews(data.locksmith.reviews || []);
        } else {
          throw new Error('Çilingir bilgileri bulunamadı');
        }
      } catch (err) {
        console.error('Çilingir detayları getirilirken hata:', err);
        setError(err.message || 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLocksmithDetails();
    }
  }, [slug]);

  // Yıldız ratingine göre yorumları filtrele
  useEffect(() => {
    if (!locksmith || !locksmith.reviews) return;

    // Yeni bir filtre seçildiğinde görünen yorum sayısını sıfırla
    setVisibleReviews(3);

    if (selectedRating === null) {
      // Eğer hiçbir yıldız seçilmemişse tüm yorumları göster
      setFilteredReviews(locksmith.reviews);
    } else {
      // Seçilen yıldıza göre yorumları filtrele
      const filtered = locksmith.reviews.filter(review =>
        Math.floor(review.rating) === selectedRating
      );
      setFilteredReviews(filtered);
    }
  }, [selectedRating, locksmith]);

  // Tüm yorumları göster
  const showAllReviews = () => {
    setSelectedRating(null);
  };

  // Daha fazla yorum yükle
  const loadMoreReviews = () => {
    setVisibleReviews(prev => prev + 3); // Her seferinde 3 yorum daha ekle
  };

  // Hemen Ara butonuna tıklandığında
  const handleCallLocksmith = () => {
    setSelectedLocksmith(locksmith);

    // Çilingir arama aktivitesini kaydet
    try {
      // API üzerinden doğrudan aktivite kaydı oluştur
      fetch('/api/public/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activitytype: 'call_request',
          level: 1,
          data: JSON.stringify({
            locksmithId: locksmith.id,
            details: `${locksmith.businessname || locksmith.fullname}`
          }),
          userId: localStorage.getItem('userId'),
          sessionId: localStorage.getItem('sessionId'),
          userAgent: navigator.userAgent || ''
        }),
      })
        .then(response => {
          if (!response.ok) {
            console.error('Aktivite log hatası:', response.statusText);
          } else {
            console.log('Çilingir arama aktivitesi kaydedildi.');
          }
        })
        .catch(error => {
          console.error('Aktivite log hatası:', error);
        });
    } catch (error) {
      console.error('Aktivite log hatası:', error);
    }

    // // Google Analytics'e arama sonucu görüntüleme kaydı
    // try {
    //   if (typeof window !== 'undefined' && window.gtag_report_conversion && locksmith) {
    //     // Dönüşüm takibi, URL'yi iletmeden gerçekleştir
    //     window.gtag_report_conversion();
    //     console.log('Google Ads dönüşüm takibi gönderildi');
    //   }
    // } catch (error) {
    //   console.error('Google Ads dönüşüm takibi hatası:', error);
    // }

    // Telefon numarasını çağırma işlemi
    if (locksmith.phonenumber) {
      window.location.href = `tel:${locksmith.phonenumber}`;
    } else {
      showToast("Bu çilingirin telefon numarası bulunamadı", "error");
    }

    // Belirli bir süre sonra değerlendirme modalını göster
    setTimeout(() => {
      setShowRatingModal(true);
    }, 1500);
  };

  const handleWhatsappMessage = () => {
    // Çilingir whatsapp mesajı aktivitesini kaydet
    try {
      // API üzerinden doğrudan aktivite kaydı oluştur
      fetch('/api/public/user/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activitytype: 'whatsapp_message',
          level: 1,
          data: JSON.stringify({
            locksmithId: locksmith.id,
            details: `${locksmith.businessname || locksmith.fullname}`
          }),
          userId: localStorage.getItem('userId'),
          sessionId: localStorage.getItem('sessionId'),
          userAgent: navigator.userAgent || ''
        }),
      })
        .then(response => {
          if (!response.ok) {
            console.error('Aktivite log hatası:', response.statusText);
          } else {
            console.log('Çilingir whatsapp mesajı aktivitesi kaydedildi.');
          }
        })
        .catch(error => {
          console.error('Aktivite log hatası:', error);
        });
    } catch (error) {
      console.error('Aktivite log hatası:', error);
    }

    try {
      console.log(locksmith);
      // WhatsApp numarasını formatlama ve yönlendirme
      if (locksmith.whatsappnumber) {
        let formattedNumber = locksmith.whatsappnumber.replace(/\s+/g, '');
        if (formattedNumber.startsWith('+')) {
          formattedNumber = formattedNumber.substring(1);
        }

        if (!formattedNumber.startsWith('90') && !formattedNumber.startsWith('0')) {
          formattedNumber = '90' + formattedNumber;
        } else if (formattedNumber.startsWith('0')) {
          formattedNumber = '90' + formattedNumber.substring(1);
        }

        const defaultMessage = encodeURIComponent("Merhaba, Bi Çilingir uygulamasından ulaşıyorum. Çilingir hizmetine ihtiyacım var.");
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const whatsappUrl = `https://wa.me/${formattedNumber}?text=${defaultMessage}`;
        const iosWhatsappUrl = `whatsapp://send?phone=${formattedNumber}&text=${defaultMessage}`;

        try {
          if (isMobile) {
            window.location = iosWhatsappUrl;
          } else {
            window.open(whatsappUrl, '_blank');
          }
        } catch (e) {
          const linkElement = document.createElement('a');
          linkElement.setAttribute('href', whatsappUrl);
          linkElement.setAttribute('target', '_blank');
          linkElement.setAttribute('rel', 'noopener noreferrer');
          linkElement.click();
        }
      } else {
        showToast("Bu çilingirin WhatsApp numarası bulunamadı", "error", 3000);
      }
    } catch (error) {
      console.error('WhatsApp mesaj gönderme hatası:', error);
      showToast("WhatsApp mesajı gönderilirken bir hata oluştu", "error", 3000);
    }
  };

  // Değerlendirme gönderildiğinde
  const handleRatingSubmit = async ({ rating, comment }) => {
    try {
      // Değerlendirmeyi apiye gönder
      const response = await fetch('/api/public/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locksmithId: locksmith.id,
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
            locksmithId: locksmith.id,
            reviewId: result.reviewId,
            details: `${locksmith.businessname || locksmith.fullname} için ${rating} yıldız değerlendirme`
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

      // Başarılı mesajı göster
      showToast("Değerlendirmeniz için teşekkürler.", "success");

    } catch (error) {
      console.error("Değerlendirme gönderme hatası:", error);
      showToast("Değerlendirme gönderilirken bir hata oluştu. Lütfen tekrar deneyin.", "error");
    }
  };

  // Hata durumunda
  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Bir hata oluştu</h1>
        <p className="mb-4">{error}</p>
        <Link href="/?focusList=true" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Yükleme durumunda
  if (loading) {
    return <LoadingSpinner />;
  }

  // Çilingir bulunamadıysa
  if (!locksmith) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Çilingir Bulunamadı</h1>
        <p className="mb-4">Aradığınız çilingir bulunamadı veya artık aktif değil.</p>
        <Link href="/?focusList=true" className="text-blue-600 hover:text-blue-800">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  const CallButtons = ({ customClass }) => {
    return (
      <div className={`flex gap-2 ${customClass}`}>
        {/* Telefon */}
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 mb-3 flex items-center justify-center gap-2 animate-pulse shadow-md"
          onClick={handleCallLocksmith}>
          Hemen Ara
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </Button>
        {/* Whatsapp */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 flex items-center justify-center gap-2"
          onClick={handleWhatsappMessage}>
          WhatsApp
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </Button>
      </div>
    )
  }

  const WorkingHours = ({ customClass }) => {
    return (
      <>
        {locksmith.locksmith_working_hours && locksmith.locksmith_working_hours.length > 0 && (
          <div className={`bg-gray-50 rounded-lg p-6 mb-6 ${customClass}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Çalışma Saatleri</h3>
            <div className="space-y-2">
              {locksmith.locksmith_working_hours
                .sort((a, b) => a.dayofweek - b.dayofweek)
                .map((hours) => {
                  // Zamanı saat:dakika formatına dönüştür
                  let openTime = hours.opentime ? hours.opentime.substring(0, 5) : "";
                  let closeTime = hours.closetime ? hours.closetime.substring(0, 5) : "";

                  return (
                    <div key={hours.dayofweek} className="flex justify-between items-center">
                      <span className="text-gray-600">{hours.dayofweek == 0 ? "Pazartesi" : hours.dayofweek == 1 ? "Salı" : hours.dayofweek == 2 ? "Çarşamba" : hours.dayofweek == 3 ? "Perşembe" : hours.dayofweek == 4 ? "Cuma" : hours.dayofweek == 5 ? "Cumartesi" : "Pazar"}</span>
                      {hours.is24hopen ? (
                        <span className="text-green-600">24 Saat Açık</span>
                      ) : (
                        <span className={`text-sm font-medium ${hours.isworking ? 'text-green-600' : 'text-red-500'}`}>
                          {hours.isworking ? `${openTime} - ${closeTime}` : 'Kapalı'}
                        </span>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </>
    )
  }

  const ImagesGallery = ({ customClass }) => {
    return (
      <>
        {locksmith.locksmith_images && locksmith.locksmith_images.length > 0 && (
          <div className={`bg-gray-50 rounded-lg p-6 mb-6 ${customClass}`}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Galeri</h3>
            <ImageGallery
              images={locksmith.locksmith_images.filter(img => img.image_url)}
              locksmithName={locksmith.businessname || locksmith.fullname}
            />
          </div>
        )}
      </>
    )
  }

  const Map = ({ customClass }) => {
    return (
      <>
        <div className={`bg-gray-50 rounded-lg p-6 mb-6 ${customClass}`}>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Adres</h3>
          <p className="text-gray-700 mb-4">{locksmith.address || `${locksmith.province} ${locksmith.district} bölgesinde hizmet vermektedir.`}</p>
          <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center text-gray-500">
            Harita Görünümü
          </div>
        </div>
      </>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Geri Butonu */}
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/?focusList=true"
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          prefetch={true}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>{hasSearched ? "Aramaya Dön" : "Ana Sayfaya Dön"}</span>
        </Link>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sol Bölüm - Çilingir Detayları */}
            <div className="w-full lg:w-2/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="mb-6">
                <div style={styles.companyLogo} className="mb-3">
                  {locksmith.locksmith_images && locksmith.locksmith_images.find(image => image.is_profile)?.image_url ? (
                    <img
                      src={locksmith.locksmith_images.find(image => image.is_profile)?.image_url}
                      alt="İşletme Profil Resmi"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{locksmith.businessname?.substring(0, 2) || "ÇL"}</span>
                  )}
                </div>
                <div className="text-gray-500 mb-1">{locksmith.province}, {locksmith.district}</div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{locksmith.businessname || locksmith.fullname}</h1>

                <div className="flex items-center mb-4">
                  <StarRating rating={locksmith.avgrating || 0} />
                  <span className="ml-2 text-gray-500">({locksmith.totalreviewcount || 0} yorum)</span>
                </div>

                <div className="flex items-center mb-4">
                  <p className="text-gray-600 mb-4">
                    {locksmith.tagline || "Bu çilingir henüz açıklama eklememiş."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {locksmith.services?.map((service, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded hover:bg-blue-200 cursor-pointer">{service.name}</span>
                  ))}
                </div>
              </div>

              <CallButtons customClass="block md:hidden flex-row" />

              <ImagesGallery customClass="block md:hidden" />

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hakkında</h2>
                {locksmith.abouttext ? (
                  <div
                    className="text-gray-600 mb-4 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: locksmith.abouttext }}
                  />
                ) : (
                  <p className="text-gray-600 mb-4">Bu çilingir henüz açıklama eklememiş.</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Hizmetler</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {locksmith.services?.map((service, index) => (
                    <li key={index}>{service.name}</li>
                  ))}
                </ul>
              </div>

              {locksmith.certificates && (
                <div className="pt-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Sertifikalar ve Belgeler</h2>
                  <ul className="list-disc pl-5 text-gray-600 space-y-2">
                    {locksmith.certificates.map((certificate, index) => (
                      <li key={index}>{typeof certificate === 'object' ? certificate.name : certificate}</li>
                    ))}
                  </ul>
                </div>
              )}

              <CallButtons customClass="block md:hidden flex-row" />

              <WorkingHours customClass="block md:hidden" />

              {locksmith.reviews && locksmith.reviews.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Müşteri Yorumları</h2>

                  {/* Yıldız Filtreleme Butonları */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        className={`flex items-center space-x-1 border hover:bg-blue-50 hover:border-blue-200 rounded-lg px-3 py-1.5 transition-colors ${selectedRating === star ? 'bg-blue-50 border-blue-200' : ' bg-white border-gray-200'}`}
                      >
                        <span className="font-medium">{star}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </button>
                    ))}
                    <button
                      onClick={showAllReviews}
                      className={`text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 ${selectedRating == null ? 'font-bold underline' : ''}`}
                    >
                      Tümü
                    </button>
                  </div>

                  <div className="space-y-4">
                    {filteredReviews.length > 0 ? (
                      <>
                        {/* Sayfalandırılmış yorumları göster */}
                        {filteredReviews.slice(0, visibleReviews).map((review, index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-semibold">{review.username || "Müşteri"}</span>
                              <div className="flex items-center">
                                <StarRating rating={review.rating || 5} />
                                <span className="ml-2 text-gray-500 text-sm">{new Date(review.createdat).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <p className="text-gray-600">{review.comment || "Yorum yok"}</p>
                          </div>
                        ))}

                        {/* Daha fazla yorum var mı? */}
                        {visibleReviews < filteredReviews.length && (
                          <div className="text-center mt-4">
                            <button
                              onClick={loadMoreReviews}
                              className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              Daha Fazla Yorum Yükle ({filteredReviews.length - visibleReviews} yorum daha)
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        Bu filtreye uygun yorum bulunamadı
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sadece sosyal medya hesaplarından en az biri varsa başlığı göster */}
              {(locksmith.websiteurl || locksmith.facebook_url || locksmith.instagram_url || locksmith.tiktok_url || locksmith.youtube_url) && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center mb-4">
                    <span className="font-semibold text-gray-700 mr-3">Sosyal Hesaplar:</span>
                    <div className="flex space-x-2">
                      {/* Facebook */}
                      {locksmith.facebook_url && (
                        <a href={locksmith.facebook_url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                          </svg>
                        </a>
                      )}

                      {/* Instagram */}
                      {locksmith.instagram_url && (
                        <a href={locksmith.instagram_url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 via-pink-600 to-orange-500 flex items-center justify-center text-white hover:opacity-90 transition">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                          </svg>
                        </a>
                      )}

                      {/* TikTok */}
                      {locksmith.tiktok_url && (
                        <a href={locksmith.tiktok_url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white hover:bg-gray-800 transition">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                          </svg>
                        </a>
                      )}

                      {/* YouTube */}
                      {locksmith.youtube_url && (
                        <a href={locksmith.youtube_url} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </a>
                      )}

                      {/* Website */}
                      {locksmith.websiteurl && (
                        <a href={locksmith.websiteurl} target="_blank" rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white hover:bg-gray-700 transition">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-.899.156-1.762.431-2.569L6 11l2 2v2l2 2 1 1v1.931C7.061 19.436 4 16.072 4 12zm14.33 4.873C17.677 16.347 16.687 16 16 16v-1a2 2 0 0 0-2-2h-4v-3a2 2 0 0 0 2-2V7h1a2 2 0 0 0 2-2v-.411C17.928 5.778 20 8.65 20 12c0 1.76-.58 3.37-1.67 4.873z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Benzer Çilingirler */}
              {locksmith.similarLocksmiths && locksmith.similarLocksmiths.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Benzer Çilingirler</h2>
                  <div className="space-y-4">
                    {locksmith.similarLocksmiths.map((item) => (
                      <div key={item.id} style={styles.jobCard} className="hover:transform hover:translate-y-[-2px] hover:shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center">
                          <div className="mb-4 md:mb-0 md:mr-4">
                            <div style={styles.smallCompanyLogo}>
                              <span>{item.name.substring(0, 2)}</span>
                            </div>
                          </div>

                          <div className="flex-grow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                                <p className="text-gray-600 mb-2">{item.province}, {item.district}</p>
                              </div>
                              <div className="flex items-center">
                                <StarRating rating={item.rating} />
                                <span className="ml-2 text-gray-500">({item.reviewCount})</span>
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                              {item.description}
                            </p>
                          </div>

                          <div className="mt-4 md:mt-0 md:ml-4">
                            <Link href={`/${item.slug}`} className="text-blue-600 hover:text-blue-800 flex items-center">
                              Detaylar
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sağ Bölüm - İletişim ve Özet */}
            <div className="w-full lg:w-1/3 p-6 lg:p-8">
              {/* Arama ve Whatsapp Butonları */}
              <CallButtons customClass="flex-col hidden md:block" />

              {/* Çalışma Saatleri */}
              <WorkingHours customClass="hidden md:block" />

              {/* Resim Galerisi */}
              <ImagesGallery customClass="hidden md:block" />

              {/* Harita */}
              <Map customClass="hidden md:block" />

              {/* Acil Durum Butonu */}
              <div className="bg-yellow-100 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Acil Durum mu?</h3>
                <p className="text-gray-700 mb-4">Kapınız kilitli kaldıysa veya acil çilingir hizmetine ihtiyacınız varsa hemen arayın!</p>
                <EmergencyCallButton />
              </div>
            </div>
          </div>
        </div>
      </div>

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