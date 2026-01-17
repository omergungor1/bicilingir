"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "..//ui/button";
import { ChevronRight, Info } from "lucide-react";
import { RatingModal } from "../RatingModal";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import { useRouter } from "next/navigation";
import { useToast } from "../ToastContext";
import { getUserId, getSessionId } from '../../lib/utils';
import { MapPin } from "lucide-react";

export default function LocksmithCard({ locksmith, index, showLocation = false }) {
    const { showToast } = useToast();
    const [loadingLocksmithIds, setLoadingLocksmithIds] = useState({});
    const [searchValues, setSearchValues] = useState(null);
    // useRef'i buraya taşıyoruz - component'in en üst seviyesine
    const isLogged = useRef(false);

    // Mevcut mesai dilimini belirle
    const [currentTimeFrame, setCurrentTimeFrame] = useState(() => {
        const now = new Date();
        const hours = now.getHours();

        if (hours >= 9 && hours < 17) {
            return { type: 'normal', label: 'Normal Mesai (09:00-17:00)', priceKey: 'price1' };
        } else if (hours >= 17 && hours < 24) {
            return { type: 'evening', label: 'Akşam Mesaisi (17:00-00:00)', priceKey: 'price2' };
        } else {
            return { type: 'night', label: 'Gece Mesaisi (00:00-09:00)', priceKey: 'price3' };
        }
    });

    // localStorage'dan arama verilerini getir
    useEffect(() => {
        try {
            const searchValuesStr = localStorage.getItem('searchValues');
            if (searchValuesStr) {
                const parsedValues = JSON.parse(searchValuesStr);
                setSearchValues(parsedValues);
            }
        } catch (error) {
            console.error('Arama değerleri yüklenemedi:', error);
        }
    }, []);

    // Çilingir kartı göründüğünde aktivite logunu kaydet
    //artık loglama yapılıyor
    useEffect(() => {
        const logLocksmithView = () => {
            // Eğer bu kart daha önce loglandıysa, tekrar loglama
            if (isLogged.current) return;

            try {
                const logData = {
                    activitytype: 'locksmith_list_view',
                    level: 1,
                    data: JSON.stringify({
                        locksmithId: locksmith.id,
                        locksmithName: locksmith.name,
                        locksmithIndex: index,
                        searchProvinceId: searchValues?.provinceId || null,
                        searchDistrictId: searchValues?.districtId || null,
                        searchServiceId: searchValues?.serviceId || null
                    }),
                    userId: getUserId(),
                    sessionId: getSessionId(),
                    userAgent: navigator.userAgent || ''
                };

                // Loglama işlemi yapıldıktan sonra ref'i true yap
                isLogged.current = true;

                if (navigator.sendBeacon) {
                    const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' });
                    navigator.sendBeacon('/api/public/user/activity', blob);
                } else {
                    fetch('/api/public/user/activity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(logData),
                        keepalive: true
                    }).catch(error => {
                        console.error('Liste görüntüleme log hatası:', error);
                    });
                }
            } catch (error) {
                console.error('Liste görüntüleme log hatası:', error);
            }
        };

        if (locksmith && locksmith.id) {
            if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                window.requestIdleCallback(() => logLocksmithView(), { timeout: 2000 });
            } else {
                setTimeout(logLocksmithView, 500);
            }
        }

        // Cleanup fonksiyonu
        return () => {
            isLogged.current = false;
        };
    }, [locksmith.id, searchValues]);

    const RatingStars = ({ rating }) => {
        return (
            <div className="flex items-center">
                <span className="text-[#FFD700] mr-1">
                    ★
                </span>
                <span className="text-gray-700">{rating}</span>
            </div>
        );
    };

    const router = useRouter();
    const handleViewDetails = async (id, slug) => {
        // Sadece ilgili çilingir için yükleniyor durumunu güncelle
        const updatedLoadingStates = { ...loadingLocksmithIds };
        updatedLoadingStates[id] = true;
        setLoadingLocksmithIds(updatedLoadingStates);

        // Mevcut URL'yi al ve referrer olarak ekle
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const referrer = encodeURIComponent(currentUrl);

        // Çilingir detay sayfasına yönlendir
        const formattedSlug = `/${slug}?fromDetail=true&referrer=${referrer}`;

        // Loglamayı arka planda yapacağız, sayfaya yönlendirmeyi geciktirmemek için
        try {
            const logData = {
                activitytype: 'locksmith_detail_view',
                level: 1,
                data: JSON.stringify({
                    locksmithId: id,
                    searchProvinceId: searchValues?.provinceId || null,
                    searchDistrictId: searchValues?.districtId || null,
                    searchServiceId: searchValues?.serviceId || null
                }),
                userId: getUserId(),
                sessionId: getSessionId(),
                userAgent: navigator.userAgent || ''
            };

            // SendBeacon API ile arka planda loglama
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' });
                navigator.sendBeacon('/api/public/user/activity', blob);
            } else {
                // Fallback olarak fetch kullan
                // Kullanıcı deneyimini geciktirmemek için loglama işlemini arka planda yap
                setTimeout(() => {
                    fetch('/api/public/user/activity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(logData),
                        keepalive: true
                    }).catch(error => {
                        console.error('Aktivite log hatası:', error);
                    });
                }, 10);
            }
        } catch (error) {
            console.error('Aktivite log hatası:', error);
        }

        // Detay sayfasına yönlendir, scroll davranışını engellemek için scroll=false
        router.push(formattedSlug, undefined, { scroll: false });
    };

    const handleCallLocksmith = (locksmith, index) => {
        try {
            const logData = {
                activitytype: 'call_request',
                level: 1,
                data: JSON.stringify({
                    locksmithId: locksmith.id,
                    locksmithName: locksmith.name,
                    locksmithPhone: locksmith.phone,
                    searchProvinceId: searchValues?.provinceId || null,
                    searchDistrictId: searchValues?.districtId || null,
                    searchServiceId: searchValues?.serviceId || null
                }),
                userId: getUserId(),
                sessionId: getSessionId(),
                userAgent: navigator.userAgent || ''
            };

            // SendBeacon API ile loglama
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' });
                navigator.sendBeacon('/api/public/user/activity', blob);
            } else {
                // Fallback olarak fetch kullan
                fetch('/api/public/user/activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logData),
                    keepalive: true
                }).catch(error => {
                    console.error('Arama aktivitesi log hatası:', error);
                });
            }

            //muhtemelen buna gerek yok. 19 mayıs ekledim. Sonra kaldırılacak.
            if (window.gtag) {
                window.gtag('event', 'call_click', {
                    event_category: 'engagement',
                    event_label: locksmith.businessname || locksmith.fullname,
                    value: 1
                });
            }

        } catch (error) {
            console.error('Aktivite log hatası:', error);
        }
    };

    const handleWhatsappMessage = (locksmith, index) => {
        // WhatsApp link açma işlemini ilk önce yap
        try {
            // WhatsApp numarasını formatlama ve yönlendirme
            if (locksmith.whatsapp) {
                let formattedNumber = locksmith.whatsapp.replace(/\s+/g, '');
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
                return; // Numara yoksa loglama yapma
            }
        } catch (error) {
            console.error('WhatsApp mesaj gönderme hatası:', error);
            showToast("WhatsApp mesajı gönderilirken bir hata oluştu", "error", 3000);
            return; // Hata durumunda loglama yapma
        }

        // WhatsApp'a yönlendirdikten sonra arka planda loglama yap
        try {
            const logData = {
                activitytype: 'whatsapp_message',
                level: 1,
                data: JSON.stringify({
                    locksmithId: locksmith.id,
                    details: `${locksmith.businessname || locksmith.fullname}`
                }),
                userId: getUserId(),
                sessionId: getSessionId(),
                userAgent: navigator.userAgent || ''
            };

            // SendBeacon API ile loglama
            if (navigator.sendBeacon) {
                const blob = new Blob([JSON.stringify(logData)], { type: 'application/json' });
                navigator.sendBeacon('/api/public/user/activity', blob);
            } else {
                // Fallback olarak fetch kullan
                fetch('/api/public/user/activity', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logData),
                    keepalive: true
                }).catch(error => {
                    console.error('Aktivite log hatası:', error);
                });
            }

            if (window.gtag) {
                window.gtag('event', 'whatsapp_click', {
                    event_category: 'engagement',
                    event_label: locksmith.businessname || locksmith.fullname,
                    value: 1
                });
            }
        } catch (error) {
            console.error('Aktivite log hatası:', error);
        }
    };


    // Bugünün gününü bul (0=Pazar, 6=Cumartesi)
    const today = new Date().getDay();
    const todayWorkingHours = locksmith.workingHours?.find(hours => hours.dayofweek === today) || null;

    // Şu anki saate göre çilingirin açık olup olmadığını kontrol et
    const isCurrentlyOpen = () => {
        if (!todayWorkingHours) return false;

        // 24 saat açıksa her zaman açık
        if (todayWorkingHours.is24hopen) {
            return true;
        }

        // Çalışmıyorsa kapalı
        if (!todayWorkingHours.isworking) {
            return false;
        }

        // Açılış ve kapanış saatleri varsa kontrol et
        if (todayWorkingHours.opentime && todayWorkingHours.closetime) {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTime = currentHour * 60 + currentMinute; // Dakika cinsinden

            // Saat formatını parse et (HH:MM:SS veya HH:MM)
            const openTimeParts = todayWorkingHours.opentime.split(':');
            const closeTimeParts = todayWorkingHours.closetime.split(':');

            const openHour = parseInt(openTimeParts[0]);
            const openMinute = parseInt(openTimeParts[1]);
            const openTime = openHour * 60 + openMinute;

            const closeHour = parseInt(closeTimeParts[0]);
            const closeMinute = parseInt(closeTimeParts[1]);
            const closeTime = closeHour * 60 + closeMinute;

            // Eğer kapanış saati açılış saatinden küçükse (gece yarısını geçiyorsa)
            if (closeTime < openTime) {
                // Gece yarısını geçen durum: açılıştan gece yarısına kadar veya gece yarısından kapanışa kadar
                return currentTime >= openTime || currentTime < closeTime;
            } else {
                // Normal durum: açılış ve kapanış arasında
                return currentTime >= openTime && currentTime < closeTime;
            }
        }

        return false;
    };

    // Çalışma saatlerini formatla
    const getWorkingHoursText = () => {
        if (!todayWorkingHours) return null;

        if (todayWorkingHours.is24hopen) {
            return '24 Saat Açık';
        }

        if (!todayWorkingHours.isworking) {
            return 'Kapalı';
        }

        if (todayWorkingHours.opentime && todayWorkingHours.closetime) {
            const openTime = todayWorkingHours.opentime.substring(0, 5); // HH:MM formatına çevir
            const closeTime = todayWorkingHours.closetime.substring(0, 5);
            return `${openTime} - ${closeTime}`;
        }

        return null;
    };

    const workingHoursText = getWorkingHoursText();
    const currentlyOpen = isCurrentlyOpen();

    return (
        <div key={locksmith.id} className={`border shadow-lg transition rounded-lg overflow-hidden ${locksmith.is_verified ? 'border-2 border-blue-500 border-solid' : 'border border-gray-200'} pt-2 relative`}>
            <div className="flex flex-col md:flex-row">
                <div className={`px-4 pt-2 flex-1`}>
                    <div className="flex items-start mb-2">
                        <div
                            className={`
                                w-[50px] h-[50px] rounded-[8px] flex items-center justify-center font-bold
                                mr-4 flex-shrink-0 bg-[#4169E1] text-white
                            `}
                        >
                            <span>{locksmith.name.substring(0, 2)}</span>
                        </div>
                        <div>
                            <div className="flex flex-col gap-1">
                                <div className="flex flex-row items-center gap-2">
                                    <h2 className={`text-xl font-bold text-blue-800`}>{locksmith.name}</h2>
                                    <RatingStars rating={locksmith?.rating?.toFixed(1)} />
                                </div>
                                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2">
                                    <div className="flex flex-row gap-2 flex-wrap">
                                        {locksmith.is_verified && (
                                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Onaylı Çilingir
                                            </span>
                                        )}
                                        {currentlyOpen && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                                                Açık
                                            </span>
                                        )}
                                        {!currentlyOpen && todayWorkingHours && (
                                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                Kapalı
                                            </span>
                                        )}
                                        {workingHoursText && (
                                            <span className="bg-gray-100 text-gray-700 border border-gray-500 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                                {workingHoursText}
                                            </span>
                                        )}
                                        {showLocation && (
                                            <span className="text-gray-500 text-sm px-2 rounded-full flex items-center w-fit">
                                                {locksmith.districts.name}, {locksmith.provinces.name}
                                            </span>
                                        )}
                                        {(locksmith.city || locksmith.provinces?.name) && (locksmith.district || locksmith.districts?.name) && (
                                            <span className="text-orange-600 border border-orange-200 text-xs px-2 py-1 rounded-full flex items-center w-fit bg-orange-50">
                                                <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 md:mr-1.5 flex-shrink-0 text-orange-500" />
                                                {locksmith.district || locksmith.districts?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-700 hidden md:block mb-4">{locksmith?.description}</p>
                </div>

                {/* Call Buttons */}
                <div className="px-4 pb-2 flex flex-col justify-center md:w-64">
                    <div className="space-y-2">
                        <a
                            href={`tel:${locksmith.phone.replace(/\D/g, '')}`}
                            className="w-full flex items-center justify-center py-2 px-4 bg-[#4169E1] hover:bg-[#3658c7] text-white font-bold text-lg rounded-md shadow-md transition-colors gap-2"
                            onClick={() => handleCallLocksmith(locksmith, index)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {locksmith.phone}
                        </a>
                        {/* WhatsApp, Profil ve Fiyat Butonları - Mobilde Yan Yana, Web'de Alt Alta */}
                        <div className="flex gap-2 md:flex-col">
                            <Button
                                variant="outline"
                                className="flex-1 text-white flex items-center justify-center gap-1 bg-green-700 hover:bg-green-800 font-bold shadow-md"
                                onClick={() => handleWhatsappMessage(locksmith, index)}
                                aria-label={`${locksmith.name} ile WhatsApp üzerinden iletişime geç`}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                WhatsApp
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                disabled={loadingLocksmithIds[locksmith.id]}
                                onClick={() => handleViewDetails(locksmith.id, locksmith.slug)}
                            >
                                {loadingLocksmithIds[locksmith.id] ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span className="block md:hidden">Profil</span>
                                        <span className="hidden md:block">Çilingir Profili</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                            {/* Fiyat Butonu */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Fiyat
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-3 text-sm text-gray-700 max-h-[500px] overflow-y-auto">
                                    <div>
                                        {/* Aktif mesai bilgisi */}
                                        <div className={`flex items-center gap-2 mb-3 text-sm ${currentTimeFrame.type === 'normal' ? 'text-green-700' :
                                            currentTimeFrame.type === 'evening' ? 'text-yellow-700' : 'text-red-700'
                                            }`}>
                                            <span className={`w-2 h-2 rounded-full ${currentTimeFrame.type === 'normal' ? 'bg-green-500' :
                                                currentTimeFrame.type === 'evening' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}></span>
                                            {currentTimeFrame.label}
                                        </div>

                                        {/* Servis fiyatları tablosu */}
                                        <div className="space-y-2">
                                            {locksmith?.serviceList?.map((service, idx) => {
                                                // Mevcut mesai saatine göre fiyatı belirle
                                                let price;
                                                if (currentTimeFrame.type === 'normal') {
                                                    price = service.price1;
                                                } else if (currentTimeFrame.type === 'evening') {
                                                    price = service.price2 || service.price1;
                                                } else { // night
                                                    price = service.price3 || service.price2 || service.price1;
                                                }

                                                return (
                                                    <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                                        <span className="text-gray-700">{service.name}</span>
                                                        <span className={`font-medium ${currentTimeFrame.type === 'normal' ? 'text-green-700' :
                                                            currentTimeFrame.type === 'evening' ? 'text-yellow-700' : 'text-red-700'
                                                            }`}>
                                                            {price.min}-{price.max} ₺
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs text-gray-500 italic">
                                                * Fiyatlar yaklaşıktır ve şu faktörlere göre değişebilir: konum uzaklığı, kilit tipi/markası, yedek parça ihtiyacı ve hizmet saati.
                                            </p>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>


                    </div >
                </div >
            </div >
        </div >
    )
}