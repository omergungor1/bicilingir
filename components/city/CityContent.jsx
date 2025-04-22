"use client";

import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Mail, ArrowRight } from "lucide-react";
import Map from '../Map';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import Link from 'next/link';

export default function CityContent({ sehir }) {
    const [isLoading, setIsLoading] = useState(true);
    const [cityData, setCityData] = useState(null);


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

    useEffect(() => {
        // Gerçek uygulamada API'den veri çekilecek
        setTimeout(() => {
            const mockData = {
                id: 1,
                name: sehir.charAt(0).toUpperCase() + sehir.slice(1),
                description: `${sehir.charAt(0).toUpperCase() + sehir.slice(1)} ili için 7/24 çilingir hizmetleri. Kapınızda kaldığınızda, anahtarınızı kaybettiğinizde veya acil durumlar için profesyonel çilingirlerimiz hizmetinizdedir.`,
                districts: [
                    { id: 1, name: 'Osmangazi' },
                    { id: 2, name: 'Yıldırım' },
                    { id: 3, name: 'Nilüfer' },
                    { id: 4, name: 'Gürsu' },
                    { id: 5, name: 'Kestel' },
                    { id: 6, name: 'Mudanya' },
                    { id: 7, name: 'Gemlik' },
                    { id: 8, name: 'İnegöl' },
                    { id: 9, name: 'Karacabey' },
                    { id: 10, name: 'Mustafakemalpaşa' },
                    { id: 11, name: 'Orhangazi' },
                    { id: 12, name: 'İznik' },
                    { id: 13, name: 'Yenişehir' },
                    { id: 14, name: 'Orhaneli' },
                    { id: 15, name: 'Büyükorhan' },
                    { id: 16, name: 'Harmancık' },
                    { id: 17, name: 'Keles' },
                ],
                services: [
                    { id: 1, name: 'Kapı Açma', slug: 'kapi-acma' },
                    { id: 2, name: 'Kilit Değişimi', slug: 'kilit-degisimi' },
                    { id: 3, name: 'Çelik Kapı Tamiri', slug: 'celik-kapi-tamiri' },
                    { id: 4, name: 'Oto Çilingir', slug: 'oto-cilingir' },
                    { id: 5, name: 'Kasa Çilingir', slug: 'kasa-cilingir' },
                ],
                mapLocation: { lat: 40.1885, lng: 29.0610 }, // Bursa için örnek koordinat
                contactInfo: {
                    phone: '+90 850 123 4567',
                    email: 'info@bicilingir.com',
                    address: `${sehir.charAt(0).toUpperCase() + sehir.slice(1)} Merkez, Atatürk Cad. No: 123`,
                    workingHours: '7/24 Hizmet'
                }
            };

            setCityData(mockData);
            setIsLoading(false);
        }, 1000);
    }, [sehir]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Breadcrumb navigasyonu */}
                    <nav className="flex text-sm text-gray-600 mb-6">
                        <Link href="/" className="hover:text-blue-600">
                            Ana Sayfa
                        </Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900 font-medium">{cityData.name}</span>
                    </nav>

                    <h1 className="text-3xl font-bold mb-2">{cityData.name} Çilingir Anahtarcı Hizmetleri</h1>
                    <p className="text-gray-600 mb-6">{cityData.description}</p>

                    <h2 className="text-md md:text-xl font-semibold mb-4">Bursa İlçeleri</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                        {cityData.districts.map((district) => (
                            <Link
                                href={`/sehirler/${sehir}/${district.name.toLowerCase()}`}
                                key={district.id}
                                className="bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border transition-colors flex items-center"
                            >
                                <MapPin size={16} className="mr-1 text-primary" />
                                <span>{district.name} Çilingir Anahtarcı</span>
                            </Link>
                        ))}
                    </div>

                    <h2 className="text-2xl font-semibold mb-4">Çilingir Hizmetleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {cityData.services.map((service) => (
                            <Link
                                href={`/sehirler/${sehir}/${cityData.districts[0].name.toLowerCase()}/${service.slug}`}
                                key={service.id}
                                className="group"
                            >
                                <Card className="transition-all hover:shadow-md group-hover:border-primary">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex justify-between items-center">
                                            {service.name}
                                            <ArrowRight size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-sm text-gray-500">
                                            {cityData.name} bölgesinde profesyonel {service.name.toLowerCase()} hizmeti
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>


                    {/* Hizmetler */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{cityData.name} Çilingir Hizmetleri</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="text-4xl mb-3">{service.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                                    <p className="text-gray-600 mb-4">{service.description}</p>

                                    {cityData.neighborhoods && cityData.neighborhoods.length > 0 ? (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                                Mahallelere Göre {service.name} Hizmetleri
                                            </summary>
                                            <div className="mt-2 pl-4 space-y-1">
                                                {cityData.neighborhoods.map((neighborhood, index) => (
                                                    <Link
                                                        key={index}
                                                        href={`/${cityData.name}/${neighborhood.toLowerCase()}/${service.slug}`}
                                                        className="block text-blue-600 hover:text-blue-800 hover:underline py-1"
                                                    >
                                                        {cityData.name} {neighborhood} {service.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </details>
                                    ) : (
                                        <Link
                                            href={`/${cityData.name}/merkez/${service.slug}`}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Çilingir Bul
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sık Sorulan Sorular */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">{cityData.name} Çilingir Hizmetleri - Sık Sorulan Sorular</h2>

                        <div className="space-y-4">
                            <details className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold text-gray-800 cursor-pointer">{cityData.name}'de en yakın çilingir nerede?</summary>
                                <p className="mt-2 text-gray-600">
                                    BiÇilingir platformu sayesinde {cityData.name} ilçesinin tüm mahallelerinde hizmet veren en yakın çilingiri bulabilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold text-gray-800 cursor-pointer">{cityData.name}'de çilingir ücretleri ne kadar?</summary>
                                <p className="mt-2 text-gray-600">
                                    {cityData.name} ilçesinde çilingir ücretleri genellikle 200₺ ile 800₺ arasında değişmektedir. Kapı açma işlemleri ortalama 200₺-350₺, kilit değiştirme 300₺-500₺, çelik kapı tamiri ise 400₺-800₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold text-gray-800 cursor-pointer">{cityData.name}'de gece çilingir hizmeti alabilir miyim?</summary>
                                <p className="mt-2 text-gray-600">
                                    Evet, {cityData.name} ilçesinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.
                                </p>
                            </details>

                            <details className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold text-gray-800 cursor-pointer">{cityData.name}'de oto çilingir hizmeti var mı?</summary>
                                <p className="mt-2 text-gray-600">
                                    Evet, {cityData.name} ilçesinde uzman oto çilingir ekiplerimiz hizmet vermektedir. Araç anahtarı kopyalama, kayıp anahtar yerine yenisini yapma, immobilizer programlama ve araç kapısı açma gibi hizmetlerimiz bulunmaktadır.
                                </p>
                            </details>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Hakkımızda</h2>
                        <p className="mb-6">
                            BiÇilingir, tüm Türkiye’de ve {cityData.name} ilindeki en yakın ve en güvenilir çilingiri bulmanızı sağlayan bir platformdur.
                            7/24 hizmet veren profesyonel çilingirlerle sizi hızlıca buluşturur.

                            Platformumuz aracılığıyla:<br />
                            🔑 Kapı açma<br />
                            🔄 Kilit değişimi<br />
                            🚪 Çelik kapı tamiri<br />
                            🚗 Oto çilingir<br />
                            🧳 Kasa çilingir hizmetlerine kolayca ulaşabilirsiniz.<br /><br />
                            Bulunduğunuz konuma en yakın çilingirle en hızlı şekilde iletişime geçmenizi sağlıyoruz.
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>İletişim Bilgileri</CardTitle>
                            <CardDescription>{cityData.name} Çilingir</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start">
                                <Phone className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <p className="font-medium">Telefon</p>
                                    <a href={`tel:${cityData.contactInfo.phone}`} className="text-blue-600 hover:underline">
                                        {cityData.contactInfo.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Mail className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <p className="font-medium">E-posta</p>
                                    <a href={`mailto:${cityData.contactInfo.email}`} className="text-blue-600 hover:underline">
                                        {cityData.contactInfo.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <p className="font-medium">Adres</p>
                                    <p>{cityData.contactInfo.address}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <Clock className="w-5 h-5 mr-3 text-primary" />
                                <div>
                                    <p className="font-medium">Çalışma Saatleri</p>
                                    <p>{cityData.contactInfo.workingHours}</p>
                                </div>
                            </div>

                            <div className="my-4 h-[1px] bg-gray-200 w-full" />

                            <Link href="/hemen-ara" passHref>
                                <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors">
                                    Hemen Ara
                                </button>
                            </Link>
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">Konum</h3>
                        <div className="h-[300px] rounded-lg overflow-hidden border">
                            <Map
                                center={cityData.mapLocation}
                                zoom={12}
                                markers={[{
                                    position: cityData.mapLocation,
                                    title: `${cityData.name} Çilingir`
                                }]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 