// http://localhost:3000/sehirler

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Örnek il verileri
const cityData = {
    "bursa": {
        name: "Bursa",
        description: "Bursa, Türkiye'nin en büyük dördüncü şehri ve önemli bir sanayi, ticaret ve turizm merkezidir. Osmanlı İmparatorluğu'nun ilk başkenti olan Bursa, tarihi ve kültürel zenginlikleriyle ünlüdür.",
        districts: ["Osmangazi", "Nilüfer", "Yıldırım", "Gemlik", "İnegöl", "Mudanya", "Kestel", "Gürsu"],
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d156779.40485374895!2d29.006176936973705!3d40.19130329505858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca3e6a9a71349d%3A0x805d476dcc18fcee!2sBursa!5e0!3m2!1str!2str!4v1651321384774!5m2!1str!2str",
        image: "/images/bursa.jpg"
    }
};

// Örnek servisler
const services = [
    {
        id: 1,
        name: "Acil Çilingir",
        slug: "acil-cilingir",
        description: "7/24 hizmet veren acil çilingir ekibimiz, kapınız kilitli kaldığında en hızlı şekilde yanınızda.",
        icon: "🔑"
    },
    {
        id: 2,
        name: "Oto Çilingir",
        slug: "oto-cilingir",
        description: "Araç anahtarı kopyalama, immobilizer ve kilit sorunları için uzman ekibimiz yanınızda.",
        icon: "🚗"
    },
    {
        id: 3,
        name: "Ev Çilingir",
        slug: "ev-cilingir",
        description: "Ev ve işyeri kilit değişimi, güvenlik sistemleri ve anahtarsız kilitler için çözümler.",
        icon: "🏠"
    },
    {
        id: 4,
        name: "Kasa Çilingir",
        slug: "kasa-cilingir",
        description: "Kasa açma, kilit değişimi ve şifre resetleme işlemleri için profesyonel hizmet.",
        icon: "🔐"
    },
    {
        id: 5,
        name: "7/24 Çilingir",
        slug: "724-cilingir",
        description: "Gece gündüz, hafta sonu ve resmi tatillerde bile hizmet veren çilingir ekibi.",
        icon: "🕒"
    },
    {
        id: 6,
        name: "Çilingir Hizmeti",
        slug: "cilingir-hizmeti",
        description: "Her türlü anahtar ve kilit probleminiz için genel çilingir hizmetleri.",
        icon: "🔧"
    }
];

export default function CityPage({ params }) {
    // URL'den şehir adını al
    const sehir = params.sehir || "bursa";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Gerçek uygulamada burada API'den veri çekebilirsiniz
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // İl verilerini al veya varsayılanları kullan
    const city = cityData[sehir] || {
        name: sehir.charAt(0).toUpperCase() + sehir.slice(1),
        description: `${sehir.charAt(0).toUpperCase() + sehir.slice(1)} ili için çilingir hizmetleri.`,
        districts: [],
        mapUrl: "",
        image: "/images/default-city.jpg"
    };

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Breadcrumb navigasyonu */}
                <nav className="flex text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-blue-600">
                        Ana Sayfa
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{city.name}</span>
                </nav>

                {/* Sayfa başlığı */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    {city.name} Çilingir Hizmetleri
                </h1>

                {/* Şehir bilgileri */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                    <div className="relative h-64 md:h-80">
                        <Image
                            src={city.image}
                            alt={`${city.name} ili`}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{city.name} Hakkında</h2>
                        <p className="text-gray-600 mb-6">{city.description}</p>

                        {city.districts.length > 0 && (
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">İlçeler</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {city.districts.map((district, index) => (
                                        <Link
                                            key={index}
                                            href={`/sehirler/${sehir}/${district.toLowerCase()}`}
                                            className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg text-gray-700 font-medium text-center transition-colors"
                                        >
                                            {district}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Hizmetler */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{city.name} Çilingir Hizmetleri</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-3">{service.icon}</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                                <p className="text-gray-600 mb-4">{service.description}</p>

                                {city.districts.length > 0 ? (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                            İlçelere Göre {service.name} Hizmetleri
                                        </summary>
                                        <div className="mt-2 pl-4 space-y-1">
                                            {city.districts.map((district, index) => (
                                                <Link
                                                    key={index}
                                                    href={`/sehirler/${sehir}/${district.toLowerCase()}/merkez/${service.slug}`}
                                                    className="block text-blue-600 hover:text-blue-800 hover:underline py-1"
                                                >
                                                    {city.name} {district} {service.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </details>
                                ) : (
                                    <Link
                                        href={`/sehirler/${sehir}/merkez/merkez/${service.slug}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Detaylı Bilgi
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Harita */}
                {city.mapUrl && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{city.name} Haritası</h2>
                        <div className="w-full h-96 bg-gray-200 mb-4 overflow-hidden rounded">
                            <iframe
                                src={city.mapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`${city.name} haritası`}
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Sık Sorulan Sorular */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">{city.name} Çilingir Hizmetleri - Sık Sorulan Sorular</h2>

                    <div className="space-y-4">
                        <details className="bg-gray-50 rounded-lg p-4">
                            <summary className="font-semibold text-gray-800 cursor-pointer">{city.name}'da 7/24 çilingir hizmeti var mı?</summary>
                            <p className="mt-2 text-gray-600">
                                Evet, {city.name} genelinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Acil durumlarda hemen müdahale için bizi arayabilirsiniz.
                            </p>
                        </details>

                        <details className="bg-gray-50 rounded-lg p-4">
                            <summary className="font-semibold text-gray-800 cursor-pointer">{city.name}'da çilingir fiyatları ne kadar?</summary>
                            <p className="mt-2 text-gray-600">
                                Çilingir fiyatları sunulan hizmete, zamanlamaya ve lokasyona göre değişiklik gösterebilir. Kapı açma işlemleri 200₺'den, kilit değiştirme işlemleri 300₺'den başlamaktadır.
                            </p>
                        </details>

                        <details className="bg-gray-50 rounded-lg p-4">
                            <summary className="font-semibold text-gray-800 cursor-pointer">{city.name}'da çelik kapı tamiri yapıyor musunuz?</summary>
                            <p className="mt-2 text-gray-600">
                                Evet, {city.name} genelinde çelik kapı tamir, kilit değişimi ve bakım hizmetleri sunmaktayız. Uzman ekiplerimiz her marka çelik kapı tamiri konusunda deneyimlidir.
                            </p>
                        </details>

                        <details className="bg-gray-50 rounded-lg p-4">
                            <summary className="font-semibold text-gray-800 cursor-pointer">Kayıp anahtarım için {city.name}'da yeni anahtar yaptırabilir miyim?</summary>
                            <p className="mt-2 text-gray-600">
                                Evet, {city.name}'daki çilingir ekiplerimiz kayıp anahtarlar yerine yeni anahtar yapımı konusunda uzmanlaşmıştır. Normal anahtarlar, immobilizer özellikli araba anahtarları ve elektronik kartlı sistemler için hizmet verilmektedir.
                            </p>
                        </details>
                    </div>
                </div>
            </main>
        </div>
    );
} 