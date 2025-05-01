"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { services } from '../../lib/test-data';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

export default function NeighborhoodPageClient({ city, district, neighborhood, locksmiths: initialLocksmiths = [] }) {
    // params kontrolü 
    // const data = JSON.parse(params.value);

    if (!city || !district || !neighborhood) {
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

    // const { city, district, neighborhood } = data;
    const [isLoading, setIsLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState(initialLocksmiths);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);

    // API'den veri çekme işlemi (simüle edilmiş)
    const fetchData = async () => {
        try {
            setIsLoading(true);
            // Gerçek API çağrısını simüle ediyoruz
            // const response = await fetch(`/api/neighborhood/${city}/${district}/${neighborhood}`);
            // const data = await response.json();

            // API çağrısı yerine timeout ile simülasyon
            await new Promise(resolve => setTimeout(resolve, 1000));

            const formattedMahalle = neighborhood.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const formattedIlce = district.charAt(0).toUpperCase() + district.slice(1);
            const formattedSehir = city.charAt(0).toUpperCase() + city.slice(1);

            const neighborhoodData = {
                id: 1,
                name: formattedMahalle,
                district: formattedIlce,
                city: formattedSehir,
                description: `${formattedMahalle} mahallesi, ${formattedIlce}, ${formattedSehir} bölgesinde 7/24 çilingir hizmetleri. Kapı açma, çilingir, anahtar kopyalama ve diğer çilingir hizmetleri için hemen arayın.`,
                longDescription: `Bi Çilingir olarak, ${formattedMahalle} mahallesi sakinlerini güvenilir, ekonomik ve hızlı çilingir hizmeti sunan profesyonellerle buluşturuyoruz. Kendimiz doğrudan çilingir hizmeti vermiyoruz; bunun yerine, bulunduğunuz bölgedeki en yakın ve en güvenilir çilingirleri tek bir platformda sizin için listeliyoruz. Böylece acil bir durumda zaman kaybetmeden iletişime geçebileceğiniz uzmanlara kolayca ulaşmanızı sağlıyoruz.\n\n
                Kapınız kilitli kaldıysa, anahtarınızı kaybettiyseniz ya da kilit değişimi yaptırmak istiyorsanız, ${formattedMahalle}'ndeki çilingirleri hemen inceleyebilir, size en uygun olanla doğrudan iletişime geçebilirsiniz. Tüm çilingirler, kullanıcı yorumları ve hizmet detaylarıyla birlikte sayfamızda yer alır; bu sayede güvenli ve bilinçli bir seçim yapabilirsiniz.\n\n
                Platformumuzda listelenen çilingirlerin çoğu 7/24 hizmet sunmaktadır. Gece ya da gündüz fark etmeksizin, dakikalar içinde destek alabileceğiniz profesyonellere ulaşmak artık çok kolay. Bi Çilingir, kaliteli hizmete erişimi kolaylaştırır; uygun fiyatlı ve güvenilir çözümler sunan çilingirleri bir araya getirir.\n\n
                ${formattedMahalle} için en yakın çilingirleri şimdi keşfedin ve ihtiyacınıza en uygun ustayla hemen iletişime geçin!`,
                location: { lat: 40.1880, lng: 29.0610 }, // Mahalle için örnek koordinat
                emergencyPhone: "+90 850 123 4567",
                nearbyStreets: [
                    { id: 1, name: 'Atatürk Caddesi', slug: 'ataturk-caddesi' },
                    { id: 2, name: 'İstiklal Sokak', slug: 'istiklal-sokak' },
                    { id: 3, name: 'Cumhuriyet Bulvarı', slug: 'cumhuriyet-bulvari' },
                    { id: 4, name: 'Kurtuluş Caddesi', slug: 'kurtulus-caddesi' },
                    { id: 5, name: 'Fatih Sokak', slug: 'fatih-sokak' }
                ],
                nearbyNeighborhoods: [
                    { id: 1, name: 'Merkez', slug: 'merkez' },
                    { id: 2, name: 'Yenimahalle', slug: 'yenimahalle' },
                    { id: 3, name: 'Atatürk', slug: 'ataturk' },
                    { id: 4, name: 'Cumhuriyet', slug: 'cumhuriyet' },
                    { id: 5, name: 'Fatih', slug: 'fatih' }
                ]
            };

            setNeighborhoodInfo(neighborhoodData);
            setIsLoading(false);
        } catch (error) {
            console.error('Veri yüklenirken hata oluştu:', error);
            setIsLoading(false);
        }
    };

    // Sayfa yüklendiğinde veri çek
    useEffect(() => {
        fetchData();
    }, [city, district, neighborhood]);

    // SideMenu parametrelerini hazırla
    useEffect(() => {
        if (!neighborhoodInfo || !locksmiths.length) return;

        // SideMenu için parametreleri ayarla
        const params = {
            map: {
                locksmithPositions: locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })),
                mapCenter: neighborhoodInfo.location
            },
            nearbySection: {
                title: 'Yakındaki Mahalleler',
                description: `${neighborhoodInfo.city} ${neighborhoodInfo.district} yakınındaki mahalleler`,
                data: neighborhoodInfo.nearbyNeighborhoods.map(neighborhood => ({
                    id: neighborhood.id,
                    name: neighborhood.name,
                    slug: `sehirler/${city}/${district}/${neighborhood.slug}`
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
                title: `${neighborhoodInfo.name} Çilingir Hizmetleri`,
                description: '',
                data: services.map(service => ({
                    id: service.id,
                    name: service.name,
                    slug: `sehirler/${city}/${district}/${neighborhood}/${service.slug}`
                }))
            },
            formattedName: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}`,
            type: 'neighborhood'
        };

        setSideMenuParams(params);
    }, [neighborhoodInfo, locksmiths, city, district, neighborhood]);

    // MainContent parametrelerini hazırla
    useEffect(() => {
        if (!neighborhoodInfo || !locksmiths.length || !sideMenuParams) return;

        // MainContent için parametreleri ayarla
        const params = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: neighborhoodInfo.city, slug: `${neighborhoodInfo.city.toLowerCase().replace(/\s+/g, '-')}` },
                { id: 3, name: neighborhoodInfo.district, slug: `${neighborhoodInfo.city.toLowerCase().replace(/\s+/g, '-')}/${neighborhoodInfo.district.toLowerCase().replace(/\s+/g, '-')}` },
                { id: 4, name: neighborhoodInfo.name, slug: '#' }
            ],
            mainCard: {
                title: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} Çilingir`,
                description: neighborhoodInfo.description
            },
            locksmitList: {
                title: `${neighborhoodInfo.name} Mahallesi Çilingirler`,
                description: 'Size en yakın ve en uygun çilingirler aşağıda listelenmiştir. Hemen arayabilir veya mesaj gönderebilirsiniz.',
                data: locksmiths
            },
            seconCard: {
                title: `${neighborhoodInfo.name} Mahallesi Hakkında`,
                longDescription: neighborhoodInfo.longDescription
            },
            serviceList: {
                title: `${neighborhoodInfo.name} Çilingir Hizmetleri`,
                description: 'Mahallenizde sunulan çilingir hizmetleri',
                data: services,
                name: neighborhoodInfo.name
            },
            sssList: {
                title: `${neighborhoodInfo.name} Mahallesi Çilingir - Sık Sorulan Sorular`,
                description: 'Çilingir hizmetleri hakkında merak edilenler',
                data: [
                    {
                        id: 1,
                        question: `${neighborhoodInfo.name}'de en yakın çilingir nerede?`,
                        answer: `BiÇilingir platformu sayesinde ${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} mahallesinde hizmet veren en yakın çilingiri bulabilirsiniz. Konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.`
                    },
                    {
                        id: 2,
                        question: `${neighborhoodInfo.name}'de çilingir ücretleri ne kadar?`,
                        answer: `${neighborhoodInfo.name} mahallesinde çilingir ücretleri genellikle hizmet türüne göre değişiklik gösterir. Kapı açma işlemleri ortalama 200₺-350₺, kilit değiştirme 300₺-500₺, çelik kapı tamiri ise 400₺-800₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.`
                    },
                    {
                        id: 3,
                        question: `${neighborhoodInfo.name}'de gece çilingir hizmeti alabilir miyim?`,
                        answer: `Evet, ${neighborhoodInfo.name} mahallesinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.`
                    },
                    {
                        id: 4,
                        question: `${neighborhoodInfo.name}'de hangi çilingir hizmetleri verilmektedir?`,
                        answer: `${neighborhoodInfo.name} mahallesinde kapı açma, kilit değiştirme, anahtar kopyalama, çelik kapı tamiri, kasa açma, oto çilingir ve daha birçok çilingir hizmeti verilmektedir. Platformumuzda listelenen çilingirler ile ihtiyacınız olan tüm hizmetlere ulaşabilirsiniz.`
                    }
                ]
            },
            detailedDistrictList: {
                title: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} Çevresindeki Sokaklar`,
                description: `${neighborhoodInfo.name} mahallesinde çilingir hizmeti verilen yakın bölgeler`,
                data: neighborhoodInfo.nearbyStreets.map(street => ({
                    id: street.id,
                    name: street.name,
                    slug: `sehirler/${city}/${district}/${neighborhood}/${street.slug}`
                }))
            },
            sideMenuParams: sideMenuParams,
            formatedName: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}`,
            type: 'neighborhood'
        };


        setMainContentParams(params);
    }, [neighborhoodInfo, locksmiths, sideMenuParams, city, district, neighborhood]);

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

    if (!neighborhoodInfo || !sideMenuParams) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <p className="text-xl text-red-500">Bilgiler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</p>
                    <Button className="mt-4" onClick={fetchData} variant="outline">
                        Tekrar Dene
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    {mainContentParams ? (
                        <MainContent {...mainContentParams} />
                    ) : (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-xl">İçerik yükleniyor...</p>
                        </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    {/* SideMenu - sadece masaüstü görünümde */}
                    <div className="hidden md:block">
                        {sideMenuParams && <SideMenu {...sideMenuParams} />}
                    </div>
                </div>
            </div>
        </div>
    );
} 