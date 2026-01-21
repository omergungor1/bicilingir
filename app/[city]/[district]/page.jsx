// http://localhost:3000/sehirler/bursa/nilufer

import DistrictContent from '../../../components/district/DistrictContent';
import { ServiceList } from '../../../lib/service-list';
import { getMetaData, getLocksmithsList } from '../../utils/seo';
import { getSupabaseServer } from '../../../lib/supabase';
import Script from 'next/script';
import { notFound, permanentRedirect } from 'next/navigation';

// Build zamanında tüm district/service kombinasyonlarını getir
export async function generateStaticParams() {
    try {
        const supabase = getSupabaseServer();
        const staticParams = [];


        // Bursa ve İstanbul'un ilçelerini çek
        const { data: districts, error: districtsError } = await supabase
            .from('districts')
            .select('slug, province_id, provinces(slug)')
            .in('province_id', [16, 34, 35, 6]); // Bursa (16), İstanbul (34), İzmir (35) ve Ankara (6)

        if (districtsError) {
            console.error('İlçe bilgileri alınırken hata:', districtsError);
        } else if (districts) {
            // Her ilçe için static params ekle
            districts.forEach(district => {
                const citySlug = district.provinces?.slug || (district.province_id === 16 ? 'bursa' : 'istanbul');
                staticParams.push({
                    city: citySlug,
                    district: district.slug
                });
            });
        }


        return staticParams;
    } catch (error) {
        console.error('District generateStaticParams hatası:', error);
        return [];
    }
}

// Sunucu tarafında tüm verileri yükleyen yardımcı fonksiyon 
async function getDistrictData(citySlug, districtSlug, servicetypeSlug) {
    try {
        // Supabase client
        const supabase = getSupabaseServer();

        const locksmiths = await getLocksmithsList({
            citySlug,
            districtSlug,
            servicetypeSlug,
            count: 2
        });

        const metadata = await getMetaData({
            citySlug,
            districtSlug,
            neighborhoodSlug: null,
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

            // Şehir bilgilerini çek
            const { data: cityData, error: cityError } = await supabase
                .from('provinces')
                .select('id, name, lat, lng')
                .eq('slug', citySlug)
                .single();

            if (cityError) {
                console.error('Şehir bilgisi alınamadı #District-2');
                throw new Error('Şehir bulunamadı');
            }

            let location = { lat: cityData.lat, lng: cityData.lng };
            let formattedName = cityData.name;
            let districtData = null;

            // İlçe bilgilerini çek
            if (districtSlug) {
                const { data: district, error: districtError } = await supabase
                    .from('districts')
                    .select('id, name, lat, lng')
                    .eq('slug', districtSlug)
                    .eq('province_id', cityData.id)
                    .single();

                if (!districtError && district) {
                    districtData = district;
                    location = { lat: district.lat, lng: district.lng };
                    formattedName = `${cityData.name} ${district.name}`;
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
                city: cityData.name,
                district: districtData ? districtData.name : null,
                name: null,
                location: location,
                description: `${formattedName} ${serviceData.name} hizmetleri. Kapı açma, çilingir ve diğer tüm anahtar işleri için profesyonel ekiplerimiz 7/24 hizmetinizde.`,
                longDescription: `${formattedName} bölgesinde ${serviceData.name.toLowerCase()} hizmetleri, alanında uzman çilingir ekiplerimiz tarafından en kaliteli ve hızlı şekilde sunulmaktadır. Modern ekipmanlarla donatılmış profesyonel ustalarımız, acil durumlarınızda anında yanınızda olacaktır.\n\nKapı açma, kilit değiştirme, anahtar kopyalama ve diğer tüm çilingir işleriniz için güvenilir ve ekonomik çözümler sunuyoruz. ${formattedName} ve çevresinde kesintisiz olarak hizmet vermekteyiz.`,
                nearbyNeighborhoods: []
            };

            // Yakın ilçeleri çek
            if (districtData) {
                const { data: nearbyDistricts, error: nearbyError } = await supabase
                    .from('districts')
                    .select('id, name, slug')
                    .eq('province_id', cityData.id)
                    .neq('id', districtData.id)
                    .order('name')
                    .limit(10);

                if (!nearbyError && nearbyDistricts) {
                    nearbyDistricts.forEach(district => {
                        district.slug = `${citySlug}/${district.slug}/${servicetypeSlug}`;
                    });
                    locationInfo.nearbyNeighborhoods = nearbyDistricts;
                }
            } else {
                const { data: districts, error: districtsError } = await supabase
                    .from('districts')
                    .select('id, name, slug')
                    .eq('province_id', cityData.id)
                    .order('name')
                    .limit(10);

                if (!districtsError && districts) {
                    districts.forEach(district => {
                        district.slug = `${citySlug}/${district.slug}/${servicetypeSlug}`;
                    });
                    locationInfo.nearbyNeighborhoods = districts;
                }
            }

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
                    title: districtData ? 'Yakındaki İlçeler' : 'İlçeler',
                    description: `${formattedName} yakınındaki ilçeler`,
                    data: locationInfo.nearbyNeighborhoods.map(district => ({
                        id: district.id,
                        name: district.name,
                        slug: district.slug
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
                            // slug: districtData ?
                            //     `${citySlug}/${districtSlug}/${service.slug}` :
                            //     `${citySlug}/${service.slug}`
                        }))
                },
                formattedName: formattedName,
                type: 'service',
                currentService: serviceInfo.title
            };

            // Breadcrumb için navigasyon listesi
            const navbarItems = [{ id: 1, name: 'Ana Sayfa', slug: '/' }];
            navbarItems.push({ id: 2, name: cityData.name, slug: `/${citySlug}` });
            if (districtData) navbarItems.push({ id: 3, name: districtData.name, slug: `/${citySlug}/${districtSlug}` });
            navbarItems.push({ id: districtData ? 4 : 3, name: serviceInfo.title, slug: '#' });

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
                        },
                        {
                            id: 5,
                            question: `${formattedName}'de gece ${serviceInfo.title} hizmeti alabilir miyim?`,
                            answer: `Evet, ${formattedName}'de 7/24 ${serviceInfo.title.toLowerCase()} hizmeti veren çilingirlerimiz bulunmaktadır. Gece saatlerinde de acil durumlar için profesyonel çilingir ekiplerimize ulaşabilirsiniz. Gece hizmetlerinde normal çalışma saatlerine göre fiyat farkı olabileceğini unutmayınız.`
                        },
                        {
                            id: 6,
                            question: `${serviceInfo.title} hizmeti için hangi garantiler verilmektedir?`,
                            answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti sunan çilingirlerimiz genellikle yaptıkları işlere belirli süre garanti vermektedir. Bu garanti süresi kilit değişimi, montaj gibi işlemler için genellikle 1 yıl, diğer hizmetler için ise 3-6 ay arasında değişebilmektedir. Garanti kapsamı ve süresi hakkında detaylı bilgiyi çilingir ustası ile görüşerek alabilirsiniz.`
                        },
                        {
                            id: 7,
                            question: `${serviceInfo.title} hizmeti için yanımda hangi belgeler bulunmalı?`,
                            answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti alırken, özellikle ev veya araç açma gibi işlemlerde, kimliğinizi ve mülkün size ait olduğunu gösteren belgeler (tapu, kira sözleşmesi, araç ruhsatı vb.) yanınızda bulunmalıdır. Çilingirler, güvenlik nedeniyle bu belgeleri kontrol etmektedir.`
                        },
                        {
                            id: 8,
                            question: `${formattedName}'de en güvenilir ${serviceInfo.title} hizmetini nasıl bulabilirim?`,
                            answer: `BiÇilingir platformumuz üzerinden ${formattedName}'de en güvenilir ${serviceInfo.title.toLowerCase()} hizmetini sunan çilingirleri bulabilirsiniz. Kullanıcı değerlendirmeleri, hizmet puanları ve çalışma süreleri gibi kriterlere göre filtreleme yaparak, size en uygun ve güvenilir çilingiri seçebilirsiniz.`
                        },
                        {
                            id: 9,
                            question: `${serviceInfo.title} için hangi marka kilitler/ürünler kullanılmaktadır?`,
                            answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti sunan çilingirlerimiz genellikle Kale, Yale, Mul-T-Lock, Mottura gibi güvenilir ve kaliteli markaların ürünlerini kullanmaktadır. İhtiyacınıza ve bütçenize göre farklı marka ve model seçenekleri sunulmaktadır. Kullanılacak ürünlerle ilgili çilingir ustasından detaylı bilgi alabilirsiniz.`
                        },
                        {
                            id: 10,
                            question: `${formattedName}'de ${serviceInfo.title} hizmeti için önceden randevu almam gerekiyor mu?`,
                            answer: `${formattedName}'de ${serviceInfo.title.toLowerCase()} hizmeti için genellikle acil durumlar (kapı açma, anahtar kırılması vb.) için anında hizmet verilmektedir. Ancak kilit değişimi, kapı montajı gibi planlı işler için randevu alınması önerilir. BiÇilingir platformu üzerinden tercih ettiğiniz çilingir ile iletişime geçerek randevu oluşturabilirsiniz.`
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
        }

        // Normal ilçe sayfası durumu
        // Şehir bilgilerini çek
        const { data: cityData, error: cityError } = await supabase
            .from('provinces')
            .select('id, name, slug')
            .eq('slug', citySlug)
            .single();

        if (cityError) {
            console.error('Şehir bilgisi alınamadı #District-1');
            throw new Error('Şehir bulunamadı');
        }

        // İlçe bilgilerini çek
        const { data: districtData, error: districtError } = await supabase
            .from('districts')
            .select('id, name, slug, lat, lng, description')
            .eq('slug', districtSlug)
            .eq('province_id', cityData.id)
            .single();

        if (districtError) {
            console.error('İlçe bilgisi alınamadı');
            throw new Error('İlçe bulunamadı');
        }

        districtData.slug = citySlug + '/' + districtSlug;

        // Mahalleleri çek
        const { data: neighborhoodsData, error: neighborhoodError } = await supabase
            .from('neighborhoods')
            .select('id, name, slug')
            .eq('district_id', districtData.id)
            .order('name');

        if (neighborhoodError) {
            console.error('Mahalle bilgileri alınamadı');
        }

        neighborhoodsData.forEach(neighborhood => {
            neighborhood.name = neighborhood.name + ' Mahallesi';
            neighborhood.slug = citySlug + '/' + districtSlug + '/' + neighborhood.slug;
        });

        // Hizmet türlerini çek
        const { data: servicesData, error: serviceError } = await supabase
            .from('services')
            .select('id, name, description, slug, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
            .eq('isActive', true)
            .order('name');

        if (serviceError) {
            console.error('Hizmet bilgileri alınamadı');
        }

        // servicesData.forEach(service => {
        //     service.slug = citySlug + '/' + districtSlug + '/' + service.slug;
        // });

        // İlçe bilgilerini hazırla
        const districtInfo = {
            name: districtData.name,
            city: cityData.name,
            description: `${cityData.name} ${districtData.name} de çilingir hizmetine mi ihtiyacınız var? ${districtData.name} ilçesinde biçok çilingir hizmetleri geniş bir ağla sunulmaktadır. Aşağıda listelenen çilingirlerin hepsi ${cityData.name} ${districtData.name} ilçesinde hizmet vermektedir.`,
            longDescription: `${cityData.name} ${districtData.name} de çilingir hizmetleri geniş bir ağla sunulmaktadır. Biçok çilingir bölgede aktif olarak hizmet vermektedir.\n${cityData.name} ${districtData.name} de çilingir fiyatı, ilçe ve hizmete göre değişkenlikler göstermektedir. ${cityData.name} ${districtData.name} de ev çilingiri, otomobil çilingiri, acil çilingir, 724 çilingir hizmetleri bulmak oldukça kolaydır.\nBiÇilingir ile en yakın çilingiri saniyeler içinde bulabilir ve hemen arayabilirsiniz. Hizmetlere göre güncel yaklaşık fiyat bilgilerini görebilirsiniz. Net fiyat bilgisi için çilingir ile telefonda görüşebilirsiniz.`,
            districtDescription: districtData.description || null, // İlçe description alanı
            neighborhoods: neighborhoodsData ? neighborhoodsData : [],
            location: { lat: districtData.lat, lng: districtData.lng }
        };

        // SideMenu için parametreleri hazırla
        const sideMenuParams = {
            map: {
                locksmithPositions: locksmiths.length > 0 ? locksmiths.map(locksmith => ({
                    position: locksmith.location,
                    title: locksmith.name,
                    description: locksmith.description,
                })) : [],
                mapCenter: districtInfo.location
            },
            nearbySection: {
                title: 'Yakındaki Mahalleler',
                description: '',
                data: districtInfo.neighborhoods
                    .slice(0, 20) // Sayfa performansı için ilk 20 mahalleyi göster
                    .map((neighborhood, idx) => ({
                        id: idx + 1,
                        name: neighborhood.name,
                        slug: neighborhood.slug
                    }))
            },
            locksmithPricing: {
                title: 'Çilingir Hizmetleri Fiyatları',
                description: 'Çilingir hizmetleri fiyatları çeşitli faktörlere göre değişebilir',
                data: servicesData.map(service => ({
                    name: service.name,
                    description: service.description,
                    price1: { min: service.minPriceMesai, max: service.maxPriceMesai },
                    price2: { min: service.minPriceAksam, max: service.maxPriceAksam },
                    price3: { min: service.minPriceGece, max: service.maxPriceGece }
                }))
            },
            categorySection: {
                title: 'Çilingir Hizmetleri Kategorileri',
                description: '',
                data: servicesData.map(service => ({
                    id: service.id,
                    name: service.name,
                    // slug: service.slug
                }))
            },
            formattedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'district'
        };

        // MainContent için parametreleri hazırla
        const mainContentParams = {
            citySlug: citySlug,
            districtSlug: districtSlug,
            cityId: cityData.id,
            districtId: districtData.id,
            navbarList: [
                { id: 1, name: 'Ana Sayfa', slug: '/' },
                { id: 2, name: districtInfo.city, slug: `/${citySlug}` },
                { id: 3, name: districtInfo.name, slug: '#' }
            ],
            mainCard: {
                title: `${districtInfo.city} ${districtInfo.name} Çilingir Anahtarcı -  En Yakın Çilingir Hizmeti`,
                description: `${districtInfo.city} ${districtInfo.name} ilçesinde çilingir ve anahtarcı hizmetine mi ihtiyacınız var? ${districtInfo.name} çilingir, ${districtInfo.name} anahtarcı ve ${districtInfo.name} oto çilingir hizmetleri geniş bir ağla sunulmaktadır. ${districtInfo.name} en yakın çilingir ve ${districtInfo.name} en yakın anahtarcı hizmeti için aşağıda listelenen çilingirlerin hepsi ${districtInfo.city} ${districtInfo.name} ilçesinde hizmet vermektedir. ${districtInfo.name} çilingir numarası ile hemen iletişime geçebilirsiniz.`
            },
            locksmitList: {
                title: `${districtInfo.city} ${districtInfo.name} Çilingirler ve Anahtarcılar - ${districtInfo.name} En Yakın Çilingir`,
                description: `${districtInfo.name} en yakın çilingir ve ${districtInfo.name} en yakın anahtarcı hizmeti için size en yakın çilingirler bulundu. ${districtInfo.name} çilingir telefonu ile hemen arayabilir, ${districtInfo.name} anahtarcı hizmeti alabilirsiniz. Tüm çilingirler şuan açık ve 7/24 hizmet vermektedir. \n${districtInfo.name} ilçesinde ${locksmiths.length} çilingir bulundu. Hemen ara!`,
                data: locksmiths
            },
            seconCard: {
                title: `${districtInfo.name} Çilingir ve Anahtarcı Hizmetleri Hakkında`,
                longDescription: `${districtInfo.city} ${districtInfo.name} ilçesinde çilingir hizmetleri geniş bir ağla sunulmaktadır. ${districtInfo.name} çilingir, ${districtInfo.name} anahtarcı ve ${districtInfo.name} oto çilingir hizmetleri için birçok çilingir bölgede aktif olarak hizmet vermektedir.\n\n${districtInfo.city} ${districtInfo.name} ilçesinde çilingir fiyatları, ilçe ve hizmete göre değişkenlikler göstermektedir. ${districtInfo.name} çilingir fiyatları, ${districtInfo.name} anahtarcı fiyatları ve ${districtInfo.name} oto çilingir fiyatları hizmet türüne göre değişmektedir. ${districtInfo.city} ${districtInfo.name} ilçesinde ev çilingiri, otomobil çilingiri, acil çilingir, 7/24 çilingir, kasa çilingiri ve anahtar kopyalama hizmetleri bulmak oldukça kolaydır.\n\n${districtInfo.name} en yakın çilingir ve ${districtInfo.name} en yakın anahtarcı hizmeti için BiÇilingir ile en yakın çilingiri saniyeler içinde bulabilir ve hemen arayabilirsiniz. ${districtInfo.name} çilingir numarası ile iletişime geçerek hizmetlere göre güncel yaklaşık fiyat bilgilerini görebilirsiniz. Net fiyat bilgisi için ${districtInfo.name} çilingir ile telefonda görüşebilirsiniz.\n\n${districtInfo.name} oto çilingir hizmetleri kapsamında araç anahtarı kopyalama, oto anahtar yapımı, motor anahtar, araç kapısı açma ve immobilizer programlama gibi tüm hizmetler sunulmaktadır. ${districtInfo.name} anahtarcı hizmetleri için ev anahtarı kopyalama, anahtar çoğaltma ve özel kilit sistemleri için anahtar yapımı hizmetleri mevcuttur.`
            },
            districtDescription: districtInfo.districtDescription, // İlçe description alanı
            serviceList: {
                title: `${districtInfo.name} Çilingir Anahtarcı Hizmetleri`,
                description: `${districtInfo.name} ilçesinde aşağıdaki çilingir hizmetleri bölgenizdeki çilingirler ve anahtarcılar tarafından verilmektedir. ${districtInfo.name} çilingir, ${districtInfo.name} anahtarcı, ${districtInfo.name} oto çilingir, ${districtInfo.name} kasa çilingiri ve ${districtInfo.name} acil çilingir hizmetleri için aşağıdaki kategorilerden seçim yapabilirsiniz.`,
                data: servicesData,
                neighborhoods: districtInfo.neighborhoods,
                name: districtInfo.name
            },
            sssList: {
                title: `${districtInfo.city} ${districtInfo.name} Çilingir Hizmetleri - Sık Sorulan Sorular`,
                description: `${districtInfo.name} çilingir, ${districtInfo.name} anahtarcı ve ${districtInfo.name} oto çilingir hizmetleri hakkında merak edilenler`,
                data: [
                    {
                        id: 1,
                        question: `${districtInfo.city} ${districtInfo.name}'de en yakın çilingir ve en yakın anahtarcı nerede?`,
                        answer: `BiÇilingir platformu sayesinde ${districtInfo.city} ${districtInfo.name} ilçesinin tüm mahallelerinde hizmet veren ${districtInfo.name} en yakın çilingir ve ${districtInfo.name} en yakın anahtarcı hizmetini bulabilir, fiyatları görebilirsiniz. ${districtInfo.name} çilingir numarası ile arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz. ${districtInfo.name} anahtarcı ve ${districtInfo.name} çilingir hizmetleri için 7/24 hizmet veren ekiplerimiz bulunmaktadır.`
                    },
                    {
                        id: 2,
                        question: `${districtInfo.city} ${districtInfo.name}'de çilingir fiyatları ve ücretleri ne kadar?`,
                        answer: `${districtInfo.city} ${districtInfo.name} ilçesinde ${districtInfo.name} çilingir fiyatları genellikle 300₺ ile 1000₺ arasında değişmektedir. ${districtInfo.name} kapı açma ücreti ortalama 300₺-500₺, ${districtInfo.name} kilit değiştirme fiyatı 500₺-1000₺, ${districtInfo.name} çelik kapı çilingir fiyatları ise 500₺-1500₺ arasındadır. ${districtInfo.name} oto çilingir fiyatı, ${districtInfo.name} anahtar kopyalama fiyatı ve ${districtInfo.name} kasa çilingir fiyatı hizmet türüne göre değişiklik gösterebilir. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.`
                    },
                    {
                        id: 3,
                        question: `${districtInfo.city} ${districtInfo.name}'de gece çilingir hizmeti alabilir miyim?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name} ilçesinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.`
                    },
                    {
                        id: 4,
                        question: `${districtInfo.city} ${districtInfo.name}'de oto çilingir ve en yakın oto kilitçi hizmeti var mı?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name} ilçesinde ${districtInfo.name} oto çilingir hizmeti veren birçok uzman ekip bulunmaktadır. ${districtInfo.name} en yakın oto kilitçi ve ${districtInfo.name} oto anahtarcı hizmetleri kapsamında araç anahtarı kopyalama, oto anahtar kopyalama, kayıp anahtar yerine yenisini yapma, immobilizer programlama, motor anahtar, moto anahtar ve araç kapısı açma gibi tüm hizmetler sunulmaktadır. ${districtInfo.name} oto çilingir fiyatları için detaylı bilgi almak isterseniz, ${districtInfo.name} en yakın oto çilingiri BiÇilingir ile bulabilir ve hemen arayabilirsiniz.`
                    },
                    {
                        id: 5,
                        question: `${districtInfo.city} ${districtInfo.name}'de çilingir kaç dakikada gelir?`,
                        answer: `${districtInfo.city} ${districtInfo.name} ilçesinde çilingirler genellikle bulunduğunuz konuma göre 15-30 dakika içerisinde gelebilmektedir. Acil durumlarda ve yoğun olmayan saatlerde daha hızlı ulaşım sağlanabilmektedir. Trafik durumu ve mesafeye bağlı olarak bu süre değişiklik gösterebilir.`
                    },
                    {
                        id: 6,
                        question: `${districtInfo.city} ${districtInfo.name}'de 7/24 açık çilingir ve acil çilingir hizmeti var mı?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name} ilçesinde ${districtInfo.name} 7/24 açık çilingir ve ${districtInfo.name} acil çilingir hizmeti veren işletmeler bulunmaktadır. ${districtInfo.name} çilingirler 7/24 açık olarak hizmet vermektedir. BiÇilingir platformu üzerinden istediğiniz saat diliminde ${districtInfo.name} çilingir numarası ile hizmet veren çilingirleri bulabilir ve acil durumlarınızda iletişime geçebilirsiniz. ${districtInfo.name} en yakın çilingir hizmeti için 7/24 hizmet veren ekiplerimiz mevcuttur.`
                    },
                    {
                        id: 7,
                        question: `${districtInfo.city} ${districtInfo.name}'de güvenilir çilingir nasıl anlaşılır?`,
                        answer: `Güvenilir çilingir seçiminde dikkat etmeniz gereken noktalar: Resmî kimlik ve iş kartı göstermesi, önceden fiyat bilgisi vermesi, müşteri yorumlarının olumlu olması ve profesyonel ekipmanlar kullanmasıdır. BiÇilingir platformunda listelenen çilingirler belirli kriterlere göre değerlendirilmekte ve güvenilirlik esas alınmaktadır.`
                    },
                    {
                        id: 8,
                        question: `${districtInfo.city} ${districtInfo.name}'de anahtar kapıda kaldı, en yakın çilingir anahtarcı hizmeti nasıl alabilirim?`,
                        answer: `Anahtarınız kapıda kaldıysa, BiÇilingir platformu üzerinden ${districtInfo.city} ${districtInfo.name}'de ${districtInfo.name} en yakın çilingir anahtarcı hizmetini bulabilir ve hemen iletişime geçebilirsiniz. ${districtInfo.name} en yakın anahtarcı ve ${districtInfo.name} en yakın çilingir hizmeti için ${districtInfo.name} çilingir numarası ile arayabilirsiniz. Çilingir gelene kadar kapıya zarar vermemeye çalışın. ${districtInfo.name} çilingirlerimiz özel aletlerle kapınıza zarar vermeden açma işlemi gerçekleştirebilmektedir.`
                    },
                    {
                        id: 9,
                        question: `${districtInfo.city} ${districtInfo.name}'de kapı kilidi kırıldı, çilingir hizmeti nasıl alabilirim?`,
                        answer: `${districtInfo.name} ilçesinde kapı kilidiniz kırıldıysa, öncelikle güvenliğiniz için geçici önlemler alın ve hemen BiÇilingir üzerinden ${districtInfo.city} ${districtInfo.name}'de ${districtInfo.name} çilingir hizmeti veren bir çilingir ile iletişime geçin. ${districtInfo.name} çilingirlerimiz kapı kilidi değişimi, çelik kapı çilingir ve tamir hizmetleri de sunmaktadır. ${districtInfo.name} çelik kapı çilingir fiyatları ve ${districtInfo.name} kapı kilidi değişim fiyatları için ${districtInfo.name} çilingir ile görüşebilirsiniz. Size uygun yeni kilit modelleri ve güvenlik önerileri konusunda da yardımcı olacaklardır.`
                    },
                    {
                        id: 10,
                        question: `${districtInfo.city} ${districtInfo.name}'de çilingirler kredi kartı kabul ediyor mu?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name}'de bulunan çilingirlerin çoğu nakit ödemenin yanı sıra kredi kartı, banka kartı ve bazı durumlarda mobil ödeme seçenekleri de sunmaktadır. Ödeme seçenekleri hakkında bilgi almak için hizmet öncesinde çilingir ile görüşebilirsiniz. BiÇilingir platformumuzda ödeme seçeneklerini gösteren filtreleme özelliği de bulunmaktadır.`
                    },
                    {
                        id: 11,
                        question: `${districtInfo.city} ${districtInfo.name}'de parmak izi kilit sistemi kurulumu yapılıyor mu?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name}'de çilingirlerimiz arasında parmak izi, kart okuyuculu ve şifreli elektronik kilit sistemleri kurulumu yapan uzmanlar bulunmaktadır. Modern güvenlik sistemleri için BiÇilingir platformumuzdan bu hizmeti veren çilingirleri filtreleyerek bulabilirsiniz. Akıllı kilit sistemleri kurulum fiyatları kilit markası ve modeline göre değişiklik göstermektedir.`
                    },
                    {
                        id: 12,
                        question: `Çocuğum evde kilitli kaldı, ${districtInfo.city} ${districtInfo.name}'de acil çilingir hizmeti nasıl alabilirim?`,
                        answer: `Çocuğunuz evde kilitli kaldıysa, hemen BiÇilingir platformu üzerinden ${districtInfo.city} ${districtInfo.name}'de acil çilingir hizmeti alabilirsiniz. Acil durum olduğunu belirtirseniz, çilingirler öncelikli olarak size hizmet verecektir. Size en yakın çilingiri bulup, doğrudan arayarak durumu açıklayabilirsiniz. Bu tür acil durumlarda çilingirler genellikle 15 dakika içinde ulaşmaya çalışırlar.`
                    },
                    {
                        id: 13,
                        question: `${districtInfo.city} ${districtInfo.name}'de çelik kasam açılmıyor, kasa açma hizmeti nerede bulabilirim?`,
                        answer: `${districtInfo.city} ${districtInfo.name}'de kasa açma konusunda uzmanlaşmış çilingirlerimiz mevcuttur. BiÇilingir platformumuzda 'kasa çilingiri' filtresini kullanarak size en yakın kasa çilingirini bulabilirsiniz. Profesyonel çilingirlerimiz, çelik kasa, elektronik kasa ve şifreli kasa gibi farklı kasa tipleri için açma hizmeti sunmaktadır. Hizmet sırasında kasa sahibi olduğunuzu kanıtlamanız gerektiğini unutmayınız.`
                    },
                    {
                        id: 14,
                        question: `${districtInfo.city} ${districtInfo.name}'de multilock kilit için anahtar kopyalama yapan çilingir var mı?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name}'de Multilock, Kale, Yale gibi yüksek güvenlikli kilit sistemleri için anahtar kopyalama hizmeti veren uzman çilingirlerimiz bulunmaktadır. Bu özel anahtarlar için orijinal makine ve ekipmanlarla çalışan çilingirleri BiÇilingir platformumuzda bulabilirsiniz. Güvenlik sertifikalı anahtarlar için kilit kartınızı yanınızda bulundurmanız gerekebilir.`
                    },
                    {
                        id: 15,
                        question: `${districtInfo.city} ${districtInfo.name}'de immobilizer anahtar kopyalama ve kodlama yapılır mı?`,
                        answer: `Evet, ${districtInfo.city} ${districtInfo.name}'de ${districtInfo.name} oto çilingir hizmetleri kapsamında immobilizer (çipli) araç anahtarı kopyalama ve kodlama hizmeti veren oto çilingirlerimiz mevcuttur. ${districtInfo.name} oto anahtarcı uzmanlarımız modern araçların çipli anahtarları için özel ekipmanlarla profesyonel hizmet sunmaktadır. BiÇilingir platformumuzda ${districtInfo.name} oto çilingiri kategorisinde, aracınızın markasına uygun hizmet veren çilingirleri bulabilirsiniz. ${districtInfo.name} oto anahtar kopyalama fiyatı için ${districtInfo.name} çilingir telefonu ile iletişime geçebilirsiniz.`
                    },
                    {
                        id: 16,
                        question: `${districtInfo.name} anahtarcı ve ${districtInfo.name} çilingir arasındaki fark nedir?`,
                        answer: `${districtInfo.name} anahtarcı genellikle anahtar kopyalama, anahtar çoğaltma ve basit kilit işlemleri yaparken, ${districtInfo.name} çilingir daha kapsamlı hizmetler sunmaktadır. ${districtInfo.name} çilingir hizmetleri kapı açma, kilit değişimi, çelik kapı çilingir, kasa çilingiri ve oto çilingir gibi tüm hizmetleri içermektedir. ${districtInfo.name} anahtarcı hizmetleri ise daha çok anahtar yapımı ve kopyalama üzerine odaklanmaktadır. Her iki hizmet de ${districtInfo.name} ilçesinde mevcuttur.`
                    },
                    {
                        id: 17,
                        question: `${districtInfo.name} en yakın çilingir anahtarcı hizmeti ne kadar sürede gelir?`,
                        answer: `${districtInfo.name} en yakın çilingir anahtarcı hizmeti genellikle 15-30 dakika içinde adresinize ulaşmaktadır. ${districtInfo.name} en yakın anahtarcı ve ${districtInfo.name} en yakın çilingir hizmeti için ${districtInfo.name} çilingir numarası ile iletişime geçtiğinizde, konumunuza göre en kısa sürede hizmet verilecektir. Acil durumlarda ${districtInfo.name} çilingirlerimiz daha hızlı ulaşım sağlamaktadır.`
                    }
                ]
            },
            detailedDistrictList: {
                title: `${districtInfo.city} ${districtInfo.name} Mahalleleri`,
                description: `${districtInfo.city} ${districtInfo.name} de çilingir hizmetleri verilen mahalleler`,
                secondTitle: 'Mahalleler',
                data: districtInfo.neighborhoods.map((neighborhood, idx) => ({
                    id: idx + 1,
                    name: `${neighborhood.name}`,
                    slug: neighborhood.slug
                }))
            },
            sideMenuParams: sideMenuParams,
            formatedName: `${districtInfo.city} ${districtInfo.name}`,
            type: 'district'
        };

        return {
            locksmiths,
            metadata,
            districtInfo,
            sideMenuParams,
            mainContentParams,
            servicesData
        };
    } catch (error) {
        notFound();
    }
}

// Metadata fonksiyonu - sunucu tarafında çalışır
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug } = resolvedParams;

    const { metadata } = await getDistrictData(citySlug, districtSlug, null);
    return metadata;
}

// Bu sayfa otomatik olarak sunucu tarafında render edilir
export default async function DistrictPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug, district: districtSlug } = resolvedParams;

    // Eğer district bir servis slug'ı ise, şehir sayfasına redirect et
    const isService = ServiceList.some(service => service.slug === districtSlug);
    if (isService) {
        permanentRedirect(`/${citySlug}`);
    }

    // Normal ilçe sayfası durumu
    const result = await getDistrictData(citySlug, districtSlug, null);
    const structuredData = result.metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <DistrictContent
                citySlug={citySlug}
                districtSlug={districtSlug}
                locksmiths={result.locksmiths}
                districtInfo={result.districtInfo}
                sideMenuParams={result.sideMenuParams}
                mainContentParams={result.mainContentParams}
            />
        </>
    );
}

// Static generation yapılandırma ayarları
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 5;