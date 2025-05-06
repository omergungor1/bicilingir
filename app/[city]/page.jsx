// http://localhost:3000/sehirler/bursa

import CityContent from '../../components/city/CityContent';
import { getMetaData, getLocksmithsList, prepareStructuredData } from '../utils/seo';
import Script from 'next/script';
import { getSupabaseServer } from '../../lib/supabase';

// Sunucu tarafında tüm verileri yükleyen yardımcı fonksiyon
async function getCityData(citySlug) {
    console.log('Fetching city data for:', citySlug);

    // Supabase client
    const supabase = getSupabaseServer();

    // Her iki veri isteğini paralel olarak çalıştır
    const locksmiths = await getLocksmithsList({ citySlug, count: 2 });
    const metadata = await getMetaData({
        citySlug,
        districtSlug: null,
        neighborhoodSlug: null,
        servicetypeSlug: null,
        locksmiths
    });

    // Şehir bilgilerini çek
    const { data: cityData, error: cityError } = await supabase
        .from('provinces')
        .select('id, name, lat, lng')
        .eq('slug', citySlug)
        .single();

    if (cityError || !cityData) {
        console.error('Şehir bilgisi alınamadı:', cityError);
        throw new Error('Şehir bulunamadı');
    }

    // İlçeleri çek
    const { data: districtsData, error: districtsError } = await supabase
        .from('districts')
        .select('id, name, slug')
        .eq('province_id', cityData.id);

    if (districtsError || !districtsData) {
        console.error('İlçe bilgisi alınamadı:', districtsError);
        throw new Error('İlçeler bulunamadı');
    }

    districtsData.forEach(district => {
        district.slug = citySlug + '/' + district.slug;
    });

    // Hizmetleri çek
    const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('id, name, slug, description, minPriceMesai, maxPriceMesai, minPriceAksam, maxPriceAksam, minPriceGece, maxPriceGece')
        .eq('isActive', true);

    if (servicesError || !servicesData) {
        console.error('Hizmet bilgisi alınamadı:', servicesError);
        throw new Error('Hizmet bulunamadı');
    }

    servicesData.forEach(service => {
        service.slug = citySlug + '/' + service.slug;
    });

    // SideMenu için parametreleri hazırla
    const sideMenuParams = {
        map: {
            locksmithPositions: locksmiths.map(locksmith => ({
                position: { lat: locksmith.location.lat, lng: locksmith.location.lng },
                title: locksmith.name,
                description: locksmith.description,
            })),
            mapCenter: { lat: cityData.lat, lng: cityData.lng }
        },
        nearbySection: {
            title: 'Yakındaki İlçeler',
            description: '',
            data: districtsData.map(district => ({
                id: district.id,
                name: district.name,
                slug: district.slug
            }))
        },
        locksmithPricing: {
            title: 'Çilingir Hizmetleri Fiyatları',
            description: 'Çilingir hizmetleri fiyatları, çilingirin hizmet türüne, kapı modeline ve saate göre değişiklik gösterebilir. Fiyatlar yaklaşık değerlerdir. Kesin fiyat için çilingir ile görüşmeniz gerekmektedir.',
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
                slug: service.slug
            }))
        },
        formattedName: cityData.name,
        type: 'city'
    };

    // Şehir bilgilerini hazırla
    const cityInfoData = {
        id: 1,
        name: cityData.name,
        description: `${cityData.name} ilinde çilingir hizmetine mi ihtiyacınız var? ${cityData.name} ilindeki tüm çilingir hizmetleri geniş hizmet yelpazesi ile uzman çilingirler tarafından sunulmaktadır. Aşağıda listelenen çilingirlerin hepsi ${cityData.name} ilinde hizmet vermektedir.`,
        longDescription: `${cityData.name} ${cityData.name} ilindeki çilingir hizmetleri geniş bir ağla sunulmaktadır. Bir çok çilingir bölgede aktif olarak hizmet vermektedir.\n${cityData.name} ilindeki çilingir fiyatları, ilçe ve hizmete göre değişkenlikler göstermektedir. ${cityData.name} ilinde ev çilingiri, otomobil çilingiri, acil çilingir, 724 çilingir hizmetleri bulmak oldukça kolaydır.\nBiÇilingir ile en yakın çilingiri saniyeler içinde bulabilir ve hemen arayabilirsiniz. Hizmetlere göre güncel yaklaşık fiyat bilgilerini görebilirsiniz. Net fiyat bilgisi için çilingir ile telefonda görüşebilirsiniz.`,
        districts: districtsData,
        neighborhoods: [],
        location: { lat: cityData.lat, lng: cityData.lng }
    };

    // SSS listesini hazırla
    const sssList = [
        { id: 1, question: `${cityData.name}'de en yakın çilingir nerede?`, answer: `BiÇilingir platformu sayesinde ${cityData.name} ilçesinin tüm mahallelerinde hizmet veren en yakın çilingiri bulabilir, fiyatları görebilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.` },
        { id: 2, question: `${cityData.name}'de çilingir ücretleri ne kadar?`, answer: `${cityData.name} ilçesinde çilingir ücretleri genellikle 300₺ ile 1000₺ arasında değişmektedir. Kapı açma işlemleri ortalama 300₺-500₺, kilit değiştirme 500₺-1000₺, çelik kapı tamiri ise 500₺-1500₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.` },
        { id: 3, question: `${cityData.name}'de gece çilingir hizmeti alabilir miyim?`, answer: `Evet, ${cityData.name} ilçesinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.` },
        { id: 4, question: `${cityData.name}'de oto çilingir hizmeti var mı?`, answer: `Evet, ${cityData.name} ilçesinde uzman oto çilingir ekiplerimiz hizmet vermektedir. Araç anahtarı kopyalama, kayıp anahtar yerine yenisini yapma, immobilizer programlama ve araç kapısı açma gibi hizmetlerimiz bulunmaktadır.` },
    ];

    // MainContent için parametreleri hazırla
    const mainContentParams = {
        navbarList: [
            { id: 1, name: 'Ana Sayfa', slug: '/' },
            { id: 2, name: cityData.name, slug: '#' },
        ],
        mainCard: { title: `${cityData.name} Çilingir Anahtarcı`, description: cityInfoData.description },
        locksmitList: { title: `${cityData.name} Çilingirler`, description: `${cityData.name} ilinde hizmet veren çilingirler`, data: locksmiths },
        seconCard: { title: `${cityData.name} Hakkında`, longDescription: cityInfoData.longDescription },
        serviceList: { title: 'Çilingir Hizmetleri Kategorileri', description: '', data: servicesData, neighborhoods: districtsData },
        sssList: { title: `${cityData.name} Çilingir Sık Sorulan Sorular`, description: `${cityData.name} da bir çok kişi çilingirler hakkında bazı soruların cevabını merak ediyor. Sık sorulan soruların cevaplarını aşağıdaki listede bulabilirsiniz.`, data: sssList },
        detailedDistrictList: { title: `${cityData.name} Tüm İlçelerindeki Çilingirler`, description: `${cityData.name} da çilingir hizmetleri verilen ilçeler`, secondTitle: 'İlçeler', data: districtsData },
        sideMenuParams: sideMenuParams,
        formatedName: cityData.name,
        type: 'city'
    };

    return {
        locksmiths,
        metadata,
        cityData: cityInfoData,
        sideMenuParams,
        mainContentParams,
        sssList
    };
}

// Metadata fonksiyonu - bu sunucu tarafında çalışır
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getCityData(resolvedParams.city);
    return metadata;
}

// Bu sayfa otomatik olarak sunucu tarafında render edilir
export default async function CityPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug } = resolvedParams;

    // Tüm verileri çek ve sayfayı render etmeden önce hazırla
    const { locksmiths, metadata, cityData, sideMenuParams, mainContentParams, sssList } = await getCityData(citySlug);

    // Structured data bilgisi
    const structuredData = metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <CityContent
                citySlug={citySlug}
                locksmiths={locksmiths}
                cityData={cityData}
                sideMenuParams={sideMenuParams}
                mainContentParams={mainContentParams}
                sssList={sssList}
            />
        </>
    );
} 