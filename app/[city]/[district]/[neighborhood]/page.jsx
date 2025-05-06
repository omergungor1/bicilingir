// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu

import NeighborhoodPageClient from '../../../../components/neighborhood/NeighborhoodPageClient';
import { ServiceList } from '../../../../lib/service-list';
import ServicePage from '../../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../../utils/seo';
import { getSupabaseServer } from '../../../../lib/supabase';
import Script from 'next/script';

// Sunucu tarafında tüm verileri yükleyen yardımcı fonksiyon
async function getNeighborhoodData(citySlug, districtSlug, neighborhoodSlug, servicetypeSlug) {
    console.log('Fetching neighborhood data for:', citySlug, districtSlug, neighborhoodSlug, servicetypeSlug);

    // Supabase client
    const supabase = getSupabaseServer();

    // Paralel veri çekme
    const locksmiths = await getLocksmithsList({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        servicetypeSlug,
        count: 2
    });

    const metadata = await getMetaData({
        citySlug,
        districtSlug,
        neighborhoodSlug,
        servicetypeSlug,
        locksmiths
    });

    if (servicetypeSlug) {
        // Eğer bu bir hizmet sayfası ise, tüm gerekli verileri hazırla
        // Hizmet türünü çek
        const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('slug', servicetypeSlug)
            .eq('isActive', true)
            .single();

        if (serviceError) {
            console.error('Hizmet bilgisi alınamadı:', serviceError);
            throw new Error('Hizmet bilgisi bulunamadı');
        }

        // Tüm servis türlerini çek
        const { data: allServices, error: allServicesError } = await supabase
            .from('services')
            .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('isActive', true);

        if (allServicesError) {
            console.error('Tüm hizmetler alınamadı:', allServicesError);
        }

        // Şehir bilgilerini çek
        const { data: cityData, error: cityError } = await supabase
            .from('provinces')
            .select('id, name, lat, lng')
            .eq('slug', citySlug)
            .single();

        if (cityError) {
            console.error('Şehir bilgisi alınamadı:', cityError);
            throw new Error('Şehir bulunamadı');
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
            throw new Error('İlçe bulunamadı');
        }

        // Konum ve format bilgilerini ayarla
        let location = { lat: districtData.lat, lng: districtData.lng };
        let formattedName = `${cityData.name} ${districtData.name}`;
        let neighborhoodData = null;

        if (neighborhoodSlug) {
            // Mahalle bilgisini çek (yoksa boş geç)
            const { data: neighborhood, error: neighborhoodError } = await supabase
                .from('neighborhoods')
                .select('id, name, slug')
                .eq('slug', neighborhoodSlug)
                .eq('district_id', districtData.id)
                .single();

            if (!neighborhoodError && neighborhood) {
                neighborhood.name = neighborhood.name + ' Mahallesi';
                neighborhoodData = neighborhood;
                formattedName = `${cityData.name} ${districtData.name} ${neighborhood.name}`;
            }
        }

        // Hizmet bilgilerini hazırla
        const serviceInfo = {
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

        // Yakındaki mahalleleri çek
        const { data: nearbyNeighborhoods, error: nearbyError } = await supabase
            .from('neighborhoods')
            .select('id, name, slug')
            .eq('district_id', districtData.id)
            .order('name')
            .limit(10);

        const neighborhoodList = [];
        if (!nearbyError && nearbyNeighborhoods) {
            nearbyNeighborhoods.forEach(neighborhood => {
                if (neighborhoodData && neighborhood.id === neighborhoodData.id) return;
                neighborhood.slug = `${citySlug}/${districtSlug}/${neighborhood.slug}/${servicetypeSlug}`;
                neighborhood.name = neighborhood.name + ' Mahallesi';
                neighborhoodList.push(neighborhood);
            });
        }

        // Bölge bilgilerini hazırla
        const locationInfo = {
            city: cityData.name,
            district: districtData.name,
            name: neighborhoodData ? neighborhoodData.name : null,
            location: location,
            description: `${formattedName} ${serviceData.name} hizmetleri. Kapı açma, çilingir ve diğer tüm anahtar işleri için profesyonel ekiplerimiz 7/24 hizmetinizde.`,
            longDescription: `${formattedName} bölgesinde ${serviceData.name.toLowerCase()} hizmetleri, alanında uzman çilingir ekiplerimiz tarafından en kaliteli ve hızlı şekilde sunulmaktadır. Modern ekipmanlarla donatılmış profesyonel ustalarımız, acil durumlarınızda anında yanınızda olacaktır.\n\nKapı açma, kilit değiştirme, anahtar kopyalama ve diğer tüm çilingir işleriniz için güvenilir ve ekonomik çözümler sunuyoruz. ${formattedName} ve çevresinde kesintisiz olarak hizmet vermekteyiz.`,
            nearbyNeighborhoods: neighborhoodList
        };

        // SideMenu için parametreleri hazırla
        const sideMenuParams = {
            map: {
                locksmithPositions: locksmiths.length > 0 ? locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })) : [],
                mapCenter: locationInfo.location
            },
            nearbySection: {
                title: 'Yakındaki Mahalleler',
                description: `${formattedName} yakınındaki mahalleler`,
                data: locationInfo.nearbyNeighborhoods.map(neighborhood => ({
                    id: neighborhood.id,
                    name: neighborhood.name,
                    slug: neighborhood.slug
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
                data: allServices
                    .filter(service => service.id !== serviceInfo.id)
                    .map(service => ({
                        id: service.id,
                        name: service.name,
                        slug: neighborhoodData ?
                            `${citySlug}/${districtSlug}/${neighborhoodSlug}/${service.slug}` :
                            `${citySlug}/${districtSlug}/${service.slug}`
                    }))
            },
            formattedName: formattedName,
            type: 'service',
            currentService: serviceInfo.title
        };

        // Breadcrumb için navigasyon listesi
        const navbarItems = [{ id: 1, name: 'Ana Sayfa', slug: '/' }];
        navbarItems.push({ id: 2, name: cityData.name, slug: `/${citySlug}` });
        navbarItems.push({ id: 3, name: districtData.name, slug: `/${citySlug}/${districtSlug}` });
        if (neighborhoodData) navbarItems.push({ id: 4, name: neighborhoodData.name, slug: `/${citySlug}/${districtSlug}/${neighborhoodSlug}` });
        navbarItems.push({ id: neighborhoodData ? 5 : 4, name: serviceInfo.title, slug: '#' });

        // MainContent için parametreleri hazırla
        const mainContentParams = {
            navbarList: navbarItems,
            mainCard: {
                title: `${formattedName} ${serviceInfo.title}`,
                description: `${formattedName} için ${serviceInfo.title.toLowerCase()} hizmetleri. ${serviceInfo.description}`
            },
            locksmitList: {
                title: `${formattedName} ${serviceInfo.title} Hizmeti Veren Çilingirler`,
                description: 'Size en yakın ve en uygun çilingirler aşağıda listelenmiştir. Hemen arayabilir veya mesaj gönderebilirsiniz.',
                data: locksmiths
            },
            seconCard: {
                title: `${serviceInfo.title} Hizmeti Hakkında`,
                longDescription: locationInfo.longDescription
            },
            serviceList: {
                title: `${formattedName} Çilingir Hizmetleri`,
                description: 'Bölgenizde sunulan diğer çilingir hizmetleri',
                data: allServices.filter(service => service.id !== serviceInfo.id),
                name: formattedName
            },
            sssList: {
                title: `${formattedName} ${serviceInfo.title} - Sık Sorulan Sorular`,
                description: `${serviceInfo.title} hizmeti hakkında merak edilenler`,
                data: [
                    {
                        id: 1,
                        question: `${formattedName}'de ${serviceInfo.title} hizmeti ne kadar sürer?`,
                        answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti genellikle 15-45 dakika içinde tamamlanmaktadır. Ancak bu süre, hizmetin karmaşıklığına ve aciliyetine göre değişebilir.`
                    },
                    {
                        id: 2,
                        question: `${formattedName}'de ${serviceInfo.title} fiyatları ne kadar?`,
                        answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmet fiyatları ortalama ${serviceInfo.prices.mesai.min}₺ ile ${serviceInfo.prices.mesai.max}₺ arasında değişmektedir. Hizmet türü, saat ve gerekli malzemelere göre fiyat değişiklik gösterebilir. Net fiyat bilgisi için çilingir ile iletişime geçmenizi öneririz.`
                    },
                    {
                        id: 3,
                        question: `${serviceInfo.title} hizmeti için ne kadar beklemem gerekir?`,
                        answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti için bekleme süresi genellikle 15-30 dakikadır. Acil durumlarda, çilingir ekiplerimiz en kısa sürede yanınızda olacaktır.`
                    },
                    {
                        id: 4,
                        question: `${serviceInfo.title} hizmeti için hangi ödeme yöntemlerini kabul ediyorsunuz?`,
                        answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti sunan çilingirlerimiz genellikle nakit, kredi kartı ve banka havalesi gibi çeşitli ödeme yöntemlerini kabul etmektedir. Ödeme yöntemi konusunda çilingir ustası ile önceden görüşmenizi öneririz.`
                    }
                ]
            },
            sideMenuParams: sideMenuParams,
            formatedName: formattedName,
            type: 'service-detail',
            serviceInfo: serviceInfo
        };

        return {
            locksmiths,
            metadata,
            serviceInfo,
            locationInfo,
            sideMenuParams,
            mainContentParams
        };
    } else {
        // Şehir bilgilerini çek
        const { data: cityData, error: cityError } = await supabase
            .from('provinces')
            .select('id, name, slug')
            .eq('slug', citySlug)
            .single();

        if (cityError) {
            console.error('Şehir bilgisi alınamadı:', cityError);
            throw new Error('Şehir bulunamadı');
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
            throw new Error('İlçe bulunamadı');
        }

        districtData.slug = citySlug + '/' + districtSlug;

        // Mahalle bilgilerini çek
        const { data: neighborhoodData, error: neighborhoodError } = await supabase
            .from('neighborhoods')
            .select('id, name, slug')
            .eq('slug', neighborhoodSlug)
            .eq('district_id', districtData.id)
            .single();

        if (neighborhoodError) {
            console.error('Mahalle bilgisi alınamadı:', neighborhoodError);
            throw new Error('Mahalle bulunamadı');
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
            .select('id, name, slug, description, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('isActive', true)
            .order('name');

        if (serviceError) {
            console.error('Hizmet bilgileri alınamadı:', serviceError);
        }

        servicesData.forEach(service => {
            service.slug = citySlug + '/' + districtSlug + '/' + neighborhoodSlug + '/' + service.slug;
        });

        // Mahalle bilgilerini hazırla
        const neighborhoodInfo = {
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

        // SideMenu için parametreleri hazırla
        const sideMenuParams = {
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
                data: servicesData.map(service => ({
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
                data: servicesData.map(service => ({
                    id: service.id,
                    name: service.name,
                    slug: service.slug
                }))
            },
            formattedName: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}`,
            type: 'neighborhood'
        };

        // MainContent için parametreleri hazırla
        const mainContentParams = {
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: neighborhoodInfo.city, slug: `/${citySlug}` },
                { id: 3, name: neighborhoodInfo.district, slug: `/${citySlug}/${districtSlug}` },
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
                data: servicesData,
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
            sideMenuParams: sideMenuParams,
            formatedName: `${neighborhoodInfo.city} ${neighborhoodInfo.district} ${neighborhoodInfo.name}`,
            type: 'neighborhood'
        };

        return {
            locksmiths,
            metadata,
            neighborhoodInfo,
            sideMenuParams,
            mainContentParams,
            servicesData
        };
    }
}

// Metadata fonksiyonu - sunucu tarafında çalışır
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug, neighborhood: neighborhoodSlug } = resolvedParams;

    // Eğer neighborhood bir hizmet türüyse, ServicePage komponentini göster
    const isService = ServiceList.some(service => service.slug === neighborhoodSlug);

    if (isService) {
        const { metadata } = await getNeighborhoodData(
            citySlug,
            districtSlug,
            null, //neighborhoodSlug
            neighborhoodSlug //servicetypeSlug
        );
        return metadata;
    } else {
        const { metadata } = await getNeighborhoodData(
            citySlug,
            districtSlug,
            neighborhoodSlug,
            null //servicetypeSlug
        );
        return metadata;
    }
}

// Bu sayfa otomatik olarak sunucu tarafında render edilir
export default async function NeighborhoodPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug, neighborhood: neighborhoodSlug } = resolvedParams;

    const isService = ServiceList.some(service => service.slug === neighborhoodSlug);

    // İlgili verileri ve metadata'yı çek - bunu sayfa render edilmeden önce tamamla
    if (isService) {
        // Hizmet sayfası durumu
        const result = await getNeighborhoodData(citySlug, districtSlug, null, neighborhoodSlug);
        const structuredData = result.metadata?.other?.structuredData;

        const data = {
            citySlug,
            districtSlug,
            neighborhoodSlug: null,
            servicetypeSlug: neighborhoodSlug,
            locksmiths: result.locksmiths
        };

        return (
            <>
                {structuredData && (
                    <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                        {structuredData}
                    </Script>
                )}
                <ServicePage
                    data={data}
                    serviceInfo={result.serviceInfo}
                    locationInfo={result.locationInfo}
                    sideMenuParams={result.sideMenuParams}
                    mainContentParams={result.mainContentParams}
                />
            </>
        );
    }

    // Normal mahalle sayfası durumu
    const result = await getNeighborhoodData(citySlug, districtSlug, neighborhoodSlug, null);
    const structuredData = result.metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <NeighborhoodPageClient
                citySlug={citySlug}
                districtSlug={districtSlug}
                neighborhoodSlug={neighborhoodSlug}
                locksmiths={result.locksmiths}
                neighborhoodInfo={result.neighborhoodInfo}
                sideMenuParams={result.sideMenuParams}
                mainContentParams={result.mainContentParams}
            />
        </>
    );
} 