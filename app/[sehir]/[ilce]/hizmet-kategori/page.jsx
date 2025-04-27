"use client";

import React, { useEffect, useState, use } from "react";
import SideMenu from '../../../../components/local/side-menu';
import { services, mockLocksmiths } from "../../../../lib/test-data";
import MainContent from '../../../../components/local/main-content';

// Hizmet kategorileri bilgileri
const serviceCategories = {
    "acil-cilingir": {
        title: "Acil Çilingir",
        description: "7/24 hizmet veren acil çilingir ekibimiz, kapınız kilitli kaldığında en hızlı şekilde yanınızda.",
        image: "/images/acil-cilingir.jpg",
        keywords: ["acil çilingir", "24 saat çilingir", "kapı açma", "kilit açma"],
        metaDescription: "7/24 acil çilingir hizmeti. Kapı açma, kilit değiştirme ve tüm anahtar işleriniz için hızlı ve güvenilir çözüm."
    },
    "oto-cilingir": {
        title: "Oto Çilingir",
        description: "Araç anahtar ve kilit sorunlarınıza profesyonel çözümler sunan oto çilingir hizmetimiz.",
        image: "/images/oto-cilingir.jpg",
        keywords: ["oto çilingir", "araba anahtarı", "immobilizer", "oto anahtar kopyalama"],
        metaDescription: "Profesyonel oto çilingir hizmeti. Araç anahtar kopyalama, immobilizer ve kilit sorunları için uzman destek."
    },
    "ev-cilingir": {
        title: "Ev Çilingir",
        description: "Ev ve işyerleriniz için özel çilingir hizmetleri, kilit değişimi ve güvenlik danışmanlığı.",
        image: "/images/ev-cilingir.jpg",
        keywords: ["ev çilingir", "konut çilingir", "ev kilit değişimi", "kapı kilidi"],
        metaDescription: "Ev ve konutlar için özel çilingir hizmeti. Kilit değişimi, güvenlik sistemleri ve danışmanlık hizmetleri."
    },
    "kasa-cilingir": {
        title: "Kasa Çilingir",
        description: "Unutulan şifreler veya arızalanan kasa kilitlerinde profesyonel müdahale ve çözüm.",
        image: "/images/kasa-cilingir.jpg",
        keywords: ["kasa çilingir", "kasa açma", "şifre unutma", "çelik kasa"],
        metaDescription: "Kasa açma ve tamir hizmetleri. Unutulan şifreler, arızalanan kilitler için profesyonel müdahale."
    },
    "724-cilingir": {
        title: "7/24 Çilingir",
        description: "Gece gündüz, tatil veya bayram demeden her an ulaşabileceğiniz çilingir hizmeti.",
        image: "/images/724-cilingir.jpg",
        keywords: ["7/24 çilingir", "gece çilingir", "kesintisiz çilingir", "her saat çilingir"],
        metaDescription: "7/24 kesintisiz çilingir hizmeti. Gece gündüz, tatil bayram demeden yanınızdayız."
    },
    "cilingir-hizmeti": {
        title: "Çilingir Hizmeti",
        description: "Her türlü anahtar, kilit ve güvenlik sistemi için genel çilingir hizmetleri.",
        image: "/images/cilingir-hizmeti.jpg",
        keywords: ["çilingir hizmeti", "anahtar yapımı", "çilingir ustası", "profesyonel çilingir"],
        metaDescription: "Genel çilingir hizmetleri. Anahtar yapımı, kilit değişimi, kapı açma ve daha fazlası için bizi arayın."
    }
};

export default function DistrictServicePage({ params }) {
    // Promise olarak gelen params'ı use() ile çözümlüyoruz
    const resolvedParams = use(params);

    // Artık çözümlenmiş params'tan özellikleri alabiliriz
    const { sehir, ilce, "hizmet-kategori": hizmetKategori } = resolvedParams;
    const [loading, setLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState([]);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [districtInfo, setDistrictInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);

    // API'den veri çekme simülasyonu
    const fetchData = async () => {
        try {
            setLoading(true);
            // API çağrısını simüle ediyoruz
            await new Promise(resolve => setTimeout(resolve, 500));

            // İlçe bilgilerini getir
            const districtData = {
                name: ilce.charAt(0).toUpperCase() + ilce.slice(1),
                city: sehir.charAt(0).toUpperCase() + sehir.slice(1),
                description: `${sehir.charAt(0).toUpperCase() + sehir.slice(1)} ${ilce.charAt(0).toUpperCase() + ilce.slice(1)} ilçesi için çilingir hizmetleri. Kapınızda kaldığınızda, anahtarınızı kaybettiğinizde veya acil durumlar için profesyonel çilingirlerimiz hizmetinizdedir.`,
                neighborhoods: ['Adalet', 'Ahmetbey', 'Ahmetpaşa', 'Akpınar', 'Aksungur', 'Aktarhüssam', 'Alaaddin', 'Alacahırka', 'Alacamescit'],
                location: { lat: 40.1885, lng: 29.0610 }
            };

            // Hizmet kategorisi bilgilerini al veya varsayılanları kullan
            const serviceCategoryData = serviceCategories[hizmetKategori] || {
                title: hizmetKategori.replace(/-/g, " ").split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                description: "Profesyonel çilingir hizmetleri",
                image: "/images/default-service.jpg",
                keywords: ["çilingir", "anahtar", "kilit"],
                metaDescription: `${districtData.city} ${districtData.name} bölgesinde profesyonel çilingir hizmetleri.`
            };

            setDistrictInfo(districtData);
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
    }, [sehir, ilce, hizmetKategori]);

    // SideMenu parametrelerini hazırla
    useEffect(() => {
        if (!districtInfo || !locksmiths.length || !serviceInfo) return;

        // SideMenu için parametreleri ayarla
        const params = {
            map: {
                locksmithPositions: locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })),
                mapCenter: districtInfo.location || { lat: 40.2139, lng: 29.0606 }
            },
            nearbySection: {
                title: 'Mahalleler',
                description: `${districtInfo.city} ${districtInfo.name} ilçesindeki mahalleler`,
                data: (districtInfo.neighborhoods || []).slice(0, 10).map((neighborhood, idx) => ({
                    id: idx + 1,
                    name: neighborhood,
                    slug: `sehirler/${sehir}/${ilce}/${neighborhood.toLowerCase().replace(/\s+/g, '-')}`
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
                    slug: `sehirler/${sehir}/${ilce}/${service.slug}`
                }))
            },
            formattedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'service',
            currentService: serviceInfo.title
        };

        setSideMenuParams(params);
    }, [districtInfo, locksmiths, serviceInfo, sehir, ilce, hizmetKategori]);

    // MainContent parametrelerini hazırla
    useEffect(() => {
        if (!districtInfo || !locksmiths.length || !serviceInfo || !sideMenuParams) return;

        // MainContent için parametreleri ayarla
        const params = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: districtInfo.city, slug: `sehirler/${sehir}` },
                { id: 3, name: districtInfo.name, slug: `sehirler/${sehir}/${ilce}` },
                { id: 4, name: serviceInfo.title, slug: '#' }
            ],
            mainCard: {
                title: `${districtInfo.city} ${districtInfo.name} ${serviceInfo.title}`,
                description: `${districtInfo.city} ${districtInfo.name} için ${serviceInfo.title.toLowerCase()} hizmetleri. ${serviceInfo.description}`
            },
            locksmitList: {
                title: `${districtInfo.city} ${districtInfo.name} ${serviceInfo.title} Hizmeti Veren Çilingirler`,
                description: 'Aşağıdaki çilingirler bu hizmeti vermektedir',
                data: locksmiths
            },
            seconCard: {
                title: `${districtInfo.city} ${districtInfo.name} ${serviceInfo.title} Hakkında`,
                longDescription: `${districtInfo.city} ${districtInfo.name} bölgesinde ${serviceInfo.title.toLowerCase()} hizmetleri sunan profesyonel çilingirlerimiz, modern ekipmanlar ve uzun yılların verdiği tecrübe ile hizmetinizdedir. ${serviceInfo.description} Günün her saati ulaşabileceğiniz ekiplerimiz, en kısa sürede kapınızda olacak ve sorununuzu çözecektir.`
            },
            neighborhoodServiceList: {
                title: `${districtInfo.city} ${districtInfo.name} Mahallelerinde ${serviceInfo.title} Hizmeti`,
                description: `${districtInfo.city} ${districtInfo.name} ilçesindeki tüm mahallelerde profesyonel ${serviceInfo.title.toLowerCase()} hizmeti sunuyoruz.`,
                data: districtInfo.neighborhoods.slice(0, 8).map((neighborhood, idx) => ({
                    id: idx + 1,
                    name: `${neighborhood} ${serviceInfo.title}`,
                    slug: `sehirler/${sehir}/${ilce}/${neighborhood.toLowerCase().replace(/\s+/g, '-')}/${hizmetKategori}`
                }))
            },
            sssList: {
                title: `${districtInfo.city} ${districtInfo.name} ${serviceInfo.title} - Sık Sorulan Sorular`,
                description: `${districtInfo.city} ${districtInfo.name} bölgesinde ${serviceInfo.title.toLowerCase()} hizmeti ile ilgili sık sorulan sorular`,
                data: [
                    {
                        id: 1,
                        question: `${districtInfo.city} ${districtInfo.name}'de ${serviceInfo.title.toLowerCase()} hizmeti ne kadar sürede verilir?`,
                        answer: `${districtInfo.city} ${districtInfo.name} bölgesindeki ${serviceInfo.title.toLowerCase()} hizmetimiz, çağrı aldıktan sonra ortalama 15-30 dakika içerisinde adresinize ulaşır. Mesafeye ve trafik durumuna göre bu süre değişiklik gösterebilir.`
                    },
                    {
                        id: 2,
                        question: `${districtInfo.city} ${districtInfo.name}'de ${serviceInfo.title.toLowerCase()} fiyatları ne kadar?`,
                        answer: `${districtInfo.city} ${districtInfo.name} bölgesinde ${serviceInfo.title.toLowerCase()} hizmeti fiyatları 200₺ ile 800₺ arasında değişmektedir. Hizmet türüne, kapı ve kilit tipine göre fiyatlandırma yapılmaktadır. Kesin fiyat bilgisi için lütfen arayınız.`
                    },
                    {
                        id: 3,
                        question: `${districtInfo.city} ${districtInfo.name}'de gece ${serviceInfo.title.toLowerCase()} hizmeti var mı?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name} bölgesinde 7/24 kesintisiz ${serviceInfo.title.toLowerCase()} hizmeti sunmaktayız. Gece saatlerinde, hafta sonları ve resmi tatillerde de hizmet vermekteyiz.`
                    },
                    {
                        id: 4,
                        question: `${districtInfo.city} ${districtInfo.name}'de hangi marka kilitler için ${serviceInfo.title.toLowerCase()} hizmeti alınabilir?`,
                        answer: `${districtInfo.city} ${districtInfo.name} bölgesindeki çilingirlerimiz Kale, Yale, Mul-T-Lock, Atra, Kısacık, Özak ve daha birçok yerli ve yabancı marka kilit için profesyonel hizmet sunmaktadır.`
                    },
                ]
            },
            sideMenuParams: sideMenuParams,
            formatedName: `${districtInfo.city} ${districtInfo.name} ${serviceInfo.title}`,
            type: 'district-service'
        };

        setMainContentParams(params);
    }, [districtInfo, locksmiths, serviceInfo, sideMenuParams, sehir, ilce, hizmetKategori]);

    if (loading) {
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
                    <MainContent {...mainContentParams} />
                </div>

                <div className="lg:col-span-1">
                    <SideMenu {...sideMenuParams} />
                </div>
            </div>
        </div>
    );
} 