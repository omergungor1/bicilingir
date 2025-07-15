// http://localhost:3000/sehirler/bursa/osmangazi/kukurtlu/acil-cilingir

import ServicePage from '../../../../../components/location/ServicePage';
import { getMetaData, getLocksmithsList } from '../../../../utils/seo';
import { getSupabaseServer } from '../../../../../lib/supabase';
import Script from 'next/script';
import { notFound } from 'next/navigation';

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getServiceData(citySlug, districtSlug, neighborhoodSlug, servicetypeSlug) {
    try {
        // Supabase client
        const supabase = getSupabaseServer();

        // Çilingir verilerini çek
        const locksmiths = await getLocksmithsList({
            citySlug,
            districtSlug,
            neighborhoodSlug,
            servicetypeSlug,
            count: 2
        });

        // Metadata bilgisini çek
        const metadata = await getMetaData({
            citySlug,
            districtSlug,
            neighborhoodSlug,
            servicetypeSlug,
            locksmiths
        });

        // Hizmet türünü çek
        const { data: serviceData, error: serviceError } = await supabase
            .from('services')
            .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('slug', servicetypeSlug)
            .eq('isActive', true)
            .single();

        if (serviceError) {
            console.error('Hizmet bilgisi alınamadı');
            throw new Error('Hizmet bilgisi bulunamadı');
        }

        // Tüm servis türlerini çek
        const { data: allServices, error: allServicesError } = await supabase
            .from('services')
            .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('isActive', true);

        if (allServicesError) {
            console.error('Tüm hizmetler alınamadı');
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
                console.error('Şehir bilgisi alınamadı #Service-1');
            } else {
                cityInfo = city;
                location = { lat: city.lat, lng: city.lng };
                formattedName = city.name;

                // İlçe bilgisi varsa çek
                if (districtSlug && cityInfo) {
                    const { data: district, error: districtError } = await supabase
                        .from('districts')
                        .select('id, name, lat, lng')
                        .eq('slug', districtSlug)
                        .eq('province_id', cityInfo.id)
                        .single();

                    if (districtError) {
                        console.error('İlçe bilgisi alınamadı #Service-2');
                    } else {
                        districtInfo = district;
                        location = { lat: district.lat, lng: district.lng };
                        formattedName = `${cityInfo.name} ${district.name}`;

                        // Mahalle bilgisi varsa çek
                        if (neighborhoodSlug && districtInfo) {
                            const { data: neighborhood, error: neighborhoodError } = await supabase
                                .from('neighborhoods')
                                .select('id, name, slug')
                                .eq('slug', neighborhoodSlug)
                                .eq('district_id', districtInfo.id)
                                .single();

                            if (neighborhoodError) {
                                console.error('Mahalle bilgisi alınamadı #Service-3');
                            } else {
                                neighborhood.name = neighborhood.name + ' Mahallesi';
                                neighborhoodInfo = neighborhood;
                                formattedName = `${cityInfo.name} ${districtInfo.name} ${neighborhood.name}`;

                                // Yakındaki mahalleler
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

        // Bölge bilgilerini hazırla
        const locationInfo = {
            city: cityInfo ? cityInfo.name : null,
            district: districtInfo ? districtInfo.name : null,
            name: neighborhoodInfo ? neighborhoodInfo.name : null,
            location: location,
            description: `${formattedName} ${serviceData.name} hizmetleri. Kapı açma, çilingir ve diğer tüm anahtar işleri için profesyonel ekiplerimiz 7/24 hizmetinizde.`,
            longDescription: `${formattedName} bölgesinde ${serviceData.name.toLowerCase()} hizmetleri, alanında uzman çilingir ekiplerimiz tarafından en kaliteli ve hızlı şekilde sunulmaktadır. Modern ekipmanlarla donatılmış profesyonel ustalarımız, acil durumlarınızda anında yanınızda olacaktır.\n\nKapı açma, kilit değiştirme, anahtar kopyalama ve diğer tüm çilingir işleriniz için güvenilir ve ekonomik çözümler sunuyoruz. ${formattedName} ve çevresinde kesintisiz olarak hizmet vermekteyiz.`,
            nearbyNeighborhoods: neighborhoodInfo ? neighborhoodInfo.nearbyNeighborhoods || [] : []
        };

        // Detaylı konum stringi oluştur
        const locationName = locationInfo.name ?
            `${locationInfo.name}` :
            locationInfo.district ? locationInfo.district :
                locationInfo.city ? locationInfo.city : 'Türkiye';

        // Sayfa başlığı için tam konum adı
        const titlePrefix = locationInfo.name ?
            `${locationInfo.city} ${locationInfo.district} ${locationInfo.name}` :
            locationInfo.district ? `${locationInfo.city} ${locationInfo.district}` :
                locationInfo.city ? locationInfo.city : 'Türkiye';

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
                description: `${titlePrefix} yakınındaki mahalleler`,
                data: locationInfo.nearbyNeighborhoods.map(neighborhood => ({
                    id: neighborhood.id,
                    name: neighborhood.name,
                    slug: `${citySlug}/${districtSlug}/${neighborhood.slug}` ///${servicetypeSlug}
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
                        slug: locationInfo.name ?
                            `${citySlug}/${districtSlug}/${neighborhoodSlug}/${service.slug}` :
                            locationInfo.district ?
                                `${citySlug}/${districtSlug}/${service.slug}` :
                                locationInfo.city ?
                                    `${citySlug}/${service.slug}` : service.slug
                    }))
            },
            formattedName: titlePrefix,
            type: 'service',
            currentService: serviceInfo.title
        };

        // Breadcrumb için navigasyon listesi
        const navbarItems = [{ id: 1, name: 'Ana Sayfa', slug: '/' }];

        if (citySlug) navbarItems.push({ id: 2, name: locationInfo.city, slug: `/${citySlug}` });
        if (districtSlug) navbarItems.push({ id: 3, name: locationInfo.district, slug: `/${citySlug}/${districtSlug}` });
        if (neighborhoodSlug) navbarItems.push({ id: 4, name: locationInfo.name, slug: `/${citySlug}/${districtSlug}/${neighborhoodSlug}` });
        if (servicetypeSlug) navbarItems.push({ id: 5, name: serviceInfo.title, slug: '#' });

        // MainContent için parametreleri hazırla
        const mainContentParams = {
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
                longDescription: locationInfo.longDescription
            },
            serviceList: {
                title: `${locationName} Çilingir Hizmetleri`,
                description: 'Bölgenizde sunulan diğer çilingir hizmetleri',
                data: allServices.filter(service => service.id !== serviceInfo.id),
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
                    },
                    {
                        id: 5,
                        question: `${locationName}'de gece ${serviceInfo.title} hizmeti alabilir miyim?`,
                        answer: `Evet, ${locationName}'de 7/24 ${serviceInfo.title.toLowerCase()} hizmeti veren çilingirlerimiz bulunmaktadır. Gece saatlerinde de acil durumlar için profesyonel çilingir ekiplerimize ulaşabilirsiniz. Gece hizmetlerinde normal çalışma saatlerine göre fiyat farkı olabileceğini unutmayınız.`
                    },
                    {
                        id: 6,
                        question: `${serviceInfo.title} hizmeti için hangi garantiler verilmektedir?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti sunan çilingirlerimiz genellikle yaptıkları işlere belirli süre garanti vermektedir. Bu garanti süresi kilit değişimi, montaj gibi işlemler için genellikle 1 yıl, diğer hizmetler için ise 3-6 ay arasında değişebilmektedir. Garanti kapsamı ve süresi hakkında detaylı bilgiyi çilingir ustası ile görüşerek alabilirsiniz.`
                    },
                    {
                        id: 7,
                        question: `${serviceInfo.title} hizmeti için yanımda hangi belgeler bulunmalı?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti alırken, özellikle ev veya araç açma gibi işlemlerde, kimliğinizi ve mülkün size ait olduğunu gösteren belgeler (tapu, kira sözleşmesi, araç ruhsatı vb.) yanınızda bulunmalıdır. Çilingirler, güvenlik nedeniyle bu belgeleri kontrol etmektedir.`
                    },
                    {
                        id: 8,
                        question: `${locationName}'de en güvenilir ${serviceInfo.title} hizmetini nasıl bulabilirim?`,
                        answer: `BiÇilingir platformumuz üzerinden ${locationName}'de en güvenilir ${serviceInfo.title.toLowerCase()} hizmetini sunan çilingirleri bulabilirsiniz. Kullanıcı değerlendirmeleri, hizmet puanları ve çalışma süreleri gibi kriterlere göre filtreleme yaparak, size en uygun ve güvenilir çilingiri seçebilirsiniz.`
                    },
                    {
                        id: 9,
                        question: `${serviceInfo.title} için hangi marka kilitler/ürünler kullanılmaktadır?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti sunan çilingirlerimiz genellikle Kale, Yale, Mul-T-Lock, Mottura gibi güvenilir ve kaliteli markaların ürünlerini kullanmaktadır. İhtiyacınıza ve bütçenize göre farklı marka ve model seçenekleri sunulmaktadır. Kullanılacak ürünlerle ilgili çilingir ustasından detaylı bilgi alabilirsiniz.`
                    },
                    {
                        id: 10,
                        question: `${locationName}'de ${serviceInfo.title} hizmeti için önceden randevu almam gerekiyor mu?`,
                        answer: `${locationName}'de ${serviceInfo.title.toLowerCase()} hizmeti için genellikle acil durumlar (kapı açma, anahtar kırılması vb.) için anında hizmet verilmektedir. Ancak kilit değişimi, kapı montajı gibi planlı işler için randevu alınması önerilir. BiÇilingir platformu üzerinden tercih ettiğiniz çilingir ile iletişime geçerek randevu oluşturabilirsiniz.`
                    }
                ]
            },
            sideMenuParams: sideMenuParams,
            formatedName: titlePrefix,
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
    } catch (error) {
        notFound();
    }
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getServiceData(
        resolvedParams.city,
        resolvedParams.district,
        resolvedParams.neighborhood,
        resolvedParams.servicetype
    );
    return metadata;
}

export default async function NeighborhoodServicePage({ params }) {
    const resolvedParams = await params;
    const { city, district, neighborhood, servicetype } = resolvedParams;

    const {
        locksmiths,
        serviceInfo,
        locationInfo,
        sideMenuParams,
        mainContentParams,
        metadata
    } = await getServiceData(city, district, neighborhood, servicetype);

    const data = {
        citySlug: city,
        districtSlug: district,
        neighborhoodSlug: neighborhood,
        servicetypeSlug: servicetype,
        locksmiths
    };

    // structuredData'yı metadata.other.structuredData'dan alıyoruz
    const structuredData = metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <ServicePage
                data={data}
                serviceInfo={serviceInfo}
                locationInfo={locationInfo}
                sideMenuParams={sideMenuParams}
                mainContentParams={mainContentParams}
            />
        </>
    );
} 
