"use client";

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Star } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Map from '../Map';
import { Button } from '../ui/button';

export default function NeighborhoodPageClient({ params }) {
    // params kontrolü 
    const data = JSON.parse(params.value);

    if (!data || !data.sehir || !data.ilce || !data.mahalle) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
                    <p className="text-gray-600">Geçersiz şehir, ilçe veya mahalle bilgisi. Lütfen geçerli bir adres seçin.</p>
                    <Button className="mt-4" asChild>
                        <Link href="/">Ana Sayfaya Dön</Link>
                    </Button>
                </div>
            </div>
        );
    }

    const { sehir, ilce, mahalle } = data;
    const [isLoading, setIsLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState([]);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState(null);

    useEffect(() => {
        // Gerçek uygulamada API'den veri çekilecek
        setTimeout(() => {
            const formattedMahalle = mahalle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            const mockLocksmiths = [
                {
                    id: 1,
                    name: "Ahmet Usta Çilingir",
                    rating: 4.9,
                    reviewCount: 156,
                    phone: "+90 555 123 4567",
                    address: `${formattedMahalle}, Ana Cadde No: 12, ${ilce.charAt(0).toUpperCase() + ilce.slice(1)}`,
                    workingHours: "7/24 Hizmet",
                    email: "ahmetusta@bicilingir.com",
                    profileImage: "/images/locksmith-1.jpg",
                    services: ["Kapı Açma", "Kilit Değişimi", "Çelik Kapı Tamiri"],
                    description: "10 yıllık tecrübemle acil durumlarınızda 7/24 hizmetinizdeyim. Kapı açma, kilit değişimi, çelik kapı tamiri gibi tüm çilingir işleriniz için beni arayabilirsiniz.",
                    location: { lat: 40.1883, lng: 29.0612 },
                },
                {
                    id: 2,
                    name: "Mehmet Usta Çilingir",
                    rating: 4.7,
                    reviewCount: 89,
                    phone: "+90 555 765 4321",
                    address: `${formattedMahalle}, Çilingir Sokak No: 5, ${ilce.charAt(0).toUpperCase() + ilce.slice(1)}`,
                    workingHours: "08:00 - 22:00",
                    email: "mehmetusta@bicilingir.com",
                    profileImage: "/images/locksmith-2.jpg",
                    services: ["Oto Çilingir", "Kasa Çilingir", "Kilit Değişimi"],
                    description: "15 yıllık tecrübemle özellikle oto çilingir konusunda uzmanım. Her türlü araç anahtarı yapımı ve programlama işleriniz için güvenilir hizmet.",
                    location: { lat: 40.1875, lng: 29.0605 },
                },
            ];

            const neighborhoodData = {
                id: 1,
                name: formattedMahalle,
                district: ilce.charAt(0).toUpperCase() + ilce.slice(1),
                city: sehir.charAt(0).toUpperCase() + sehir.slice(1),
                description: `${formattedMahalle} mahallesi, ${ilce.charAt(0).toUpperCase() + ilce.slice(1)}, ${sehir.charAt(0).toUpperCase() + sehir.slice(1)} bölgesinde 7/24 çilingir hizmetleri. Kapı açma, çilingir, anahtar kopyalama ve diğer çilingir hizmetleri için hemen arayın.`,
                longDescription: `${formattedMahalle} mahallesi sakinleri için profesyonel çilingir hizmetleri sunuyoruz. Kapınız kilitli kaldıysa, anahtarınızı kaybettiyseniz veya kilit değişimine ihtiyacınız varsa, bölgenizdeki uzman çilingirlerimiz dakikalar içinde yanınızda olacak. 7/24 acil çilingir hizmetimiz, deneyimli ve güvenilir çilingirlerimiz tarafından sağlanmaktadır. Müşteri memnuniyetini en üst düzeyde tutmak için çalışıyor, kaliteli hizmet ve uygun fiyat politikası ile hizmet veriyoruz.`,
                mapCenter: { lat: 40.1880, lng: 29.0610 }, // Mahalle için örnek koordinat
                emergencyPhone: "+90 850 123 4567",
                nearbyStreets: [
                    "Atatürk Caddesi",
                    "İstiklal Sokak",
                    "Cumhuriyet Bulvarı",
                    "Kurtuluş Caddesi",
                    "Fatih Sokak"
                ]
            };

            setLocksmiths(mockLocksmiths);
            setNeighborhoodInfo(neighborhoodData);
            setIsLoading(false);
        }, 1000);
    }, [sehir, ilce, mahalle]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-xl">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">

                {/* Breadcrumb navigasyonu */}
                <nav className="flex text-sm text-gray-600 mb-6">
                    <Link href="/" className="hover:text-blue-600">
                        Ana Sayfa
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/sehirler/${sehir}`} className="hover:text-blue-600">
                        {neighborhoodInfo.city}
                    </Link>
                    <span className="mx-2">/</span>
                    <Link href={`/sehirler/${sehir}/${ilce}`} className="hover:text-blue-600">
                        {neighborhoodInfo.district}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-blue-600 font-medium">{neighborhoodInfo.name}</span>
                </nav>

                <h1 className="text-3xl font-bold mb-2">{neighborhoodInfo.name} Çilingir Hizmetleri</h1>
                <p className="text-gray-600">{neighborhoodInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <h2 className="text-2xl font-semibold mb-4">{neighborhoodInfo.name} Hakkında</h2>
                        <p className="mb-4">{neighborhoodInfo.longDescription}</p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">Çilingir Hizmetlerimiz</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start">
                                <div className="rounded-full bg-primary/10 p-2 mr-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Kapı Açma</h4>
                                    <p className="text-sm text-gray-600">Kilitli kaldığınız her durumda hızlı ve güvenli çözüm</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-primary/10 p-2 mr-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Kilit Değişimi</h4>
                                    <p className="text-sm text-gray-600">Güvenliğiniz için profesyonel kilit değişim hizmeti</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-primary/10 p-2 mr-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Anahtar Kopyalama</h4>
                                    <p className="text-sm text-gray-600">Her türlü anahtar için hızlı ve hassas kopyalama</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="rounded-full bg-primary/10 p-2 mr-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-medium mb-1">Çelik Kapı Tamiri</h4>
                                    <p className="text-sm text-gray-600">Çelik kapı kilitleri ve mekanizmaları için bakım ve tamir</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button className="w-full sm:w-auto bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/80 transition-colors">7/24 Acil Çilingir Çağır</button>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="bg-blue-50 rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{neighborhoodInfo.name} Mahallesinde Çilingir mi Arıyorsunuz?</h2>
                        <p className="text-gray-600 mb-6">
                            BiÇilingir ile {ilce.charAt(0).toUpperCase() + ilce.slice(1)} {neighborhoodInfo.name} mahallesinde hizmet veren güvenilir ve profesyonel çilingirlerle hemen iletişime geçin.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => window.location.href = "tel:+905001234567"}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Hemen Ara
                            </button>

                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                WhatsApp'tan Yaz
                            </button>

                            <Link
                                href="/"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Çilingir Ara
                            </Link>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold mb-4">Mahallenizdeki Çilingirler</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {locksmiths.map((locksmith) => (
                            <Card key={locksmith.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <div className="relative h-28 w-28 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                                            <Image
                                                src={"/images/default-profile.jpg"}
                                                alt={locksmith.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-semibold">{locksmith.name}</h3>

                                            <div className="flex items-center mt-1 mb-3">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="ml-1 text-sm font-medium">{locksmith.rating}</span>
                                                <span className="ml-1 text-sm text-gray-500">({locksmith.reviewCount} değerlendirme)</span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4">{locksmith.description}</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                <div className="flex items-start">
                                                    <Phone className="w-4 h-4 mt-0.5 mr-2 text-gray-500" />
                                                    <span>{locksmith.phone}</span>
                                                </div>

                                                <div className="flex items-start">
                                                    <MapPin className="w-4 h-4 mt-0.5 mr-2 text-gray-500" />
                                                    <span>{locksmith.address}</span>
                                                </div>

                                                <div className="flex items-start">
                                                    <Clock className="w-4 h-4 mt-0.5 mr-2 text-gray-500" />
                                                    <span>{locksmith.workingHours}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium mb-2">Hizmetler:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {locksmith.services.map((service, index) => (
                                                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                        <Link href={`/cilingir/${locksmith.id}`} passHref>
                                            <Button variant="outline" className="w-full sm:w-auto">Profili İncele</Button>
                                        </Link>
                                        <a href={`tel:${locksmith.phone}`}>
                                            <Button className="w-full sm:w-auto flex items-center gap-2">
                                                <Phone size={16} />
                                                Ara
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link href={`/ara?sehir=${sehir}&ilce=${ilce}&mahalle=${mahalle}`} passHref>
                            <Button variant="outline">
                                Daha Fazla Çilingir Göster
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <Card className="mb-6">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Acil Çilingir</CardTitle>
                            <CardDescription>7/24 acil çilingir hizmeti</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-4">
                                Kapınızda kaldınız mı? Anahtarınızı mı kaybettiniz? Hemen en yakın çilingiri arayın!
                            </p>
                            <a href={`tel:${neighborhoodInfo.emergencyPhone}`}>
                                <Button className="w-full flex items-center justify-center gap-2">
                                    <Phone size={16} />
                                    {neighborhoodInfo.emergencyPhone}
                                </Button>
                            </a>
                        </CardContent>
                    </Card>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Yakın Caddeler</CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <ul className="space-y-2">
                                {neighborhoodInfo.nearbyStreets.map((street, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`/sehirler/${sehir}/${ilce}/${mahalle}/${street.toLowerCase().replace(/\s+/g, '-')}`}
                                            className="flex items-center text-sm hover:text-primary"
                                        >
                                            <MapPin size={14} className="mr-2" />
                                            {street}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Konum</h3>
                        <div className="h-[300px] rounded-lg overflow-hidden border">
                            <Map
                                center={neighborhoodInfo.mapCenter}
                                zoom={15}
                                markers={locksmiths.map(l => ({
                                    position: l.location,
                                    title: l.name
                                }))}
                            />
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Çilingir Hizmeti Ne Kadar?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm mb-4">
                                Çilingir hizmet fiyatları işin türüne, kapı modeline ve saate göre değişiklik gösterebilir.
                            </p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span>Kapı Açma (Basit)</span>
                                    <span className="font-medium">₺150 - ₺250</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Kapı Açma (Çelik)</span>
                                    <span className="font-medium">₺200 - ₺350</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Kilit Değişimi</span>
                                    <span className="font-medium">₺250 - ₺500</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span>Anahtar Kopyalama</span>
                                    <span className="font-medium">₺50 - ₺150</span>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                                * Fiyatlar yaklaşık değerlerdir. Kesin fiyat için çilingir ile görüşmeniz gerekmektedir.
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 