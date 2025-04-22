"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Star, Clock, Search, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import Map from '../Map';

export default function DistrictContent({ sehir, ilce }) {
    const [isLoading, setIsLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState([]);
    const [districtInfo, setDistrictInfo] = useState(null);

    useEffect(() => {
        // Gerçek projede API çağrısı yapılacak
        const fetchData = async () => {
            try {
                // Mock veri yükleme simülasyonu
                await new Promise(resolve => setTimeout(resolve, 800));

                // Örnek çilingir verileri
                const mockLocksmiths = [
                    {
                        id: 1,
                        name: 'Ahmet Usta Çilingir',
                        rating: 4.8,
                        reviewCount: 127,
                        services: ['Kapı Açma', 'Kilit Değişimi', 'Çelik Kapı Tamiri'],
                        description: '10 yıllık tecrübe ile 7/24 hizmet veren profesyonel çilingir.',
                        phone: '+90 555 123 4567',
                        address: `Bursa, Merkez Mah.`,
                        workingHours: '7/24 Hizmet',
                        image: '/images/locksmith1.jpg',
                        location: { lat: 40.1885, lng: 29.0610 }
                    },
                    {
                        id: 2,
                        name: 'Mehmet Çilingir',
                        rating: 4.6,
                        reviewCount: 89,
                        services: ['Oto Çilingir', 'Kasa Çilingir', 'Kilit Değişimi'],
                        description: 'Oto anahtarı ve kasalar konusunda uzman çilingir hizmeti.',
                        phone: '+90 555 987 6543',
                        address: `Bursa, Yeni Mah.`,
                        workingHours: '08:00 - 22:00',
                        image: '/images/locksmith2.jpg',
                        location: { lat: 40.1905, lng: 29.0590 }
                    },
                    {
                        id: 3,
                        name: 'Ayşe Usta Çilingir',
                        rating: 4.9,
                        reviewCount: 156,
                        services: ['Kapı Açma', 'Akıllı Kilit Kurulumu', 'Çelik Kapı Tamiri'],
                        description: 'Modern kilit sistemleri konusunda uzmanlaşmış çilingir.',
                        phone: '+90 555 765 4321',
                        address: `Bursa, Atatürk Mah.`,
                        workingHours: '7/24 Hizmet',
                        image: '/images/locksmith3.jpg',
                        location: { lat: 40.1865, lng: 29.0630 }
                    }
                ];

                // İlçe bilgileri
                const mockDistrictInfo = {
                    name: 'Osmangazi',
                    city: 'Bursa',
                    description: `Osmangazi, Bursa ilinin önemli bir ilçesidir. Bölgede çilingir hizmetleri geniş bir ağla sunulmaktadır.`,
                    neighborhoods: ['Merkez', 'Yeni Mahalle', 'Atatürk Mahallesi', 'Cumhuriyet Mahallesi', 'Fatih Mahallesi'],
                    image: '/images/district-image.jpg',
                    mapCenter: { lat: 40.1885, lng: 29.0610 }
                };

                setLocksmiths(mockLocksmiths);
                setDistrictInfo(mockDistrictInfo);
                setIsLoading(false);
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [sehir, ilce]);

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
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb navigasyonu */}
            <nav className="flex text-sm text-gray-600 mb-6">
                <Link href="/" className="hover:text-blue-600">
                    Ana Sayfa
                </Link>
                <span className="mx-2">/</span>
                <Link href="/sehirler" className="hover:text-blue-600">
                    Şehirler
                </Link>
                <span className="mx-2">/</span>
                <Link href={`/sehirler/${sehir}`} className="hover:text-blue-600">
                    {districtInfo.city}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">{districtInfo.name}</span>
            </nav>

            {/* Sayfa başlığı */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {districtInfo.city} {districtInfo.name} Çilingir Hizmetleri
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* İlçe bilgileri */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                {districtInfo.name} Hakkında
                            </CardTitle>
                            <CardDescription>
                                {districtInfo.city} {districtInfo.name} Çilingir Hizmetleri
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 mb-4">
                                {districtInfo.description}
                            </p>

                            <h3 className="font-semibold text-lg mt-4 mb-2">Mahalleler</h3>
                            <div className="flex flex-wrap gap-2">
                                {districtInfo.neighborhoods.map((mahalle, index) => (
                                    <Link href={`/sehirler/${sehir}/${ilce}/${mahalle.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                                            <MapPin className="h-3 w-3 mr-1" />
                                            {mahalle}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Çilingirler */}
                    <h2 className="text-2xl font-bold mb-4">{districtInfo.name} Çilingirler</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {locksmiths.map((locksmith) => (
                            <Card key={locksmith.id} className="h-full">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-xl">{locksmith.name}</CardTitle>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                                            <span className="text-sm font-medium">{locksmith.rating}</span>
                                            <span className="text-xs text-gray-500 ml-1">({locksmith.reviewCount})</span>
                                        </div>
                                    </div>
                                    <CardDescription>{locksmith.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap gap-1">
                                            {locksmith.services.map((service, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs">
                                                    {service}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                                            <span className="text-sm text-gray-700">{locksmith.address}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                            <span className="text-sm text-gray-700">{locksmith.workingHours}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-2">
                                    <div className="flex space-x-2 w-full">
                                        <button variant="outline" size="sm" className="w-1/2">
                                            <Phone className="h-4 w-4 mr-2" />
                                            Ara
                                        </button>
                                        <button variant="default" size="sm" className="w-1/2">
                                            Detaylar
                                        </button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Çilingir Listesi */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {locksmiths.map((locksmith) => (
                            <Card key={locksmith.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-0">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-semibold text-gray-800">{locksmith.name}</h3>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium">{locksmith.rating}</span>
                                                <span className="text-xs text-gray-500">({locksmith.reviewCount})</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-start gap-2">
                                                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                                                <span className="text-sm text-gray-600">{locksmith.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">{locksmith.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">{locksmith.workingHours}</span>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {locksmith.services.map((service, index) => (
                                                    <Badge key={index} variant="outline" className="bg-gray-100">{service}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <Button variant="default" size="sm" asChild>
                                                <Link href={`/cilingir/${locksmith.id}`}>
                                                    Detaylar <ChevronRight className="h-4 w-4 ml-1" />
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={`tel:${locksmith.phone.replace(/\s/g, '')}`}>
                                                    Ara
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>


                    {/* Hizmetler */}
                    <h2 className="text-2xl font-bold mb-4">{districtInfo.name} Çilingir Hizmetleri</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {['Kapı Açma', 'Kilit Değişimi', 'Çelik Kapı Tamiri', 'Oto Çilingir', 'Kasa Çilingir', 'Akıllı Kilit'].map((service, index) => (
                            <Link key={index} href={`/sehirler/${sehir}/${ilce}/hizmetler/${service.toLowerCase().replace(/\s+/g, '-')}`}>
                                <Card className="hover:shadow-md transition-shadow h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{service}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-500">
                                            {districtInfo.city} {districtInfo.name} bölgesinde profesyonel {service.toLowerCase()} hizmeti
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    {/* Arama kutusu */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">Hızlı Ara</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">Size en yakın çilingiri hemen bulun</p>
                                <button className="w-full">
                                    <Search className="h-4 w-4 mr-2" />
                                    Çilingir Ara
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Harita */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="text-lg">{districtInfo.name} Haritası</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="h-[300px] w-full">
                                <Map
                                    center={districtInfo.mapCenter}
                                    zoom={14}
                                    markers={locksmiths.map(locksmith => ({
                                        position: locksmith.location,
                                        title: locksmith.name
                                    }))}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daha fazla bilgi */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Daha Fazla Bilgi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={`/sehirler/${sehir}/${ilce}/7-24-cilingir`} className="text-blue-600 hover:underline flex items-center">
                                        <span className="mr-2">•</span>
                                        {districtInfo.name} 7/24 Çilingir Hizmetleri
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/sehirler/${sehir}/${ilce}/oto-cilingir`} className="text-blue-600 hover:underline flex items-center">
                                        <span className="mr-2">•</span>
                                        {districtInfo.name} Oto Çilingir
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/sehirler/${sehir}/${ilce}/elektronik-kilitler`} className="text-blue-600 hover:underline flex items-center">
                                        <span className="mr-2">•</span>
                                        {districtInfo.name} Elektronik Kilit Hizmetleri
                                    </Link>
                                </li>
                                <li>
                                    <Link href={`/sehirler/${sehir}/${ilce}/mahalleler`} className="text-blue-600 hover:underline flex items-center">
                                        <span className="mr-2">•</span>
                                        {districtInfo.name} Mahalle Listesi
                                    </Link>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 