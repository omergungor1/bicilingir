"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/ui/button";
import { EmergencyCallButton } from "../../../components/emergency-button";
import { ImageGallery } from "../../../components/image-gallery";
import { RatingModal } from "../../../components/RatingModal";
import { useToast } from "../../../components/ToastContext";
import Map from "../../../components/Map";
import { getUserId, getSessionId } from "../../../lib/utils";

// Yıldız puanı gösterme komponenti
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">
                    {i < Math.floor(rating) ? "★" : (i < rating ? "★" : "☆")}
                </span>
            ))}
            <span className="ml-1 text-gray-700">{rating}</span>
        </div>
    );
};

export default function LocksmithDetail({ locksmith: initialData, similarLocksmiths }) {
    const dispatch = useDispatch();
    const { hasSearched } = useSelector(state => state.search);
    const { showToast } = useToast();
    const searchParams = useSearchParams();

    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedLocksmith, setSelectedLocksmith] = useState(null);

    // Hemen Ara butonuna tıklandığında
    const handleCallLocksmith = () => {
        setSelectedLocksmith(initialData);

        // Çilingir arama aktivitesini kaydet
        try {
            fetch('/api/public/user/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activitytype: 'call_request',
                    level: 1,
                    data: JSON.stringify({
                        locksmithId: initialData.id,
                        details: `${initialData.businessname || initialData.fullname}`
                    }),
                    userId: getUserId(),
                    sessionId: getSessionId(),
                    userAgent: navigator.userAgent || ''
                }),
            });

            // Belirli bir süre sonra değerlendirme modalını göster
            setTimeout(() => {
                setShowRatingModal(true);
            }, 1500);
        } catch (error) {
            console.error('Telefon araması hatası:', error);
            showToast("Telefon araması yapılırken bir hata oluştu", "error");
        }
    };

    const handleWhatsappMessage = () => {
        try {
            // Aktivite kaydı
            fetch('/api/public/user/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activitytype: 'whatsapp_message',
                    level: 1,
                    data: JSON.stringify({
                        locksmithId: initialData.id,
                        details: `${initialData.businessname || initialData.fullname}`
                    }),
                    userId: getUserId(),
                    sessionId: getSessionId(),
                    userAgent: navigator.userAgent || ''
                }),
            });

            // WhatsApp yönlendirmesi
            if (initialData.whatsappnumber) {
                let formattedNumber = initialData.whatsappnumber.replace(/\s+/g, '');
                if (formattedNumber.startsWith('+')) {
                    formattedNumber = formattedNumber.substring(1);
                }
                if (!formattedNumber.startsWith('90') && !formattedNumber.startsWith('0')) {
                    formattedNumber = '90' + formattedNumber;
                } else if (formattedNumber.startsWith('0')) {
                    formattedNumber = '90' + formattedNumber.substring(1);
                }

                const defaultMessage = encodeURIComponent("Merhaba, Bi Çilingir uygulamasından ulaşıyorum. Çilingir hizmetine ihtiyacım var.");
                const whatsappUrl = `https://wa.me/${formattedNumber}?text=${defaultMessage}`;
                window.open(whatsappUrl, '_blank');
            } else {
                showToast("Bu çilingirin WhatsApp numarası bulunamadı", "error");
            }
        } catch (error) {
            console.error('WhatsApp mesaj hatası:', error);
            showToast("WhatsApp mesajı gönderilirken bir hata oluştu", "error");
        }
    };

    // Değerlendirme gönderildiğinde
    const handleRatingSubmit = async ({ rating, comment }) => {
        try {
            const response = await fetch('/api/public/reviews/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    locksmithId: initialData.id,
                    rating,
                    comment: comment || "",
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Değerlendirme gönderilirken bir hata oluştu");
            }

            setShowRatingModal(false);
            showToast("Değerlendirmeniz için teşekkürler.", "success");

        } catch (error) {
            console.error("Değerlendirme gönderme hatası:", error);
            showToast("Değerlendirme gönderilirken bir hata oluştu. Lütfen tekrar deneyin.", "error");
        }
    };

    // Kullanıcının geri dönmesi gereken URL'yi belirle
    const getBackUrl = () => {
        if (searchParams?.get('referrer')) {
            return decodeURIComponent(searchParams.get('referrer'));
        }
        return hasSearched ? "/?focusList=true" : "/";
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Geri Butonu */}
            <div className="container mx-auto px-4 py-4">
                <Link
                    href={getBackUrl()}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Geri Dön</span>
                </Link>
            </div>

            {/* Ana İçerik */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Sol Bölüm - Çilingir Detayları */}
                        <div className="w-full lg:w-2/3 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-200">
                            <div className="mb-6">
                                <div className="relative w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4">
                                    {initialData.locksmith_images?.find(img => img.is_profile)?.image_url ? (
                                        <Image
                                            src={initialData.locksmith_images.find(img => img.is_profile).image_url}
                                            alt={`${initialData.businessname || initialData.fullname} Profil Resmi`}
                                            fill
                                            sizes="64px"
                                            className="object-cover rounded-lg"
                                            priority
                                        />
                                    ) : (
                                        <span className="text-2xl">{initialData.businessname?.substring(0, 2) || "ÇL"}</span>
                                    )}
                                </div>

                                <div className="text-gray-500 mb-1">{initialData.provinces.name}, {initialData.districts.name}</div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {initialData.businessname || initialData.fullname}
                                </h1>

                                <div className="flex items-center mb-4">
                                    <StarRating rating={initialData.avgrating || 0} />
                                    <span className="ml-2 text-gray-600">
                                        ({initialData.totalreviewcount || 0} değerlendirme)
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-4">{initialData.tagline}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {initialData.services?.map((service) => (
                                        <span
                                            key={service.id}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                        >
                                            {service.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* İletişim Butonları (Mobil) */}
                            <div className="flex flex-col gap-2 lg:hidden mb-6">
                                <a
                                    href={`tel:${initialData.phonenumber.replace(/\D/g, '')}`}
                                    className="w-full flex items-center justify-center py-2 px-2 bg-blue-600 text-white font-bold text-lg rounded-md shadow-md gap-2"
                                    onClick={() => handleCallLocksmith()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {initialData.phonenumber}
                                </a>

                                <Button
                                    onClick={handleWhatsappMessage}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white opacity-85"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    WhatsApp
                                </Button>
                            </div>

                            {/* Hakkında */}
                            {initialData.locksmith_details.abouttext && (
                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Hakkında</h2>
                                    <div
                                        className="prose prose-blue max-w-none"
                                        dangerouslySetInnerHTML={{ __html: initialData.locksmith_details.abouttext }}
                                    />
                                </div>
                            )}

                            {/* Hizmetler */}
                            {initialData.services && initialData.services.length > 0 && (
                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Verilen Hizmetler</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {initialData.services.map((service) => (
                                            <div key={service.id} className="bg-gray-50 p-4 rounded-lg">
                                                <h3 className="font-semibold text-gray-800">{service.name}</h3>
                                                {service.description && (
                                                    <p className="text-gray-600 mt-1 text-sm">{service.description}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Resim Galerisi */}
                            {initialData.locksmith_images && initialData.locksmith_images.length > 0 && (
                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Galeri</h2>
                                    <ImageGallery
                                        images={initialData.locksmith_images.filter(img => !img.is_profile)}
                                        locksmithName={initialData.businessname || initialData.fullname}
                                    />
                                </div>
                            )}

                            {/* Sertifikalar */}
                            {initialData.locksmith_certificates && initialData.locksmith_certificates.length > 0 && (
                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Sertifikalar ve Belgeler</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {initialData.locksmith_certificates.map((certificate) => (
                                            <div key={certificate.id} onClick={() => window.open(certificate.fileurl, '_blank')} className="bg-gray-50 p-4 rounded-lg flex items-center cursor-pointer">
                                                <div className="relative w-8 h-8 mr-4">
                                                    <Image
                                                        src="/images/certificate-icon.png"
                                                        alt="Sertifika İkonu"
                                                        fill
                                                        sizes="32px"
                                                        className="text-blue-600"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{certificate.name}</h3>
                                                    {certificate.description && (
                                                        <p className="text-gray-600 text-sm mt-1">{certificate.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Yorumlar */}
                            {initialData.reviews && initialData.reviews.length > 0 && (
                                <div className="border-t border-gray-200 pt-6 mb-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Müşteri Yorumları</h2>
                                    <div className="space-y-4">
                                        {initialData.reviews.slice(0, 5).map((review) => (
                                            <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{review.username || "Müşteri"}</p>
                                                        <StarRating rating={review.rating} />
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(review.createdat).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Benzer Çilingirler */}
                            {similarLocksmiths && similarLocksmiths.length > 0 && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h2 className="text-xl font-bold text-gray-800 mb-4">Benzer Çilingirler</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {similarLocksmiths.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/cilingirler/${item.slug}`}
                                                className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <div className="relative w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mr-4">
                                                        {item.locksmith_images?.find(img => img.is_profile)?.image_url ? (
                                                            <Image
                                                                src={item.locksmith_images.find(img => img.is_profile).image_url}
                                                                alt={`${item.businessname || item.fullname} Profil Resmi`}
                                                                fill
                                                                sizes="48px"
                                                                className="object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <span className="text-lg">{item.businessname?.substring(0, 2) || "ÇL"}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{item.businessname || item.fullname}</h3>
                                                        <p className="text-gray-600 text-sm">{item.provinces.name}, {item.districts.name}</p>
                                                        <div className="flex items-center mt-1">
                                                            <span className="text-yellow-400">★</span>
                                                            <span className="ml-1 text-gray-700">{item.avgrating || 0}</span>
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                ({item.totalreviewcount || 0} değerlendirme)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sağ Bölüm */}
                        <div className="w-full lg:w-1/3 p-6 lg:p-8">
                            {/* İletişim Butonları (Desktop) */}
                            <div className="hidden lg:flex lg:flex-col gap-2 mb-6">
                                <a
                                    href={`tel:${initialData.phonenumber.replace(/\D/g, '')}`}
                                    className="w-full flex items-center justify-center py-2 px-2 bg-blue-600 text-white font-bold text-lg rounded-md shadow-md gap-2"
                                    onClick={() => handleCallLocksmith()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {initialData.phonenumber}
                                </a>

                                <Button
                                    onClick={handleWhatsappMessage}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white opacity-85"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                    </svg>
                                    WhatsApp
                                </Button>
                            </div>

                            {/* Çalışma Saatleri */}
                            {initialData.locksmith_working_hours && initialData.locksmith_working_hours.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Çalışma Saatleri</h3>
                                    <div className="space-y-2">
                                        {initialData.locksmith_working_hours
                                            .sort((a, b) => a.dayofweek - b.dayofweek)
                                            .map((hours) => (
                                                <div key={hours.dayofweek} className="flex justify-between items-center">
                                                    <span className="text-gray-600">
                                                        {["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"][hours.dayofweek]}
                                                    </span>
                                                    {hours.is24hopen ? (
                                                        <span className="text-green-600">24 Saat Açık</span>
                                                    ) : (
                                                        <span className={`text-sm font-medium ${hours.isworking ? 'text-green-600' : 'text-red-500'}`}>
                                                            {hours.isworking ? `${hours.opentime?.substring(0, 5)} - ${hours.closetime?.substring(0, 5)}` : 'Kapalı'}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Konum ve Harita */}
                            <div className="bg-gray-50 rounded-lg mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 px-4 py-2">Konum</h3>
                                <p className="text-gray-600 mb-4 px-4 py-2">
                                    {initialData.locksmith_details.fulladdress || `${initialData.provinces.name} ${initialData.districts.name} bölgesinde hizmet vermektedir.`}
                                </p>
                                <Map
                                    center={{
                                        lat: initialData.locksmith_details.lat || 40.1885,
                                        lng: initialData.locksmith_details.lng || 29.0610
                                    }}
                                    zoom={15}
                                    markers={[{
                                        position: {
                                            lat: initialData.locksmith_details.lat || 40.1885,
                                            lng: initialData.locksmith_details.lng || 29.0610
                                        },
                                        title: initialData.businessname || initialData.fullname,
                                        description: initialData.locksmith_details.fulladdress
                                    }]}
                                />
                            </div>

                            {/* Daha fazla çilingir arıyorsanız */}
                            <div className="bg-yellow-100 rounded-lg p-6 mb-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Daha fazla çilingir mi arıyorsunuz?</h3>
                                <p className="text-gray-700 mb-4">Daha fazla çilingir lazımsa detaylı çilingir arama motorumuzu kullanın.</p>
                                <EmergencyCallButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Değerlendirme Modalı */}
            <RatingModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                onSubmit={handleRatingSubmit}
                locksmith={selectedLocksmith}
            />
        </div>
    );
} 