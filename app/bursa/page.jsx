// Bursa şehir sayfası - SEO odaklı ilçe rehberi

import Script from 'next/script';
import { getSupabaseServer } from '../../lib/supabase';
import { getMetaData } from '../utils/seo';
import { getBulunmaEki } from '../utils/stringUtils';
import CityPageContent from '../../components/city/CityPageContent';
import { ServiceList } from '../../lib/service-list';

const CITY_SLUG = 'bursa';
const CITY_ID = 16;

// Metadata fonksiyonu
export async function generateMetadata() {
    const metadata = await getMetaData({
        citySlug: CITY_SLUG,
        districtSlug: null,
        neighborhoodSlug: null,
        servicetypeSlug: null,
        locksmiths: null
    });
    return metadata;
}

// Static generation için
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 5;

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

// SSS listesi
function generateFAQList(cityName) {
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
            answer: `Evet, ${cityName}'${bulunmaEki} tüm ilçelerde aynı gün çilingir hizmeti alabilirsiniz. BiÇilingir platformu üzerinden ilçenizi seçerek size en yakın çilingiri bulabilir ve ortalama 15-30 dakika içinde hizmet alabilirsiniz.`
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

// Ana sayfa komponenti
export default async function BursaPage() {
    const supabase = getSupabaseServer();

    // Şehir bilgilerini çek
    const { data: cityData } = await supabase
        .from('provinces')
        .select('id, name, slug, lat, lng')
        .eq('id', CITY_ID)
        .single();

    // İlçeleri çek
    const { data: districtsData } = await supabase
        .from('districts')
        .select('id, name, slug, region')
        .eq('province_id', CITY_ID)
        .order('name', { ascending: true });

    // Hizmet fiyatlarını veritabanından çek
    const { data: servicesData } = await supabase
        .from('services')
        .select('id, name, slug, minPriceMesai, maxPriceMesai, note')
        .eq('isActive', true)
        .order('sortOrder', { ascending: true });

    // Metadata'yı çek
    const metadata = await getMetaData({
        citySlug: CITY_SLUG,
        districtSlug: null,
        neighborhoodSlug: null,
        servicetypeSlug: null,
        locksmiths: null
    });

    const structuredData = metadata?.other?.structuredData;

    // Popüler ilçeler
    const popularSlugs = ['osmangazi', 'nilufer', 'yildirim', 'gemlik', 'mudanya', 'inegol'];
    const popularDistricts = popularSlugs
        .map(slug => districtsData?.find(d => d.slug === slug))
        .filter(Boolean);

    // SSS listesi
    const faqList = generateFAQList(cityData?.name || 'Bursa');

    // Fiyat verilerini servicesData'dan oluştur
    const priceData = buildPriceData(servicesData || []);

    // FAQ Schema
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
        "name": "Bursa Çilingir Hizmetleri",
        "description": "Bursa genelinde 7/24 acil çilingir, oto çilingir ve anahtarcı hizmetleri",
        "areaServed": {
            "@type": "City",
            "name": "Bursa"
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
                cityName={cityData?.name || 'Bursa'}
                citySlug={CITY_SLUG}
                districts={districtsData || []}
                services={ServiceList}
                hasRegion={false}
                avrupaDistricts={[]}
                anadoluDistricts={[]}
                popularDistricts={popularDistricts}
                faqList={faqList}
                priceData={priceData}
            />
        </>
    );
}
