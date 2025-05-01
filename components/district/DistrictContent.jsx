"use client";

import React, { useState, useEffect } from 'react';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';
import { services } from '../../lib/test-data';
import { getSupabaseClient } from '../../lib/supabase';


// Supabase client oluştur
const createSupabaseClient = () => {
    return getSupabaseClient();
};

export default function DistrictContent({ citySlug, districtSlug, locksmiths: initialLocksmiths = [] }) {
    const [isLoading, setIsLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState(initialLocksmiths);
    const [districtInfo, setDistrictInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);
    const [neighborhoods, setNeighborhoods] = useState([]);
    const [servicesList, setServicesList] = useState([]);
    const [error, setError] = useState(null);

    // Verileri çek
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Supabase client
                const supabase = createSupabaseClient();

                // Şehir bilgilerini çek
                const { data: cityData, error: cityError } = await supabase
                    .from('provinces')
                    .select('id, name')
                    .eq('slug', citySlug)
                    .single();

                if (cityError) {
                    console.error('Şehir bilgisi alınamadı:', cityError);
                    setError('Şehir bulunamadı');
                    setIsLoading(false);
                    return;
                }

                // İlçe bilgilerini çek
                const { data: districtData, error: districtError } = await supabase
                    .from('districts')
                    .select('id, name, lat, lng')
                    .eq('slug', districtSlug)
                    .eq('province_id', cityData.id)
                    .single();


                if (districtError) {
                    console.error('İlçe bilgisi alınamadı:', districtError);
                    setError('İlçe bulunamadı');
                    setIsLoading(false);
                    return;
                }

                // Mahalleleri çek
                const { data: neighborhoodsData, error: neighborhoodError } = await supabase
                    .from('neighborhoods')
                    .select('id, name, slug')
                    .eq('district_id', districtData.id)
                    .order('name');

                if (neighborhoodError) {
                    console.error('Mahalle bilgileri alınamadı:', neighborhoodError);
                }

                // Hizmet türlerini çek
                const { data: servicesData, error: serviceError } = await supabase
                    .from('services')
                    .select('id, name, slug')
                    .eq('isActive', true)
                    .order('name');

                if (serviceError) {
                    console.error('Hizmet bilgileri alınamadı:', serviceError);
                }

                setNeighborhoods(neighborhoodsData || []);
                setServicesList(servicesData || []);

                const districtInfoData = {
                    name: districtData.name,
                    city: cityData.name,
                    description: `${cityData.name} ${districtData.name} de çilingir hizmetine mi ihtiyacınız var? ${districtData.name} ilçesinde biçok çilingir hizmetleri geniş bir ağla sunulmaktadır. Aşağıda listelenen çilingirlerin hepsi ${cityData.name} ${districtData.name} ilçesinde hizmet vermektedir.`,
                    longDescription: `${cityData.name} ${districtData.name} de çilingir hizmetleri geniş bir ağla sunulmaktadır. Biçok çilingir bölgede aktif olarak hizmet vermektedir.\n${cityData.name} ${districtData.name} de çilingir fiyatı, ilçe ve hizmete göre değişkenlikler göstermektedir. ${cityData.name} ${districtData.name} de ev çilingiri, otomobil çilingiri, acil çilingir, 724 çilingir hizmetleri bulmak oldukça kolaydır.\nBiÇilingir ile en yakın çilingiri saniyeler içinde bulabilir ve hemen arayabilirsiniz. Hizmetlere göre güncel yaklaşık fiyat bilgilerini görebilirsiniz. Net fiyat bilgisi için çilingir ile telefonda görüşebilirsiniz.`,
                    neighborhoods: neighborhoodsData ? neighborhoodsData : [],
                    location: { lat: districtData.lat, lng: districtData.lng }
                };

                setDistrictInfo(districtInfoData);
                setIsLoading(false);
            } catch (error) {
                console.error('Veri yüklenirken hata oluştu:', error);
                setError('Veri yüklenirken bir hata oluştu');
                setIsLoading(false);
            }
        };

        fetchData();
    }, [citySlug, districtSlug, locksmiths.length]);

    // SideMenu parametrelerini hazırla
    useEffect(() => {
        if (!districtInfo || locksmiths.length === 0) return;

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
                        name: neighborhood.name + ' Mahallesi',
                        slug: `${citySlug}/${districtSlug}/${neighborhood.slug}`
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
                    slug: `${citySlug}/${districtSlug}/${service.slug}`
                }))
            },
            formattedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'district'
        };

        setSideMenuParams(params);
    }, [districtInfo, locksmiths, citySlug, districtSlug]);

    // MainContent parametrelerini hazırla
    useEffect(() => {
        if (!districtInfo || locksmiths.length === 0) return;

        // MainContent için parametreleri ayarla
        const params = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: districtInfo.city, slug: `/${citySlug}` },
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
                        answer: `BiÇilingir platformu sayesinde ${districtInfo.city} ${districtInfo.name} ilçesinin tüm mahallelerinde hizmet veren en yakın çilingiri bulabilir, fiyatları görebilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.`
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
                data: districtInfo.neighborhoods.map((neighborhood, idx) => ({
                    id: idx + 1,
                    name: `${neighborhood.name} Mahallesi`,
                    slug: `${citySlug}/${districtSlug}/${neighborhood.slug}`
                }))
            },
            sideMenuParams: sideMenuParams,
            formatedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'district'
        };

        setMainContentParams(params);
    }, [districtInfo, locksmiths, sideMenuParams, citySlug, districtSlug]);

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

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                    <p className="text-xl text-red-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Sayfayı Yenile
                    </button>
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