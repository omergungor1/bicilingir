"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';
import { getSupabaseClient } from '../../lib/supabase';

export default function NeighborhoodPageClient({ citySlug, districtSlug, neighborhoodSlug, locksmiths: initialLocksmiths = [] }) {
    // params kontrolü 
    if (!citySlug || !districtSlug || !neighborhoodSlug) {
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

    const [isLoading, setIsLoading] = useState(true);
    const [locksmiths, setLocksmiths] = useState(initialLocksmiths);
    const [neighborhoodInfo, setNeighborhoodInfo] = useState(null);
    const [sideMenuParams, setSideMenuParams] = useState(null);
    const [mainContentParams, setMainContentParams] = useState(null);
    const [servicesList, setServicesList] = useState([]);
    const [error, setError] = useState(null);

    // API'den veri çekme işlemi
    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Supabase client
            const supabase = getSupabaseClient();

            // Şehir bilgilerini çek
            const { data: cityData, error: cityError } = await supabase
                .from('provinces')
                .select('id, name, slug')
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
                .select('id, name, slug, lat, lng')
                .eq('slug', districtSlug)
                .eq('province_id', cityData.id)
                .single();

            if (districtError) {
                console.error('İlçe bilgisi alınamadı:', districtError);
                setError('İlçe bulunamadı');
                setIsLoading(false);
                return;
            }

            districtData.slug = citySlug + '/' + districtSlug;


            // Mahalle bilgilerini çek
            //mahalle lat, lng sonra eklenecek! Gerekli mi?
            const { data: neighborhoodData, error: neighborhoodError } = await supabase
                .from('neighborhoods')
                .select('id, name, slug')
                .eq('slug', neighborhoodSlug)
                .eq('district_id', districtData.id)
                .single();

            if (neighborhoodError) {
                console.error('Mahalle bilgisi alınamadı:', neighborhoodError);
                setError('Mahalle bulunamadı');
                setIsLoading(false);
                return;
            }

            neighborhoodData.name = neighborhoodData.name + ' Mahallesi';
            neighborhoodData.slug = citySlug + '/' + districtSlug + '/' + neighborhoodSlug;

            // Yakın mahalleleri çek (aynı ilçedeki diğer mahalleler)
            const { data: nearbyNeighborhoods, error: nearbyError } = await supabase
                .from('neighborhoods')
                .select('id, name, slug')
                .eq('district_id', districtData.id)
                .neq('id', neighborhoodData.id)
                .order('name')
                .limit(10);

            if (nearbyError) {
                console.error('Yakındaki mahalle bilgileri alınamadı:', nearbyError);
            }

            nearbyNeighborhoods.forEach(neighborhood => {
                neighborhood.slug = citySlug + '/' + districtSlug + '/' + neighborhood.slug;
            });

            // Hizmet türlerini çek
            const { data: servicesData, error: serviceError } = await supabase
                .from('services')
                .select('id, name, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
                .eq('isActive', true)
                .order('name');

            if (serviceError) {
                console.error('Hizmet bilgileri alınamadı:', serviceError);
            }

            servicesData.forEach(service => {
                service.slug = citySlug + '/' + districtSlug + '/' + neighborhoodSlug + '/' + service.slug;
            });

            setServicesList(servicesData);

            // Mahalle bilgisini hazırla
            const neighborhoodInfoData = {
                id: neighborhoodData.id,
                name: neighborhoodData.name,
                district: districtData.name,
                city: cityData.name,
                description: `${neighborhoodData.name}, ${districtData.name}, ${cityData.name} bölgesinde 7/24 çilingir hizmetleri. Kapı açma, çilingir, anahtar kopyalama ve diğer çilingir hizmetleri için hemen arayın.`,
                longDescription: `Bi Çilingir olarak, ${neighborhoodData.name} sakinlerini güvenilir, ekonomik ve hızlı çilingir hizmeti sunan profesyonellerle buluşturuyoruz. Kendimiz doğrudan çilingir hizmeti vermiyoruz; bunun yerine, bulunduğunuz bölgedeki en yakın ve en güvenilir çilingirleri tek bir platformda sizin için listeliyoruz. Böylece acil bir durumda zaman kaybetmeden iletişime geçebileceğiniz uzmanlara kolayca ulaşmanızı sağlıyoruz.\n\n
                Kapınız kilitli kaldıysa, anahtarınızı kaybettiyseniz ya da kilit değişimi yaptırmak istiyorsanız, ${neighborhoodData.name}'ndeki çilingirleri hemen inceleyebilir, size en uygun olanla doğrudan iletişime geçebilirsiniz. Tüm çilingirler, kullanıcı yorumları ve hizmet detaylarıyla birlikte sayfamızda yer alır; bu sayede güvenli ve bilinçli bir seçim yapabilirsiniz.\n\n
                Platformumuzda listelenen çilingirlerin çoğu 7/24 hizmet sunmaktadır. Gece ya da gündüz fark etmeksizin, dakikalar içinde destek alabileceğiniz profesyonellere ulaşmak artık çok kolay. Bi Çilingir, kaliteli hizmete erişimi kolaylaştırır; uygun fiyatlı ve güvenilir çözümler sunan çilingirleri bir araya getirir.\n\n
                ${neighborhoodData.name} için en yakın çilingirleri şimdi keşfedin ve ihtiyacınıza en uygun ustayla hemen iletişime geçin!`,
                location: {
                    lat: districtData.lat,
                    lng: districtData.lng
                },
                nearbyNeighborhoods: nearbyNeighborhoods || []
            };

            setNeighborhoodInfo(neighborhoodInfoData);
            setIsLoading(false);
        } catch (error) {
            console.error('Veri yüklenirken hata oluştu:', error);
            setError('Veri yüklenirken bir hata oluştu');
            setIsLoading(false);
        }
    };

    // Sayfa yüklendiğinde veri çek
    useEffect(() => {
        fetchData();
    }, [citySlug, districtSlug, neighborhoodSlug]);

    // SideMenu parametrelerini hazırla
    useEffect(() => {
        if (!neighborhoodInfo) return;

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
                description: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} yakınındaki mahalleler`,
                data: neighborhoodInfo.nearbyNeighborhoods.map(neighborhood => (
                    {
                        id: neighborhood.id,
                        name: neighborhood.name + ' Mahallesi',
                        slug: neighborhood.slug
                    }))
            },
            locksmithPricing: {
                title: 'Çilingir Hizmetleri Fiyatları',
                description: 'Çilingir hizmetleri fiyatları çeşitli faktörlere göre değişebilir',
                data: servicesList.map(service => ({
                    id: service.id,
                    name: service.name,
                    description: service.description,
                    price1: { min: service.minPriceMesai, max: service.maxPriceMesai },
                    price2: { min: service.minPriceAksam, max: service.maxPriceAksam },
                    price3: { min: service.minPriceGece, max: service.maxPriceGece }
                }))
            },
            categorySection: {
                title: `${neighborhoodInfo.name} Çilingir Hizmetleri`,
                description: 'Mahallenizde sunulan çilingir hizmetleri',
                data: servicesList.map(service => ({
                    id: service.id,
                    name: service.name,
                    slug: service.slug
                }))
            },
            formattedName: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}`,
            type: 'neighborhood'
        };

        setSideMenuParams(sideMenuParamsData);

        // MainContent için parametreleri ayarla
        const mainContentParams = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: neighborhoodInfo.city, slug: `${citySlug}` },
                { id: 3, name: neighborhoodInfo.district, slug: `${citySlug}/${districtSlug}` },
                { id: 4, name: neighborhoodInfo.name, slug: '#' }
            ],
            mainCard: {
                title: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} Çilingir`,
                description: neighborhoodInfo.description
            },
            locksmitList: {
                title: `${neighborhoodInfo.name} Çilingirler`,
                description: 'Size en yakın ve en uygun çilingirler aşağıda listelenmiştir. Hemen arayabilir veya mesaj gönderebilirsiniz.',
                data: locksmiths
            },
            seconCard: {
                title: `${neighborhoodInfo.name} Hakkında`,
                longDescription: neighborhoodInfo.longDescription
            },
            serviceList: {
                title: `${neighborhoodInfo.name} Çilingir Hizmetleri`,
                description: 'Mahallenizde sunulan çilingir hizmetleri',
                data: servicesList,
                neighborhoods: neighborhoodInfo.nearbyNeighborhoods,
                name: neighborhoodInfo.name
            },
            sssList: {
                title: `${neighborhoodInfo.name} Çilingir - Sık Sorulan Sorular`,
                description: 'Çilingir hizmetleri hakkında merak edilenler',
                data: [
                    {
                        id: 1,
                        question: `${neighborhoodInfo.name}'de en yakın çilingir nerede?`,
                        answer: `BiÇilingir platformu sayesinde ${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} hizmet veren en yakın çilingiri bulabilir, fiyatları görebilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.`
                    },
                    {
                        id: 2,
                        question: `${neighborhoodInfo.name}'de çilingir ücretleri ne kadar?`,
                        answer: `${neighborhoodInfo.name} çilingir ücretleri genellikle hizmet türüne göre değişiklik gösterir. Kapı açma işlemleri ortalama 300₺-500₺, kilit değiştirme 500₺-1000₺, çelik kapı tamiri ise 500₺-1500₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.`
                    },
                    {
                        id: 3,
                        question: `${neighborhoodInfo.name}'de gece çilingir hizmeti alabilir miyim?`,
                        answer: `Evet, ${neighborhoodInfo.name} 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.`
                    },
                    {
                        id: 4,
                        question: `${neighborhoodInfo.name}'de hangi çilingir hizmetleri verilmektedir?`,
                        answer: `${neighborhoodInfo.name} kapı açma, kilit değiştirme, anahtar kopyalama, çelik kapı tamiri, kasa açma, oto çilingir ve daha birçok çilingir hizmeti verilmektedir. Platformumuzda listelenen çilingirler ile ihtiyacınız olan tüm hizmetlere ulaşabilirsiniz.`
                    }
                ]
            },
            detailedDistrictList: {
                title: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name} Çevresindeki Mahalleler`,
                description: `${neighborhoodInfo.name} çilingir hizmeti verilen yakın bölgeler`,
                secondTitle: 'Mahalleler',
                data: neighborhoodInfo.nearbyNeighborhoods.map(neighborhood => ({
                    id: neighborhood.id,
                    name: neighborhood.name + ' Mahallesi',
                    slug: neighborhood.slug
                }))
            },
            sideMenuParams: sideMenuParamsData,
            formatedName: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}`,
            type: 'neighborhood'
        };

        setMainContentParams(mainContentParams);
    }, [neighborhoodInfo, locksmiths, citySlug, districtSlug, neighborhoodSlug, servicesList]);

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
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-500">{error}</p>
                    <Button className="mt-4" onClick={fetchData} variant="outline">
                        Tekrar Dene
                    </Button>
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