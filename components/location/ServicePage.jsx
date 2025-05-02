"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';
import { getSupabaseClient } from "../../lib/supabase";

// Supabase client oluştur
const createSupabaseClient = () => {
    return getSupabaseClient();
};

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
        description: "7/24 hizmet veren çilingirler, kapınız kilitli kaldığında veya tüm acil durumlarda en hızlı şekilde yanınızda.",
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

export default function ServicePage({ data }) {
    const { citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, locksmiths: locksmithsList } = data;

    const [loading, setLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState(locksmithsList);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);
    const [error, setError] = useState(null);
    const [servicesList, setServicesList] = useState([]);
    const [cityData, setCityData] = useState(null);
    const [districtData, setDistrictData] = useState(null);
    const [neighborhoodData, setNeighborhoodData] = useState(null);

    // API'den veri çekme
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Supabase client
            const supabase = createSupabaseClient();

            // Hizmet türünü çek
            const { data: serviceData, error: serviceError } = await supabase
                .from('services')
                .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
                .eq('slug', servicetypeSlug)
                .eq('isActive', true)
                .single();

            if (serviceError) {
                console.error('Hizmet bilgisi alınamadı:', serviceError);
                setError('Hizmet bilgisi bulunamadı');
                setLoading(false);
                return;
            }

            // Tüm servis türlerini çek
            const { data: allServices, error: allServicesError } = await supabase
                .from('services')
                .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
                .eq('isActive', true);

            if (allServicesError) {
                console.error('Tüm hizmetler alınamadı:', allServicesError);
            } else {
                setServicesList(allServices || []);
            }

            let cityInfo = null;
            let districtInfo = null;
            let neighborhoodInfo = null;
            let location = { lat: 40.1880, lng: 29.0610 }; // Varsayılan konum
            let formattedName = 'Türkiye';

            // Şehir bilgisi varsa çek
            if (citySlug) {
                const { data: city, error: cityError } = await supabase
                    .from('provinces')
                    .select('id, name, lat, lng')
                    .eq('slug', citySlug)
                    .single();

                if (cityError) {
                    console.error('Şehir bilgisi alınamadı:', cityError);
                } else {
                    cityInfo = city;
                    location = { lat: city.lat, lng: city.lng };
                    formattedName = city.name;
                    setCityData(city);
                }

                // İlçe bilgisi varsa çek
                if (districtSlug && cityInfo) {
                    const { data: district, error: districtError } = await supabase
                        .from('districts')
                        .select('id, name, lat, lng')
                        .eq('slug', districtSlug)
                        .eq('province_id', cityInfo.id)
                        .single();

                    if (districtError) {
                        console.error('İlçe bilgisi alınamadı:', districtError);
                    } else {
                        districtInfo = district;
                        location = { lat: district.lat, lng: district.lng };
                        formattedName = `${cityInfo.name} ${district.name}`;
                        setDistrictData(district);
                    }

                    // Mahalle bilgisi varsa çek
                    if (neighborhoodSlug && districtInfo) {
                        const { data: neighborhood, error: neighborhoodError } = await supabase
                            .from('neighborhoods')
                            .select('id, name, slug')
                            .eq('slug', neighborhoodSlug)
                            .eq('district_id', districtInfo.id)
                            .single();

                        if (neighborhoodError) {
                            console.error('Mahalle bilgisi alınamadı:', neighborhoodError);
                        } else {
                            neighborhoodInfo = neighborhood;
                            formattedName = `${cityInfo.name} ${districtInfo.name} ${neighborhood.name}`;
                            setNeighborhoodData(neighborhood);
                        }

                        // Yakındaki mahalleler
                        if (neighborhoodInfo) {
                            const { data: nearbyNeighborhoods, error: nearbyError } = await supabase
                                .from('neighborhoods')
                                .select('id, name, slug')
                                .eq('district_id', districtInfo.id)
                                .neq('id', neighborhoodInfo.id)
                                .order('name')
                                .limit(10);

                            if (!nearbyError) {
                                neighborhoodInfo.nearbyNeighborhoods = nearbyNeighborhoods;
                            }
                        }
                    }
                }
            }

            // Hizmet bilgilerini ayarla
            const serviceInfoData = {
                id: serviceData.id,
                title: serviceData.name,
                description: serviceData.description,
                slug: serviceData.slug,
                prices: {
                    mesai: { min: serviceData.minPriceMesai, max: serviceData.maxPriceMesai },
                    aksam: { min: serviceData.minPriceAksam, max: serviceData.maxPriceAksam },
                    gece: { min: serviceData.minPriceGece, max: serviceData.maxPriceGece }
                },
                keywords: [serviceData.name, "çilingir", "anahtar", "kilit"],
                metaDescription: `${formattedName} ${serviceData.name} hizmetleri. 7/24 profesyonel çilingir desteği.`
            };

            // Bölge bilgilerini ayarla
            const locationInfoData = {
                city: cityInfo ? cityInfo.name : null,
                district: districtInfo ? districtInfo.name : null,
                name: neighborhoodInfo ? neighborhoodInfo.name : null,
                location: location,
                description: `${formattedName} ${serviceData.name} hizmetleri. Kapı açma, çilingir ve diğer tüm anahtar işleri için profesyonel ekiplerimiz 7/24 hizmetinizde.`,
                longDescription: `${formattedName} bölgesinde ${serviceData.name.toLowerCase()} hizmetleri, alanında uzman çilingir ekiplerimiz tarafından en kaliteli ve hızlı şekilde sunulmaktadır. Modern ekipmanlarla donatılmış profesyonel ustalarımız, acil durumlarınızda anında yanınızda olacaktır.\n\nKapı açma, kilit değiştirme, anahtar kopyalama ve diğer tüm çilingir işleriniz için güvenilir ve ekonomik çözümler sunuyoruz. ${formattedName} ve çevresinde kesintisiz olarak hizmet vermekteyiz.`,
                nearbyNeighborhoods: neighborhoodInfo ? neighborhoodInfo.nearbyNeighborhoods || [] : []
            };

            setServiceInfo(serviceInfoData);
            setNeighborhoodInfo(locationInfoData);
            setLoading(false);
        } catch (error) {
            console.error('Veri yüklenirken hata oluştu:', error);
            setError('Veri yüklenirken bir hata oluştu');
            setLoading(false);
        }
    };

    // Sayfa yüklendiğinde veri çek
    useEffect(() => {
        fetchData();
    }, [citySlug, districtSlug, neighborhoodSlug, servicetypeSlug]);

    // SideMenu ve MainContent parametrelerini hazırla
    useEffect(() => {
        if (!neighborhoodInfo || !serviceInfo) return;

        // Detaylı konum stringi oluştur
        const locationName = neighborhoodInfo.name ?
            `${neighborhoodInfo.name} Mahallesi` :
            neighborhoodInfo.district ? neighborhoodInfo.district :
                neighborhoodInfo.city ? neighborhoodInfo.city : 'Türkiye';

        // Sayfa başlığı için tam konum adı
        const titlePrefix = neighborhoodInfo.name ?
            `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}` :
            neighborhoodInfo.district ? `${neighborhoodInfo.city} ${neighborhoodInfo.district}` :
                neighborhoodInfo.city ? neighborhoodInfo.city : 'Türkiye';

        // SideMenu için parametreleri ayarla
        const sideMenuParamsData = {
            map: {
                locksmithPositions: locksmiths.length > 0 ? locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })) : [],
                mapCenter: neighborhoodInfo.location
            },
            nearbySection: {
                title: 'Yakındaki Mahalleler',
                description: `${titlePrefix} yakınındaki mahalleler`,
                data: neighborhoodInfo.nearbyNeighborhoods.map(neighborhood => ({
                    id: neighborhood.id,
                    name: neighborhood.name,
                    slug: `${citySlug}/${districtSlug}/${neighborhood.slug}/${servicetypeSlug}`
                }))
            },
            locksmithPricing: {
                title: `${serviceInfo.title} Fiyatları`,
                description: 'Hizmet türüne ve saate göre fiyatlar değişebilir',
                data: [{
                    name: serviceInfo.title,
                    description: serviceInfo.description,
                    price1: serviceInfo.prices.mesai,
                    price2: serviceInfo.prices.aksam,
                    price3: serviceInfo.prices.gece
                }]
            },
            categorySection: {
                title: 'Diğer Çilingir Hizmetleri',
                description: '',
                data: servicesList
                    .filter(service => service.id !== serviceInfo.id)
                    .map(service => ({
                        id: service.id,
                        name: service.name,
                        slug: neighborhoodInfo.name ?
                            `${citySlug}/${districtSlug}/${neighborhoodSlug}/${service.slug}` :
                            neighborhoodInfo.district ?
                                `${citySlug}/${districtSlug}/${service.slug}` :
                                neighborhoodInfo.city ?
                                    `${citySlug}/${service.slug}` : service.slug
                    }))
            },
            formattedName: titlePrefix,
            type: 'service',
            currentService: serviceInfo.title
        };

        setSideMenuParams(sideMenuParamsData);

        // Breadcrumb için navigasyon listesi
        const navbarItems = [{ id: 1, name: 'Ana Sayfa', slug: '/' }];

        if (citySlug) navbarItems.push({ id: 2, name: neighborhoodInfo.city, slug: `${citySlug}` });
        if (districtSlug) navbarItems.push({ id: 3, name: neighborhoodInfo.district, slug: `${citySlug}/${districtSlug}` });
        if (neighborhoodSlug) navbarItems.push({ id: 4, name: neighborhoodInfo.name, slug: `${citySlug}/${districtSlug}/${neighborhoodSlug}` });
        if (servicetypeSlug) navbarItems.push({ id: 5, name: serviceInfo.title, slug: '#' });

        // MainContent için parametreleri ayarla
        const mainContentParamsData = {
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
                longDescription: neighborhoodInfo.longDescription
            },
            serviceList: {
                title: `${locationName} Çilingir Hizmetleri`,
                description: 'Bölgenizde sunulan diğer çilingir hizmetleri',
                data: servicesList.filter(service => service.id !== serviceInfo.id),
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
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmet fiyatları ortalama ${serviceInfo.prices.mesai.min}₺ ile ${serviceInfo.prices.mesai.max}₺ arasında değişmektedir. Hizmet türü, saat ve gerekli malzemelere göre fiyat değişiklik gösterebilir. Net fiyat bilgisi için çilingir ile iletişime geçmenizi öneririz.`
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
            sideMenuParams: sideMenuParamsData,
            formatedName: titlePrefix,
            type: 'service-detail',
            serviceInfo: serviceInfo
        };

        setMainContentParams(mainContentParamsData);
    }, [neighborhoodInfo, serviceInfo, citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, locksmiths, servicesList]);

    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Yükleniyor...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <p className="text-xl text-red-500">{error}</p>
                    <Button className="mt-4" onClick={fetchData} variant="outline">
                        Tekrar Dene
                    </Button>
                </div>
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
    const locationText = neighborhoodInfo.name ?
        `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}` :
        neighborhoodInfo.district ? `${neighborhoodInfo.city} ${neighborhoodInfo.district}` :
            neighborhoodInfo.city ? neighborhoodInfo.city : 'Türkiye';

    const pageTitle = `${locationText} ${serviceInfo.title} - 7/24 Hizmet`;

    // Meta açıklama
    const metaDescription = serviceInfo.metaDescription ||
        `${locationText} bölgesinde profesyonel ${serviceInfo.title.toLowerCase()} hizmetleri. 7/24 hizmet, uygun fiyat.`;

    // Canonical URL
    const canonicalUrl = neighborhoodInfo.name ?
        `https://bicilingir.com/${citySlug}/${districtSlug}/${neighborhoodSlug}/${servicetypeSlug}` :
        neighborhoodInfo.district ? `https://bicilingir.com/${citySlug}/${districtSlug}/${servicetypeSlug}` :
            neighborhoodInfo.city ? `https://bicilingir.com/${citySlug}/${servicetypeSlug}` :
                `https://bicilingir.com/${servicetypeSlug}`;

    // Yerelleştirilmiş anahtar kelimeler
    const localKeywords = serviceInfo.keywords ? serviceInfo.keywords.map(keyword =>
        `${neighborhoodInfo.name || neighborhoodInfo.district || neighborhoodInfo.city || 'Türkiye'} ${keyword}`
    ) : [];

    return (
        <>
            <div className="flex min-h-screen flex-col">
                {/* SEO için yapısal veriler (JSON-LD) */}
                {/* Eksik */}
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
                                "latitude": neighborhoodInfo.location.lat.toString(),
                                "longitude": neighborhoodInfo.location.lng.toString()
                            },
                            "url": canonicalUrl,
                            "description": metaDescription,
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