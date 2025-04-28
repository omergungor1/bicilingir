"use client";

import React, { useEffect, useState, use } from "react";
import { Button } from "../ui/button";
import SideMenu from '../local/side-menu';
import { services, mockLocksmiths } from "../../lib/test-data";
import MainContent from '../local/main-content';


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

export default function ServicePage({ city, district, neighborhood, serviceType }) {
    // Promise olarak gelen params'ı use() ile çözümlüyoruz
    // const resolvedParams = use(params);

    // Artık çözümlenmiş params'tan özellikleri alabiliriz
    // const { city, district, neighborhood, serviceType } = resolvedParams;
    const [loading, setLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState([]);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);

    // API'den veri çekme simülasyonu
    const fetchData = async () => {
        try {
            setLoading(true);
            // API çağrısını simüle ediyoruz
            // const response = await fetch(`/api/neighborhood/${city}/${district}/${neighborhood}/${serviceType}`);
            // const data = await response.json();

            // Veri çekme simülasyonu
            await new Promise(resolve => setTimeout(resolve, 500));

            // neighborhood bilgilerini al veya varsayılanları kullan
            const neighborhoodData = neighborhoods[neighborhood] || {
                name: neighborhood?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || '',
                description: `${city} ${district} bölgesindeki ${neighborhood || ''} mahallesi için çilingir hizmetleri.`,
                landmarks: [],
                transportation: "",
                mapUrl: "",
                location: { lat: 40.1880, lng: 29.0610 },
                nearbyNeighborhoods: [
                    { id: 1, name: 'Merkez', slug: 'merkez' },
                    { id: 2, name: 'Yenimahalle', slug: 'yenimahalle' },
                    { id: 3, name: 'Atatürk', slug: 'ataturk' },
                    { id: 4, name: 'Cumhuriyet', slug: 'cumhuriyet' },
                    { id: 5, name: 'Fatih', slug: 'fatih' }
                ]
            };

            // Hizmet kategorisi bilgilerini al veya varsayılanları kullan
            const serviceCategoryData = serviceType && serviceCategories[serviceType] ? serviceCategories[serviceType] : {
                title: serviceType ? serviceType.replace(/-/g, " ").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Çilingir Hizmetleri",
                description: "Profesyonel çilingir hizmetleri",
                image: "/images/default-service.jpg",
                keywords: ["çilingir", "anahtar", "kilit"],
                metaDescription: `${city || ''} ${district || ''} ${neighborhoodData.name} bölgesinde profesyonel çilingir hizmetleri.`
            };

            setNeighborhoodInfo({
                ...neighborhoodData,
                city: city ? city.charAt(0).toUpperCase() + city.slice(1) : '',
                district: district ? district.charAt(0).toUpperCase() + district.slice(1) : ''
            });

            setServiceInfo(serviceCategoryData);
            setLocksmiths(mockLocksmiths);
            setLoading(false);
        } catch (error) {
            console.error('Veri yüklenirken hata oluştu:', error);
            setLoading(false);
        }
    };

    // Sayfa yüklendiğinde veri çek
    useEffect(() => {
        fetchData();
    }, [city, district, neighborhood, serviceType]);

    // SideMenu parametrelerini hazırla
    useEffect(() => {
        if (!neighborhoodInfo || !locksmiths.length || !serviceInfo) return;

        // SideMenu için parametreleri ayarla
        const params = {
            map: {
                locksmithPositions: locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })),
                mapCenter: neighborhoodInfo.location || { lat: 40.2139, lng: 29.0606 }
            },
            nearbySection: {
                title: 'Yakındaki Mahalleler',
                description: `${neighborhoodInfo.city} ${neighborhoodInfo.district} yakınındaki mahalleler`,
                data: (neighborhoodInfo.nearbyNeighborhoods || []).map(neighborhood => ({
                    id: neighborhood.id,
                    name: neighborhood.name,
                    slug: `${city}/${district}/${neighborhood.slug}`
                }))
            },
            locksmithPricing: {
                title: `${serviceInfo.title} Fiyatları`,
                description: 'Hizmet türüne ve saate göre fiyatlar değişebilir',
                data: services.map(service => ({
                    id: service.id,
                    name: service.name,
                    minPrice: service.price.min,
                    maxPrice: service.price.max
                }))
            },
            categorySection: {
                title: 'Çilingir Hizmetleri',
                description: '',
                data: services.map(service => ({
                    id: service.id,
                    name: service.name,
                    slug: neighborhood ? `${city}/${district}/${neighborhood}/${service.slug}` :
                        district ? `${city}/${district}/${service.slug}` :
                            city ? `${city}/${service.slug}` : `/${service.slug}`
                }))
            },
            formattedName: neighborhood ?
                `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}` :
                district ? `${neighborhoodInfo.city} ${neighborhoodInfo.district}` :
                    city ? `${neighborhoodInfo.city}` : 'Türkiye',
            type: 'service',
            currentService: serviceInfo.title
        };

        setSideMenuParams(params);
    }, [neighborhoodInfo, locksmiths, serviceInfo, city, district, neighborhood, serviceType]);

    // MainContent parametrelerini hazırla
    useEffect(() => {
        if (!neighborhoodInfo || !locksmiths.length || !serviceInfo || !sideMenuParams) return;

        // Breadcrumb için navigasyon listesi
        const navbarItems = [
            { id: 1, name: 'Ana Sayfa', slug: '/' },
            // { id: 2, name: city, slug: `${city.toLowerCase().replace(/\s+/g, '-')}` },
            // { id: 3, name: district, slug: `${city.toLowerCase().replace(/\s+/g, '-')}/${district.toLowerCase().replace(/\s+/g, '-')}` },
            // { id: 4, name: neighborhood, slug: `${city.toLowerCase().replace(/\s+/g, '-')}/${district.toLowerCase().replace(/\s+/g, '-')}/${neighborhood.toLowerCase().replace(/\s+/g, '-')}` }
        ];

        if (city) navbarItems.push({ id: 2, name: neighborhoodInfo.city, slug: `/${city}` });
        if (district) navbarItems.push({ id: 3, name: neighborhoodInfo.district, slug: `/${city}/${district}` });
        if (neighborhood) navbarItems.push({ id: 4, name: neighborhoodInfo.name, slug: `/${city}/${district}/${neighborhood}` });
        if (serviceType) navbarItems.push({ id: 5, name: serviceInfo.title, slug: '#' });

        // Bölge adı oluşturma
        const locationName = neighborhood ?
            `${neighborhoodInfo.name} Mahallesi` :
            district ? `${neighborhoodInfo.district}` :
                city ? `${neighborhoodInfo.city}` : 'Türkiye';

        // Başlık oluşturma
        const titlePrefix = neighborhood ?
            `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}` :
            district ? `${neighborhoodInfo.city} ${neighborhoodInfo.district}` :
                city ? `${neighborhoodInfo.city}` : 'Türkiye';

        // MainContent için parametreleri ayarla
        const params = {
            navbarList: navbarItems,
            mainCard: {
                title: `${titlePrefix} ${serviceInfo.title}`,
                description: `${locationName} için ${serviceInfo.title.toLowerCase()} hizmetleri. ${serviceInfo.description}`
            },
            locksmitList: {
                title: `${locationName} ${serviceInfo.title} Hizmeti Veren Çilingirler`,
                description: 'Size en yakın ve en uygun çilingirler aşağıda listelenmiştir. Hemen arayabilir veya mesaj gönderebilirsiniz.',
                data: locksmiths
            },
            seconCard: {
                title: `${serviceInfo.title} Hizmeti Hakkında`,
                longDescription: `${serviceInfo.description}\n\n${locationName} sakinleri için ${serviceInfo.title.toLowerCase()} hizmetleri en hızlı ve kaliteli şekilde sunulmaktadır. Profesyonel ekiplerimiz, en son teknoloji ekipmanlarla donatılmış olarak hizmetinizdedir.\n\nAcil durumlarda, kilitli kalan kapılarınız, kayıp anahtarlarınız veya güvenlik sistemleriniz için anında müdahale edebilecek çilingir ustalarımız 7/24 hizmetinizdedir. Makul fiyatlar ve güvenilir hizmet anlayışımızla ${titlePrefix} bölgesinin tamamında hizmet vermekteyiz.`
            },
            serviceList: {
                title: `${locationName} Çilingir Hizmetleri`,
                description: 'Bölgenizde sunulan diğer çilingir hizmetleri',
                data: services.filter(service => service.slug !== serviceType),
                name: locationName
            },
            sssList: {
                title: `${locationName} ${serviceInfo.title} - Sık Sorulan Sorular`,
                description: `${serviceInfo.title} hizmeti hakkında merak edilenler`,
                data: [
                    {
                        id: 1,
                        question: `${locationName}'de ${serviceInfo.title} hizmeti ne kadar sürer?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti genellikle 15-45 dakika içinde tamamlanmaktadır. Ancak bu süre, hizmetin karmaşıklığına ve aciliyetine göre değişebilir.`
                    },
                    {
                        id: 2,
                        question: `${locationName}'de ${serviceInfo.title} fiyatları ne kadar?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmet fiyatları ortalama 200₺ ile 800₺ arasında değişmektedir. Hizmet türü, saat ve gerekli malzemelere göre fiyat değişiklik gösterebilir. Net fiyat bilgisi için çilingir ile iletişime geçmenizi öneririz.`
                    },
                    {
                        id: 3,
                        question: `${serviceInfo.title} hizmeti için ne kadar beklemem gerekir?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti için bekleme süresi genellikle 15-30 dakikadır. Acil durumlarda, çilingir ekiplerimiz en kısa sürede yanınızda olacaktır.`
                    },
                    {
                        id: 4,
                        question: `${serviceInfo.title} hizmeti için hangi ödeme yöntemlerini kabul ediyorsunuz?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti sunan çilingirlerimiz genellikle nakit, kredi kartı ve banka havalesi gibi çeşitli ödeme yöntemlerini kabul etmektedir. Ödeme yöntemi konusunda çilingir ustası ile önceden görüşmenizi öneririz.`
                    }
                ]
            },
            sideMenuParams: sideMenuParams,
            formatedName: titlePrefix,
            type: 'service-detail',
            serviceInfo: serviceInfo
        };

        setMainContentParams(params);
    }, [neighborhoodInfo, locksmiths, serviceInfo, sideMenuParams, city, district, neighborhood, serviceType]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (!neighborhoodInfo || !serviceInfo || !sideMenuParams) {
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

    // Sayfa başlığı
    const locationText = neighborhood ?
        `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}` :
        district ? `${neighborhoodInfo.city} ${neighborhoodInfo.district}` :
            city ? `${neighborhoodInfo.city}` : 'Türkiye';

    const pageTitle = `${locationText} ${serviceInfo.title} - 7/24 Hizmet`;

    // Meta açıklama
    const metaDescription = serviceInfo.metaDescription ||
        `${locationText} bölgesinde profesyonel ${serviceInfo.title.toLowerCase()} hizmetleri. 7/24 hizmet, uygun fiyat.`;

    // Canonical URL
    const canonicalUrl = neighborhood ?
        `https://bicilingir.com/${city}/${district}/${neighborhood}/${serviceType || ''}` :
        district ? `https://bicilingir.com/${city}/${district}/${serviceType || ''}` :
            city ? `https://bicilingir.com/${city}/${serviceType || ''}` :
                `https://bicilingir.com/${serviceType || ''}`;

    // Yerelleştirilmiş anahtar kelimeler
    const localKeywords = serviceInfo.keywords ? serviceInfo.keywords.map(keyword =>
        `${neighborhoodInfo.name || neighborhoodInfo.district || neighborhoodInfo.city || 'Türkiye'} ${keyword}`
    ) : [];

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
                            "name": `BiÇilingir - ${serviceInfo.title}`,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": neighborhoodInfo.district || '',
                                "addressRegion": neighborhoodInfo.city || '',
                                "streetAddress": neighborhoodInfo.name || ''
                            },
                            "telephone": "+905001234567",
                            "geo": {
                                "@type": "GeoCoordinates",
                                "latitude": "40.2139",
                                "longitude": "29.0606"
                            },
                            "url": canonicalUrl,
                            "description": metaDescription,
                            "image": serviceInfo.image,
                            "priceRange": "₺₺",
                            "openingHours": "Mo-Su 00:00-23:59"
                        })
                    }}
                />

                {/* Ana içerik */}
                <main className="flex-grow container mx-auto px-4 py-4">

                    {/* Ana içerik bölümü */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sol sütun - Ana içerik */}
                        <div className="lg:col-span-2">
                            {mainContentParams ? (
                                <MainContent {...mainContentParams} />
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
                                    <p className="mt-4 text-gray-600">İçerik yükleniyor...</p>
                                </div>
                            )}

                            {/* Mobil görünüm için SideMenu */}
                            <div className="md:hidden">
                                {sideMenuParams && <SideMenu {...sideMenuParams} />}
                            </div>
                        </div>

                        {/* Sağ sütun - İletişim ve Harita */}
                        <div className="lg:col-span-1">
                            {/* SideMenu - sadece masaüstü görünümde */}
                            <div className="hidden md:block">
                                {sideMenuParams && <SideMenu {...sideMenuParams} />}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
} 