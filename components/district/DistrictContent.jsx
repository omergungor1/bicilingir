"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import LocksmithCard from '../ui/locksmith-card';
import Map from '../Map';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

import { services, mockLocksmiths } from '../../lib/test-data';

export default function DistrictContent({ params }) {
    const [isLoading, setIsLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState([]);
    const [districtInfo, setDistrictInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);

    const { sehir, ilce } = params || {};

    // API'den veri çekme fonksiyonu
    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Gerçek bir API çağrısı burada olacak
            // Örnek: const response = await fetch(`/api/districts/${sehir}/${ilce}`);
            // const data = await response.json();

            // Şimdilik mock veri kullanıyoruz
            await new Promise(resolve => setTimeout(resolve, 800));

            // Örnek ilçe bilgileri
            const mockDistrictInfo = {
                name: 'Osmangazi',
                city: 'Bursa',
                description: `Bursa Osmangazi de çilingir hizmetine mi ihtiyacınız var? Osmangazi ilçesinde biçok çilingir hizmetleri geniş bir ağla sunulmaktadır. Aşağıda listelenen çilingirlerin hepsi Bursa Osmangazi ilçesinde hizmet vermektedir.`,
                longDescription: `Bursa Osmangazi de çilingir hizmetleri geniş bir ağla sunulmaktadır. Biçok çilingir bölgede aktif olarak hizmet vermektedir.\nBursa Osmangazi de çilingir fiyatı, ilçe ve hizmete göre değişkenlikler göstermektedir. Bursa Osmangazi de ev çilingiri, otomobil çilingiri, acil çilingir, 724 çilingir hizmetleri bulmak oldukça kolaydır.\nBiÇilingir ile en yakın çilingiri saniyeler içinde bulabilir ve hemen arayabilirsiniz. Hizmetlere göre güncel yaklaşık fiyat bilgilerini görebilirsiniz. Net fiyat bilgisi için çilingir ile telefonda görüşebilirsiniz.`,
                neighborhoods: ['Adalet', 'Ahmetbey', 'Ahmetpaşa', 'Akpınar', 'Aksungur', 'Aktarhüssam', 'Alaaddin', 'Alacahırka', 'Alacamescit', 'Alaşarköy', 'Alemdar', 'Alipaşa', 'Altınova', 'Altıparmak', 'Armutköy', 'Atıcılar', 'Avdancık', 'Bağlarbaşı', 'Bağlı', 'Bahar', 'Başaran', 'Büyükdeliller', 'Çağlayan', 'Çaybaşı', 'Çekirge', 'Çeltikköy', 'Çırpan', 'Çiftehavuzlar', 'Çirişhane', 'Çukurcaköy', 'Dağakça', 'Demirkapı', 'Demirtaş Barbaros', 'Demirtaş Cumhuriyet', 'Demirtaş Dumlupınar', 'Demirtaş Sakarya', 'Demirtaşpaşa', 'Dereçavuş', 'Dikkaldırım', 'Dobruca', 'Doğanbey', 'Doğancı', 'Doğanevler', 'Dumlupınar', 'Dürdane', 'Ebu İshak', 'Elmasbahçeler', 'Emek', 'Emek Adnan Menderes', 'Emek Fatih Sultan Mehmet', 'Emek Zekai Gümüşdiş', 'Fatih', 'Gaziakdemir', 'Geçit', 'Gökçeören', 'Gülbahçe', 'Gündoğdu', 'Güneştepe', 'Güneybayırı', 'Güneybudaklar', 'Hacıilyas', 'Hamitler', 'Hamzabey', 'Hocaalizade', 'Hocahasan', 'Hüdavendigar', 'Hürriyet', 'Hüseyinalanı', 'İbrahimpaşa', 'İnkaya', 'İntizam', 'İsmetiye', 'İstiklal', 'İvazpaşa', 'Karabalçık', 'Karaislah', 'Kavaklı', 'Kayhan', 'Kemerçeşme', 'Kirazlı', 'Kırcaali', 'Kiremitçi', 'Kocanaip', 'Koğukçınar', 'Kuruçeşme', 'Küçükbalıklı', 'Küçükdeliller', 'Kükürtlü', 'Küplüpınar', 'Maksem', 'Mehmet Akif', 'Mollafenari', 'Mollagürani', 'Muradiye', 'Mürseller', 'Nalbantoğlu', 'Namıkkemal', 'Nilüfer', 'Orhanbey', 'Osmangazi', 'Ovaakça Çeşmebaşı', 'Ovaakça Eğitim', 'Ovaakça Merkez', 'Ovaakça Santral', 'Panayır', 'Pınarbaşı', 'Reyhan', 'Sakarya', 'Santralgaraj', 'Selamet', 'Selçukgazi', 'Selimiye', 'Sırameşeler', 'Soğanlı', 'Soğukkuyu', 'Soğukpınar', 'Süleymaniye', 'Tahtakale', 'Tayakadın', 'Tuna', 'Tuzaklı', 'Tuzpazarı', 'Ulu', 'Uluçam', 'Veyselkarani', 'Yahşibey', 'Yenibağlar', 'Yeniceabat', 'Yenikaraman', 'Yenikent', 'Yeşilova', 'Yiğitali', 'Yunuseli', 'Zafer', 'Santral Garaj'],
                location: { lat: 40.1883, lng: 29.0612 },
                nearbyStreets: [{
                    id: 1,
                    name: 'Bağlarbaşı',
                    slug: 'baglarbasi'
                }, {
                    id: 2,
                    name: 'Yunuseli',
                    slug: 'yunuseli'
                }, {
                    id: 3,
                    name: 'Emek',
                    slug: 'emek'
                }, {
                    id: 4,
                    name: 'Hamitler',
                    slug: 'hamitler'
                }, {
                    id: 5,
                    name: 'Alemdar',
                    slug: 'alemdar'
                }]
            };

            setDistrictInfo(mockDistrictInfo);
            setLocksmiths(mockLocksmiths);
            setIsLoading(false);
        } catch (error) {
            console.error('Veri yüklenirken hata oluştu:', error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [sehir, ilce]);

    // SideMenu parametrelerini hazırla
    useEffect(() => {
        if (!districtInfo || !locksmiths.length) return;

        // SideMenu için parametreleri ayarla
        const params = {
            map: {
                locksmithPositions: locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })),
                mapCenter: districtInfo.location
            },
            nearbySection: {
                title: 'Yakındaki Mahalleler',
                description: '',
                data: districtInfo.neighborhoods
                    .slice(0, 20) // Sayfa performansı için ilk 20 mahalleyi göster
                    .map((neighborhood, idx) => ({
                        id: idx + 1,
                        name: neighborhood,
                        slug: `sehirler/${sehir}/${ilce}/${neighborhood.toLowerCase().replace(/\s+/g, '-')}`
                    }))
            },
            locksmithPricing: {
                title: 'Çilingir Hizmetleri Fiyatları',
                description: 'Çilingir hizmetleri fiyatları çeşitli faktörlere göre değişebilir',
                data: services.map(service => ({
                    id: service.id,
                    name: service.name,
                    minPrice: service.price.min,
                    maxPrice: service.price.max
                }))
            },
            categorySection: {
                title: 'Çilingir Hizmetleri Kategorileri',
                description: '',
                data: services.map(service => ({
                    id: service.id,
                    name: service.name,
                    slug: `sehirler/${sehir}/${ilce}/${service.slug}`
                }))
            },
            formattedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'district'
        };

        setSideMenuParams(params);
    }, [districtInfo, locksmiths, sehir, ilce]);

    // MainContent parametrelerini hazırla
    useEffect(() => {
        if (!districtInfo || !locksmiths.length) return;

        // MainContent için parametreleri ayarla
        const params = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: districtInfo.city, slug: `sehirler/bursa` },
                { id: 3, name: districtInfo.name, slug: '#' }
            ],
            mainCard: {
                title: `${districtInfo.city} ${districtInfo.name} Çilingir Anahtarcı`,
                description: districtInfo.description
            },
            locksmitList: {
                title: `${districtInfo.city} ${districtInfo.name} Çilingirler`,
                description: 'Size en yakın çilingirler aşağıda listelenmiştir. Hemen arayabilir veya mesaj gönderebilirsiniz.',
                data: locksmiths
            },
            seconCard: {
                title: `${districtInfo.name} Hakkında`,
                longDescription: districtInfo.longDescription
            },
            serviceList: {
                title: `${districtInfo.name} Çilingir Hizmetleri`,
                description: 'Aşağıdaki hizmetler bölgenizdeki çilingirler tarafından verilmektedir.',
                data: services,
                neighborhoods: districtInfo.neighborhoods.slice(0, 8),
                name: districtInfo.name
            },
            sssList: {
                title: `${districtInfo.city} ${districtInfo.name} Çilingir Hizmetleri - Sık Sorulan Sorular`,
                description: 'Çilingir hizmetleri hakkında merak edilenler',
                data: [
                    {
                        id: 1,
                        question: `${districtInfo.city} ${districtInfo.name}'de en yakın çilingir nerede?`,
                        answer: `BiÇilingir platformu sayesinde ${districtInfo.city} ${districtInfo.name} ilçesinin tüm mahallelerinde hizmet veren en yakın çilingiri bulabilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.`
                    },
                    {
                        id: 2,
                        question: `${districtInfo.city} ${districtInfo.name}'de çilingir ücretleri ne kadar?`,
                        answer: `${districtInfo.city} ${districtInfo.name} ilçesinde çilingir ücretleri genellikle 200₺ ile 800₺ arasında değişmektedir. Kapı açma işlemleri ortalama 200₺-350₺, kilit değiştirme 300₺-500₺, çelik kapı tamiri ise 400₺-800₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.`
                    },
                    {
                        id: 3,
                        question: `${districtInfo.city} ${districtInfo.name}'de gece çilingir hizmeti alabilir miyim?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name} ilçesinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.`
                    },
                    {
                        id: 4,
                        question: `${districtInfo.city} ${districtInfo.name}'de oto çilingir hizmeti var mı?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name} ilçesinde uzman oto çilingir ekiplerimiz hizmet vermektedir. Araç anahtarı kopyalama, kayıp anahtar yerine yenisini yapma, immobilizer programlama ve araç kapısı açma gibi hizmetlerimiz bulunmaktadır.`
                    }
                ]
            },
            detailedDistrictList: {
                title: `${districtInfo.city} ${districtInfo.name} Mahalleleri`,
                description: `${districtInfo.city} ${districtInfo.name} de çilingir hizmetleri verilen mahalleler`,
                data: districtInfo.neighborhoods.map((mahalle, idx) => ({
                    id: idx + 1,
                    name: `${mahalle}`,
                    slug: `sehirler/${sehir}/${ilce}/${mahalle.toLowerCase().replace(/\s+/g, '-')}`
                }))
            },
            sideMenuParams: sideMenuParams,
            formatedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'district'
        };

        setMainContentParams(params);
    }, [districtInfo, locksmiths, sideMenuParams, sehir, ilce]);

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

    if (!districtInfo || !sideMenuParams) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <p className="text-xl text-red-500">Bilgiler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {mainContentParams ? (
                        <MainContent {...mainContentParams} />
                    ) : (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-xl">İçerik yükleniyor...</p>
                        </div>
                    )}
                </div>
                <div className="lg:col-span-1 hidden md:block">
                    {sideMenuParams && <SideMenu {...sideMenuParams} />}
                </div>
            </div>
        </div>
    );
} 