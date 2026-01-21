// Dinamik şehir sayfası - SEO odaklı ilçe rehberi
// Artık çilingir listelemiyor, ilçelere yönlendiriyor

import Script from 'next/script';
import { getSupabaseServer } from '../../lib/supabase';
import { notFound } from 'next/navigation';
import { getMetaData } from '../utils/seo';
import { getBulunmaEki, yerIsmiBulunmaEkiEkle } from '../utils/stringUtils';
import CityPageContent from '../../components/city/CityPageContent';
import { ServiceList } from '../../lib/service-list';

// Build zamanında tarih oluştur (SSG için)
const BUILD_DATE = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});


// Build zamanında tüm şehir sluglarını getir - TÜM İLLER için SSG
export async function generateStaticParams() {
    try {
        const supabase = getSupabaseServer();

        // TÜM aktif şehirler için static generate et
        const { data: cities, error } = await supabase
            .from('provinces')
            .select('slug');

        if (error) {
            console.error('Şehir slugları alınırken hata:', error);
            return [];
        }

        return cities.map((city) => ({
            city: city.slug,
        }));
    } catch (error) {
        console.error('generateStaticParams hatası:', error);
        return [];
    }
}

// Sunucu tarafında tüm verileri yükleyen yardımcı fonksiyon
async function getCityData(citySlug) {
    try {
        const supabase = getSupabaseServer();

        // Şehir bilgilerini çek
        const { data: cityData, error: cityError } = await supabase
            .from('provinces')
            .select('id, name, slug, lat, lng, description')
            .eq('slug', citySlug)
            .single();

        if (cityError || !cityData) {
            console.error('Şehir bilgisi alınamadı');
            throw new Error('Şehir bilgisi alınamadı');
        }

        // İlçeleri region bilgisiyle birlikte çek
        const { data: districtsData, error: districtsError } = await supabase
            .from('districts')
            .select('id, name, slug, region')
            .eq('province_id', cityData.id)
            .order('name', { ascending: true });

        if (districtsError || !districtsData) {
            console.error('İlçe bilgisi alınamadı');
            throw new Error('İlçeler bulunamadı');
        }

        // Hizmet fiyatlarını veritabanından çek
        const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('id, name, slug, minPriceMesai, maxPriceMesai, note')
            .eq('isActive', true)
            .order('sortOrder', { ascending: true });

        // İlçeleri bölgeye göre ayır (İstanbul için)
        const avrupaDistricts = districtsData.filter(d => d.region === 'avrupa');
        const anadoluDistricts = districtsData.filter(d => d.region === 'anadolu');
        const hasRegion = avrupaDistricts.length > 0 && anadoluDistricts.length > 0;

        // Metadata oluştur
        const metadata = await getMetaData({
            citySlug,
            districtSlug: null,
            neighborhoodSlug: null,
            servicetypeSlug: null,
            locksmiths: null
        });

        // SSS listesini hazırla
        const faqList = generateFAQList(cityData.name, hasRegion);

        // Popüler ilçeler (ilk 6 veya belirli ilçeler)
        const popularDistricts = getPopularDistricts(citySlug, districtsData);

        // Fiyat verilerini servicesData'dan oluştur
        const priceData = buildPriceData(servicesData || []);

        return {
            cityData,
            districts: districtsData,
            avrupaDistricts,
            anadoluDistricts,
            hasRegion,
            metadata,
            faqList,
            popularDistricts,
            priceData
        };
    } catch (error) {
        console.error('getCityData hatası:', error);
        notFound();
    }
}

// Fiyat verilerini servicesData'dan oluştur
function buildPriceData(servicesData) {
    const priceMap = {};

    // Slug'a göre fiyat verilerini eşleştir
    const slugMapping = {
        'acil-cilingir': 'kapiAcma',
        'ev-cilingir': 'kilitDegistirme',
        'anahtar-kopyalama': 'anahtarKopyalama',
        'otomobil-cilingir': 'otoCilingir',
        'kasa-cilingir': 'kasaCilingir'
    };

    servicesData.forEach(service => {
        const key = slugMapping[service.slug];
        if (key) {
            priceMap[key] = {
                min: service.minPriceMesai || 0,
                max: service.maxPriceMesai || 0,
                note: service.note || ''
            };
        }
    });

    // Varsayılan değerler (veritabanında yoksa)
    return {
        kapiAcma: priceMap.kapiAcma || { min: 300, max: 600, note: 'Normal kapı ve çelik kapı dahil' },
        kilitDegistirme: priceMap.kilitDegistirme || { min: 400, max: 1000, note: 'Kilit modeline göre değişir' },
        anahtarKopyalama: priceMap.anahtarKopyalama || { min: 50, max: 200, note: 'Normal ve güvenlikli anahtar' },
        otoCilingir: priceMap.otoCilingir || { min: 400, max: 1200, note: 'Araç modeline göre değişir' },
        kasaCilingir: priceMap.kasaCilingir || { min: 500, max: 1500, note: 'Kasa modeline göre değişir' }
    };
}

// Popüler ilçeleri belirle
function getPopularDistricts(citySlug, allDistricts) {
    const popularMap = {
        'istanbul': ['kadikoy', 'besiktas', 'sisli', 'uskudar', 'bakirkoy', 'fatih', 'maltepe', 'pendik', 'umraniye', 'beylikduzu', 'esenyurt', 'bagcilar'],
        'bursa': ['osmangazi', 'nilufer', 'yildirim', 'gemlik', 'mudanya', 'inegol'],
        'ankara': ['cankaya', 'kecioren', 'mamak', 'yenimahalle', 'etimesgut', 'sincan'],
        'izmir': ['konak', 'karsiyaka', 'bornova', 'buca', 'cigli', 'bayrakli']
    };

    const popularSlugs = popularMap[citySlug] || [];

    if (popularSlugs.length === 0) {
        return allDistricts.slice(0, 6);
    }

    const popular = popularSlugs
        .map(slug => allDistricts.find(d => d.slug === slug))
        .filter(Boolean);

    return popular.length > 0 ? popular : allDistricts.slice(0, 6);
}

// SSS listesi oluştur
function generateFAQList(cityName, hasRegion) {
    const bulunmaEki = getBulunmaEki(cityName);

    return [
        {
            question: `${cityName}'da gece çilingir bulunur mu?`,
            answer: `Evet, ${cityName}'da 7/24 hizmet veren çilingirler bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde BiÇilingir üzerinden size en yakın çilingiri bulabilirsiniz. Gece hizmeti için ek ücret uygulanabileceğini unutmayınız.`
        },
        {
            question: `${cityName} çilingir fiyatları neye göre değişir?`,
            answer: `${cityName}'da çilingir fiyatları; hizmet türüne (kapı açma, kilit değiştirme, anahtar kopyalama), kapı ve kilit modeline, hizmet saatine (gündüz, akşam, gece) ve ilçeye göre değişiklik göstermektedir. Kesin fiyat için çilingir ile önceden görüşmeniz önerilir.`
        },
        {
            question: `${cityName}'da tüm ilçelere aynı gün hizmet var mı?`,
            answer: `Evet, ${cityName}'${bulunmaEki} ${hasRegion ? 'Avrupa ve Anadolu Yakası dahil ' : ''}tüm ilçelerde aynı gün çilingir hizmeti alabilirsiniz. BiÇilingir platformu üzerinden ilçenizi seçerek size en yakın çilingiri bulabilir ve ortalama 15-30 dakika içinde hizmet alabilirsiniz.`
        },
        {
            question: `${cityName}'da çilingir kaç dakikada gelir?`,
            answer: `${cityName}'da çilingirler genellikle bulunduğunuz konuma göre 15-30 dakika içerisinde gelebilmektedir. Trafik durumu ve mesafeye bağlı olarak bu süre değişebilir. Acil durumlarda ve yoğun olmayan saatlerde daha hızlı ulaşım sağlanabilir.`
        },
        {
            question: `Çilingir kapıyı hasarsız açar mı?`,
            answer: `Evet, profesyonel çilingirler özel aletler kullanarak kapıyı ve kilidi hasarsız açabilirler. BiÇilingir platformundaki çilingirlerimiz, hasarsız açma konusunda deneyimlidir. Ancak bazı yüksek güvenlikli veya hasarlı kilitlerin açılması daha zor olabilir.`
        },
        {
            question: `${cityName}'da oto çilingir hizmeti var mı?`,
            answer: `Evet, ${cityName}'da araç kapısı açma, araç anahtarı kopyalama, immobilizer programlama ve kontak kilidi tamiri gibi oto çilingir hizmetleri verilmektedir. BiÇilingir üzerinden aracınızın markasına uygun hizmet veren oto çilingirlerini bulabilirsiniz.`
        }
    ];
}

// Metadata fonksiyonu
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getCityData(resolvedParams.city);
    return metadata;
}

// Ana sayfa komponenti
export default async function CityPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug } = resolvedParams;

    // Tüm verileri çek
    const {
        cityData,
        districts,
        avrupaDistricts,
        anadoluDistricts,
        hasRegion,
        metadata,
        faqList,
        popularDistricts,
        priceData
    } = await getCityData(citySlug);

    // Structured data
    const structuredData = metadata?.other?.structuredData;

    // FAQ Schema oluştur
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqList.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    // Local Business Schema
    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `${cityData.name} Çilingir Hizmetleri`,
        "description": `${cityData.name} genelinde 7/24 acil çilingir, oto çilingir ve anahtarcı hizmetleri`,
        "areaServed": {
            "@type": "City",
            "name": cityData.name
        },
        "serviceType": ["Çilingir", "Anahtarcı", "Oto Çilingir", "Acil Çilingir"],
        "openingHours": "Mo-Su 00:00-24:00"
    };

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <Script id="faq-schema" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(faqSchema)}
            </Script>
            <Script id="local-business-schema" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(localBusinessSchema)}
            </Script>

            <CityPageContent
                cityName={cityData.name}
                citySlug={citySlug}
                districts={districts}
                services={ServiceList}
                hasRegion={hasRegion}
                avrupaDistricts={avrupaDistricts}
                anadoluDistricts={anadoluDistricts}
                popularDistricts={popularDistricts}
                faqList={faqList}
                priceData={priceData}
                buildDate={BUILD_DATE}
                description={cityData.description}
            />
        </>
    );
}

// Static generation yapılandırma - Vercel CDN için optimize
export const dynamic = 'force-static';
export const dynamicParams = false; // Sadece generateStaticParams'dan gelen sayfalar oluşturulsun
export const revalidate = false; // ISR kapalı, tam statik
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 10;
