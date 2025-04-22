// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu/acil-cilingir

"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../../../components/ui/button";

// Yıldız puanı gösterme bileşeni
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 mr-0.5">
                    {i < Math.floor(rating) ? "★" : (i < rating ? "★" : "☆")}
                </span>
            ))}
            <span className="ml-1 text-gray-700">{rating}</span>
        </div>
    );
};

// Örnek yorumlar
const sampleReviews = [
    {
        id: 1,
        username: "Mehmet Y.",
        rating: 5,
        comment: "Kapım kilitli kaldığında 15 dakika içinde geldi, çok profesyonel hizmet.",
        date: "2023-05-15"
    },
    {
        id: 2,
        username: "Ayşe K.",
        rating: 4.5,
        comment: "Araç anahtarım kaybolmuştu, yeni anahtar yapımı için hızlı ve kaliteli hizmet aldım.",
        date: "2023-06-20"
    },
    {
        id: 3,
        username: "Ahmet D.",
        rating: 5,
        comment: "Uygun fiyat ve güler yüzlü hizmet. Kesinlikle tavsiye ederim.",
        date: "2023-07-08"
    }
];

// Fiyat tablosu için örnek veri
const samplePrices = [
    { id: 1, service: "Kapı Açma", time: "15-30 dk", price: "200₺ - 350₺" },
    { id: 2, service: "Kilit Değiştirme", time: "30-45 dk", price: "300₺ - 500₺" },
    { id: 3, service: "Anahtar Kopyalama", time: "10-20 dk", price: "50₺ - 150₺" },
    { id: 4, service: "Çelik Kapı Tamiri", time: "45-90 dk", price: "400₺ - 800₺" }
];

// Mahalle bilgileri
const neighborhoods = {
    "kuplupinar": {
        name: "Küplüpınar",
        description: "Bursa'nın Osmangazi ilçesine bağlı Küplüpınar mahallesi, merkeze yakın konumu ve gelişmiş altyapısıyla dikkat çekiyor. Bölgede çoğunlukla apartmanlar ve siteler bulunmaktadır.",
        landmarks: ["Küplüpınar Camii", "Küplüpınar Parkı", "Osmangazi Belediyesi Küplüpınar Şubesi"],
        transportation: "Merkeze 10 dakika mesafede bulunan mahalle, 12, 16 ve 35 numaralı otobüs hatlarıyla şehrin her noktasına ulaşım sağlar.",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12129.455419439366!2d29.06061455!3d40.21390765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca3e57b168a8c7%3A0x5d3a23f2486a0fcc!2sK%C3%BCpl%C3%BCp%C4%B1nar%2C%20Osmangazi%2FBursa!5e0!3m2!1str!2str!4v1651321284774!5m2!1str!2str"
    }
};

// Hizmet kategorileri bilgileri
const serviceCategories = {
    "acil-cilingir": {
        title: "Acil Çilingir",
        description: "7/24 hizmet veren acil çilingir ekibimiz, kapınız kilitli kaldığında en hızlı şekilde yanınızda.",
        image: "/images/acil-cilingir.jpg",
        keywords: ["acil çilingir", "24 saat çilingir", "kapı açma", "kilit açma"],
        metaDescription: "Bursa Osmangazi Küplüpınar'da 7/24 acil çilingir hizmeti. Kapı açma, kilit değiştirme ve tüm anahtar işleriniz için hızlı ve güvenilir çözüm."
    },
    "oto-cilingir": {
        title: "Oto Çilingir",
        description: "Araç anahtar ve kilit sorunlarınıza profesyonel çözümler sunan oto çilingir hizmetimiz.",
        image: "/images/oto-cilingir.jpg",
        keywords: ["oto çilingir", "araba anahtarı", "immobilizer", "oto anahtar kopyalama"],
        metaDescription: "Bursa Osmangazi Küplüpınar'da profesyonel oto çilingir hizmeti. Araç anahtar kopyalama, immobilizer ve kilit sorunları için uzman destek."
    },
    "ev-cilingir": {
        title: "Ev Çilingir",
        description: "Ev ve işyerleriniz için özel çilingir hizmetleri, kilit değişimi ve güvenlik danışmanlığı.",
        image: "/images/ev-cilingir.jpg",
        keywords: ["ev çilingir", "konut çilingir", "ev kilit değişimi", "kapı kilidi"],
        metaDescription: "Bursa Osmangazi Küplüpınar'da ev ve konutlar için özel çilingir hizmeti. Kilit değişimi, güvenlik sistemleri ve danışmanlık hizmetleri."
    },
    "kasa-cilingir": {
        title: "Kasa Çilingir",
        description: "Unutulan şifreler veya arızalanan kasa kilitlerinde profesyonel müdahale ve çözüm.",
        image: "/images/kasa-cilingir.jpg",
        keywords: ["kasa çilingir", "kasa açma", "şifre unutma", "çelik kasa"],
        metaDescription: "Bursa Osmangazi Küplüpınar'da kasa açma ve tamir hizmetleri. Unutulan şifreler, arızalanan kilitler için profesyonel müdahale."
    },
    "724-cilingir": {
        title: "7/24 Çilingir",
        description: "Gece gündüz, tatil veya bayram demeden her an ulaşabileceğiniz çilingir hizmeti.",
        image: "/images/724-cilingir.jpg",
        keywords: ["7/24 çilingir", "gece çilingir", "kesintisiz çilingir", "her saat çilingir"],
        metaDescription: "Bursa Osmangazi Küplüpınar'da 7/24 kesintisiz çilingir hizmeti. Gece gündüz, tatil bayram demeden yanınızdayız."
    },
    "cilingir-hizmeti": {
        title: "Çilingir Hizmeti",
        description: "Her türlü anahtar, kilit ve güvenlik sistemi için genel çilingir hizmetleri.",
        image: "/images/cilingir-hizmeti.jpg",
        keywords: ["çilingir hizmeti", "anahtar yapımı", "çilingir ustası", "profesyonel çilingir"],
        metaDescription: "Bursa Osmangazi Küplüpınar'da genel çilingir hizmetleri. Anahtar yapımı, kilit değişimi, kapı açma ve daha fazlası için bizi arayın."
    }
};

// WhatsApp mesajı için fonksiyon
const handleWhatsAppMessage = () => {
    const phoneNumber = "905001234567";
    const defaultMessage = encodeURIComponent("Merhaba, çilingir hizmetiniz hakkında bilgi almak istiyorum.");
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    // WhatsApp web veya uygulama URL'si
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;
    const iosWhatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${defaultMessage}`;

    if (isMobile) {
        // Mobil cihazlar için doğrudan WhatsApp uygulamasını açmayı deneyin
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', iosWhatsappUrl);
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        linkElement.click();

        // Eğer WhatsApp uygulaması açılmazsa, web sürümüne yönlendir
        setTimeout(() => {
            window.location.href = whatsappUrl;
        }, 500);

        document.body.removeChild(linkElement);
    } else {
        // Masaüstü tarayıcılar için standart link açma
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', whatsappUrl);
        linkElement.setAttribute('target', '_blank');
        linkElement.setAttribute('rel', 'noopener noreferrer');
        linkElement.style.display = 'none';

        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    }
};

export default function NeighborhoodServicePage({ params }) {
    // Promise olarak gelen params'ı use() ile çözümlüyoruz
    const resolvedParams = use(params);

    // Artık çözümlenmiş params'tan özellikleri alabiliriz
    const { sehir, ilce, mahalle, "hizmet-kategori": hizmetKategori } = resolvedParams;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gerçek uygulamada burada API'den veri çekebilirsiniz
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Neighborhood ve servis kategorisi bilgilerini al veya varsayılanları kullan
    const neighborhood = neighborhoods[mahalle] || {
        name: mahalle,
        description: `${sehir} ${ilce} bölgesindeki ${mahalle} mahallesi için çilingir hizmetleri.`,
        landmarks: [],
        transportation: "",
        mapUrl: ""
    };

    const serviceCategory = serviceCategories[hizmetKategori] || {
        title: hizmetKategori.replace(/-/g, " "),
        description: "Profesyonel çilingir hizmetleri",
        image: "/images/default-service.jpg",
        keywords: ["çilingir", "anahtar", "kilit"],
        metaDescription: `${sehir} ${ilce} ${mahalle} bölgesinde profesyonel ${serviceCategory.title.toLowerCase()} hizmetleri.`
    };

    // Sayfa başlığı
    const pageTitle = `${sehir} ${ilce} ${neighborhood.name} ${serviceCategory.title} - 7/24 Hizmet`;

    // Meta açıklama
    const metaDescription = serviceCategory.metaDescription ||
        `${sehir} ${ilce} ${neighborhood.name} bölgesinde profesyonel ${serviceCategory.title.toLowerCase()} hizmetleri. 7/24 hizmet, uygun fiyat.`;

    // Canonical URL
    const canonicalUrl = `https://bicilingir.com/${sehir}/${ilce}/${mahalle}/${hizmetKategori}`;

    // Yerelleştirilmiş anahtar kelimeler
    const localKeywords = serviceCategory.keywords.map(keyword =>
        `${neighborhood.name} ${keyword}`
    );

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex min-h-screen flex-col">
                {/* SEO için yapısal veriler (JSON-LD) */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": `BiÇilingir - ${serviceCategory.title}`,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": ilce,
                                "addressRegion": sehir,
                                "streetAddress": mahalle
                            },
                            "telephone": "+905001234567",
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": "40.2139",
                                "longitude": "29.0606"
                            },
                            "url": canonicalUrl,
                            "description": metaDescription,
                            "image": serviceCategory.image,
                            "priceRange": "₺₺",
                            "openingHours": "Mo-Su 00:00-23:59"
                        })
                    }}
                />

                {/* Ana içerik */}
                <main className="flex-grow container mx-auto px-4 py-8">
                    {/* Breadcrumb navigasyonu */}
                    <nav className="flex text-sm text-gray-600 mb-6">
                        <Link href="/sehirler/" className="hover:text-blue-600">
                            Ana Sayfa
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href={`/sehirler/${sehir}`} className="hover:text-blue-600">
                            {sehir}
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href={`/sehirler/${sehir}/${ilce}`} className="hover:text-blue-600">
                            {ilce}
                        </Link>
                        <span className="mx-2">/</span>
                        <Link href={`/sehirler/${sehir}/${ilce}/${mahalle}`} className="hover:text-blue-600">
                            {neighborhood.name}
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{serviceCategory.title}</span>
                    </nav>

                    {/* Sayfa başlığı */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                        {sehir} {ilce} {neighborhood.name} {serviceCategory.title}
                    </h1>

                    {/* Ana içerik bölümü */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sol sütun - Ana içerik */}
                        <div className="lg:col-span-2">
                            {/* Servis görsel ve açıklaması */}
                            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                                <div className="relative h-64 md:h-80">
                                    <Image
                                        src={'/images/default-profile.jpg'}
                                        alt={`${neighborhood.name} ${serviceCategory.title}`}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{serviceCategory.title}</h2>
                                    <p className="text-gray-600 mb-4">{serviceCategory.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {localKeywords.map((keyword, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mahalle bilgileri */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {neighborhood.name} Hakkında
                                </h2>
                                <p className="text-gray-600 mb-4">{neighborhood.description}</p>

                                {neighborhood.landmarks.length > 0 && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Önemli Yerler</h3>
                                        <ul className="list-disc pl-5 text-gray-600">
                                            {neighborhood.landmarks.map((landmark, index) => (
                                                <li key={index}>{landmark}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {neighborhood.transportation && (
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Ulaşım</h3>
                                        <p className="text-gray-600">{neighborhood.transportation}</p>
                                    </div>
                                )}
                            </div>

                            {/* Hizmet fiyatları */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {serviceCategory.title} Fiyatları
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Hizmet</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Ortalama Süre</th>
                                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Fiyat Aralığı</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {samplePrices.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{item.service}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{item.time}</td>
                                                    <td className="py-3 px-4 text-sm text-gray-700">{item.price}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">* Fiyatlar değişiklik gösterebilir. Kesin fiyat bilgisi için lütfen bizimle iletişime geçin.</p>
                            </div>

                            {/* Müşteri yorumları */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {neighborhood.name} Bölgesindeki Müşteri Yorumları
                                </h2>
                                <div className="space-y-4">
                                    {sampleReviews.map((review) => (
                                        <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold">{review.username}</span>
                                                <div className="flex items-center">
                                                    <StarRating rating={review.rating} />
                                                    <span className="ml-2 text-gray-500 text-sm">
                                                        {new Date(review.date).toLocaleDateString('tr-TR')}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-600">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sağ sütun - İletişim ve Harita */}
                        <div className="lg:col-span-1">
                            {/* CTA Bölümü */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8 sticky top-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {serviceCategory.title} Hizmeti Alın
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    {sehir} {ilce} {neighborhood.name} bölgesinde profesyonel çilingir hizmeti için hemen iletişime geçin.
                                </p>

                                <div className="space-y-3 mb-6">
                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg flex items-center justify-center gap-2 animate-pulse"
                                        onClick={() => window.location.href = "tel:+905001234567"}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        Hemen Ara
                                    </Button>

                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                                        onClick={handleWhatsAppMessage}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                        </svg>
                                        WhatsApp'tan Yaz
                                    </Button>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Çalışma Saatleri</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p>Hafta içi: 08:00 - 22:00</p>
                                        <p>Hafta sonu: 09:00 - 21:00</p>
                                        <p className="text-green-600 font-medium">Acil Durumlar: 7/24</p>
                                    </div>
                                </div>
                            </div>

                            {/* Harita */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    {neighborhood.name} Haritası
                                </h2>
                                <div className="w-full h-80 bg-gray-200 mb-4 overflow-hidden rounded">
                                    {neighborhood.mapUrl ? (
                                        <iframe
                                            src={neighborhood.mapUrl}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`${neighborhood.name} haritası`}
                                        ></iframe>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                                            Harita bilgisi mevcut değil
                                        </div>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {sehir} {ilce} {neighborhood.name} bölgesinde hizmet veren çilingirlerimiz en kısa sürede yanınızda.
                                </p>
                            </div>

                            {/* İlgili Hizmetler */}
                            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-800 mb-4">
                                    Diğer Çilingir Hizmetlerimiz
                                </h2>
                                <ul className="space-y-2">
                                    {Object.entries(serviceCategories).map(([key, service]) => {
                                        if (key !== hizmetKategori) {
                                            return (
                                                <li key={key}>
                                                    <Link
                                                        href={`/${sehir}/${ilce}/${mahalle}/${key}`}
                                                        className="text-blue-600 hover:text-blue-800 flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                                        </svg>
                                                        {service.title}
                                                    </Link>
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
} 