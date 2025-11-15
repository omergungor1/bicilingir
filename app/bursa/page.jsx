import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { MapPin, Clock, Phone, Shield, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import turkiyeIlIlce from '../../data/turkiye-il-ilce';
import { ServiceList } from '../../lib/service-list';
import { getMetaData, getLocksmithsList } from '../utils/seo';
import { getBulunmaEki, yerIsmiBulunmaEkiEkle } from '../utils/stringUtils';
import ScrollToTopButton from './ScrollToTopButton';

// Bursa ilçelerini filtrele
const bursaDistricts = turkiyeIlIlce.districts.filter(district => district.province_id === 16);

// Metadata fonksiyonu
export async function generateMetadata() {
    const metadata = await getMetaData({
        citySlug: 'bursa',
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

// Ana sayfa komponenti
export default async function BursaPage() {
    // Çilingir listesini çek (gösterim için)
    const locksmiths = await getLocksmithsList({ citySlug: 'bursa', count: 2 });

    // Metadata'yı çek
    const metadata = await getMetaData({
        citySlug: 'bursa',
        districtSlug: null,
        neighborhoodSlug: null,
        servicetypeSlug: null,
        locksmiths
    });

    const structuredData = metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive">
                    {structuredData}
                </Script>
            )}
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
                {/* Hero Section - İlçe Seçimi Odaklı */}
                <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 md:py-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            {/* Başlık Bölümü */}
                            <div className="text-center mb-6 md:mb-10">
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                                    Bursa Çilingir | 7/24 En Yakın Çilingirler ve Anahtarcı
                                </h1>
                                <p className="text-sm md:text-lg text-blue-200 max-w-2xl mx-auto">
                                    Bursa'da acil çilingir, oto çilingir ve anahtarcı hizmetine mi ihtiyacınız var? İlçenizi seçin, en yakın çilingiri bulun! Bursa çilingir numarası ve çilingir fiyatları için hemen arayın.
                                </p>
                            </div>

                            {/* İlçe Seçim Bölümü */}
                            <div id="ilce-secim-bolumu" className="bg-slate-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700/50 shadow-2xl">
                                <div className="mb-4 md:mb-6">
                                    <h2 className="text-lg md:text-xl font-semibold text-center mb-2 flex items-center justify-center gap-2">
                                        <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                                        <span>Bursa İlçelerinde En Yakın Çilingir Bul</span>
                                    </h2>
                                    <p className="text-xs md:text-sm text-slate-300 text-center">
                                        Osmangazi çilingir, Nilüfer çilingir, Yıldırım çilingir, Gemlik çilingir, Mudanya çilingir, Kestel çilingir, Gürsu çilingir ve tüm Bursa ilçelerinde 7/24 açık çilingir hizmeti.
                                    </p>
                                </div>

                                {/* İlçe Grid - Mobilde daha küçük kartlar */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                    {bursaDistricts.map((district) => {
                                        const districtSlug = district.slug || district.name.toLowerCase()
                                            .replace(/ş/g, 's')
                                            .replace(/ğ/g, 'g')
                                            .replace(/ü/g, 'u')
                                            .replace(/ö/g, 'o')
                                            .replace(/ç/g, 'c')
                                            .replace(/ı/g, 'i')
                                            .replace(/İ/g, 'i')
                                            .replace(/\s+/g, '-')
                                            .replace(/[^a-z0-9-]/g, '');

                                        return (
                                            <Link
                                                key={district.id}
                                                href={`/bursa/${districtSlug}`}
                                                className="group bg-blue-700 hover:bg-blue-600 border-2 border-blue-600 hover:border-blue-500 rounded-lg p-2 md:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                                                prefetch={true}
                                            >
                                                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-white flex-shrink-0" />
                                                    <span className="text-xs md:text-sm font-medium text-white text-center leading-tight">
                                                        {district.name === "Mustafakemalpaşa" ? "Kemalpaşa" : district.name}
                                                    </span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hızlı Erişim Bölümü */}
                <section className="py-8 md:py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                                Bursa Çilingir Hizmetleri - Acil Çilingir, Oto Çilingir, Anahtarcı
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {ServiceList.map((service) => {
                                    // Her servis için renk teması
                                    const colorThemes = {
                                        'acil-cilingir': {
                                            bg: 'from-red-50 to-orange-50',
                                            border: 'border-red-200',
                                            iconBg: 'bg-red-500',
                                            text: 'text-red-600',
                                            hover: 'hover:border-red-400'
                                        },
                                        'otomobil-cilingir': {
                                            bg: 'from-blue-50 to-cyan-50',
                                            border: 'border-blue-200',
                                            iconBg: 'bg-blue-500',
                                            text: 'text-blue-600',
                                            hover: 'hover:border-blue-400'
                                        },
                                        'ev-cilingir': {
                                            bg: 'from-green-50 to-emerald-50',
                                            border: 'border-green-200',
                                            iconBg: 'bg-green-500',
                                            text: 'text-green-600',
                                            hover: 'hover:border-green-400'
                                        },
                                        'kasa-cilingir': {
                                            bg: 'from-purple-50 to-violet-50',
                                            border: 'border-purple-200',
                                            iconBg: 'bg-purple-500',
                                            text: 'text-purple-600',
                                            hover: 'hover:border-purple-400'
                                        },
                                        '7-24-cilingir': {
                                            bg: 'from-indigo-50 to-blue-50',
                                            border: 'border-indigo-200',
                                            iconBg: 'bg-indigo-500',
                                            text: 'text-indigo-600',
                                            hover: 'hover:border-indigo-400'
                                        }
                                    };

                                    const theme = colorThemes[service.slug] || {
                                        bg: 'from-gray-50 to-gray-100',
                                        border: 'border-gray-200',
                                        iconBg: 'bg-gray-500',
                                        text: 'text-gray-600',
                                        hover: 'hover:border-gray-400'
                                    };

                                    return (
                                        <div
                                            key={service.id}
                                            className={`bg-gradient-to-br ${theme.bg} rounded-2xl p-6 border ${theme.border} ${theme.hover} hover:shadow-xl transition-all duration-300 group`}
                                        >
                                            <div className="flex items-start gap-4 mb-4">
                                                <div className={`${theme.iconBg} rounded-xl p-3 group-hover:scale-110 transition-transform shadow-lg`}>
                                                    <span className="text-2xl">{service.icon}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h3>
                                                    {service.price && (
                                                        <p className={`${theme.text} text-xs font-semibold`}>
                                                            {service.price.min}₺ - {service.price.max}₺
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-gray-700 text-sm mb-5 leading-relaxed">
                                                {service.description}
                                            </p>
                                            <Link
                                                href={`/bursa/${service.slug}`}
                                                className={`${theme.text} font-semibold text-sm hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all`}
                                            >
                                                {service.name} Bul
                                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bursa Hakkında */}
                <section className="py-8 md:py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                                Bursa Çilingir ve Anahtarcı Hizmetleri Hakkında
                            </h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Bursa'da çilingir hizmetine mi ihtiyacınız var? Bursa çilingir ve anahtarcı hizmetleri geniş hizmet yelpazesi ile uzman çilingirler tarafından sunulmaktadır.
                                    Bursa'da en yakın çilingir, acil çilingir, oto çilingir, kasa çilingir ve anahtarcı hizmetleri için tüm ilçelerde profesyonel çilingirler hizmet vermektedir.
                                    Osmangazi çilingir, Nilüfer çilingir, Yıldırım çilingir, Gemlik çilingir, Mudanya çilingir, Kestel çilingir, Gürsu çilingir ve İnegöl çilingir hizmetleri 7/24 açık.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    Bursa'da çilingir hizmetleri geniş bir ağla sunulmaktadır. Birçok çilingir ve anahtarcı bölgede aktif olarak hizmet vermektedir.
                                    Bursa çilingir fiyatları, ilçe ve hizmete göre değişkenlikler göstermektedir. Bursa'da ev çilingiri, otomobil çilingiri, acil çilingir, 7/24 çilingir,
                                    oto anahtar, motor anahtar, anahtar kopyalama, çelik kapı çilingir ve kasa çilingir hizmetleri bulmak oldukça kolaydır.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-4">
                                    <strong>Bursa'da En Yakın Çilingir Nasıl Bulunur?</strong> BiÇilingir platformu sayesinde Bursa'da tüm ilçelerinde hizmet veren en yakın çilingiri bulabilir,
                                    çilingir fiyatlarını görebilirsiniz. Bursa çilingir telefon numarası ve çilingir numarası için ilçenizi seçerek en yakın anahtarcı çilingir hizmetine
                                    hemen ulaşabilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri bulabilir ve hemen iletişime geçebilirsiniz.
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    <strong>Bursa Çilingir Hizmetleri:</strong> Bursa'da kapı açma, kilit değiştirme, anahtar kopyalama, oto anahtar, motor kontak, araç anahtarı,
                                    çelik kapı çilingir, kasa çilingir, şifreli kilit ve akıllı kilit hizmetleri verilmektedir. Bursa çilingirler 7/24 açık ve acil durumlarda
                                    hızlı hizmet vermektedir. Bursa anahtarcı ve çilingir fiyatları hizmet türüne göre değişmektedir.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fiyat Rehberi */}
                <section className="py-8 md:py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                                Bursa Çilingir Fiyatları ve Ücretleri - 2024 Güncel Fiyat Listesi
                            </h2>
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-200">
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    Bursa çilingir fiyatları ve çilingir ücretleri, hizmet türüne, kapı modeline ve saate göre değişiklik göstermektedir.
                                    Bursa çilingir fiyatları genellikle 300₺ ile 1500₺ arasında değişmektedir. Kapı açma ücreti, oto çilingir fiyatı,
                                    anahtar kopyalama fiyatı, çelik kapı çilingir fiyatları ve kasa çilingir fiyatı hizmete göre farklılık gösterebilir.
                                    Bursa'da en yakın çilingir fiyatları ve çilingir kapi acma ucreti için aşağıdaki fiyat listesine bakabilirsiniz.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Kapı Açma Ücreti ve Çelik Kapı Çilingir Fiyatları</h3>
                                        <p className="text-2xl font-bold text-blue-600">300₺ - 600₺</p>
                                        <p className="text-xs text-gray-600 mt-1">Çelik kapı kilit fiyatları dahil</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Oto Çilingir Fiyatı ve Oto Yedek Anahtar Fiyatları</h3>
                                        <p className="text-2xl font-bold text-blue-600">400₺ - 800₺</p>
                                        <p className="text-xs text-gray-600 mt-1">Oto anahtar kopyalama dahil</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Anahtar Kopyalama Fiyatı</h3>
                                        <p className="text-2xl font-bold text-blue-600">50₺ - 200₺</p>
                                        <p className="text-xs text-gray-600 mt-1">Ev anahtar kopyalama fiyatı dahil</p>
                                    </div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Kasa Çilingir Fiyatı ve Şifreli Kasa</h3>
                                        <p className="text-2xl font-bold text-blue-600">500₺ - 1500₺</p>
                                        <p className="text-xs text-gray-600 mt-1">Çelik kasa çilingir dahil</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 italic mt-4">
                                    * Bursa çilingir fiyatları yaklaşık değerlerdir. Kesin fiyat bilgisi için Bursa çilingir telefon numarası ile görüşmeniz gerekmektedir.
                                    Bursa çilingir numarası ve çilingir fiyatları için en yakın çilingir ile iletişime geçebilirsiniz.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Popüler İlçeler */}
                <section className="py-8 md:py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                                Bursa'nın Popüler İlçelerinde Çilingir ve Anahtarcı Hizmetleri
                            </h2>
                            <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
                                Bursa'nın en popüler ilçelerinde çilingir hizmetleri: Osmangazi çilingir, Nilüfer çilingir, Yıldırım çilingir,
                                Gemlik çilingir, Mudanya çilingir ve İnegöl çilingir. Tüm ilçelerde 7/24 açık çilingir ve anahtarcı hizmeti.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {['Osmangazi', 'Nilüfer', 'Yıldırım', 'Gemlik', 'Mudanya', 'İnegöl'].map((districtName) => {
                                    const district = bursaDistricts.find(d => d.name === districtName);
                                    if (!district) return null;

                                    const districtSlug = district.slug || district.name.toLowerCase()
                                        .replace(/ş/g, 's')
                                        .replace(/ğ/g, 'g')
                                        .replace(/ü/g, 'u')
                                        .replace(/ö/g, 'o')
                                        .replace(/ç/g, 'c')
                                        .replace(/ı/g, 'i')
                                        .replace(/İ/g, 'i')
                                        .replace(/\s+/g, '-')
                                        .replace(/[^a-z0-9-]/g, '');

                                    return (
                                        <Link
                                            key={district.id}
                                            href={`/bursa/${districtSlug}`}
                                            className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-center group"
                                            prefetch={true}
                                        >
                                            <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                            <h3 className="font-semibold text-gray-900 text-sm">{districtName} Çilingir</h3>
                                            <p className="text-xs text-gray-600 mt-1">En Yakın Çilingir</p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Neden Bizi Seçmelisiniz */}
                <section className="py-8 md:py-12 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                                Bursa'da Neden BiÇilingir ile En Yakın Çilingir Bulmalısınız?
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="bg-blue-100 rounded-full p-3 h-fit">
                                        <Star className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Güvenilir Bursa Çilingirler</h3>
                                        <p className="text-gray-700 text-sm">
                                            Bursa'da tüm çilingirlerimiz kimlik kontrolünden geçmiş, güvenilir ve profesyonel hizmet veren uzman anahtarcı çilingirlerdir.
                                            Bursa çilingir numarası ve çilingir telefon numarası ile hemen ulaşabilirsiniz.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-green-100 rounded-full p-3 h-fit">
                                        <Clock className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">7/24 Açık Çilingir Hizmeti</h3>
                                        <p className="text-gray-700 text-sm">
                                            Bursa'da gece, gündüz, hafta sonu fark etmeksizin 24 saat boyunca acil çilingir ve 7/24 açık çilingir hizmeti alabilirsiniz.
                                            Bursa çilingirler 7/24 açık ve acil durumlarda hızlı hizmet vermektedir.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-purple-100 rounded-full p-3 h-fit">
                                        <Phone className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">En Yakın Çilingir Hızlı Erişim</h3>
                                        <p className="text-gray-700 text-sm">
                                            Bursa'da ilçenizi seçerek size en yakın çilingiri saniyeler içinde bulabilir ve hemen arayabilirsiniz.
                                            En yakın anahtarcı çilingir ve en yakın oto kilitçi hizmeti için hemen başlayın.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-orange-100 rounded-full p-3 h-fit">
                                        <Shield className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Bursa Çilingir Fiyatları Şeffaflığı</h3>
                                        <p className="text-gray-700 text-sm">
                                            Bursa çilingir fiyatlarını görebilir, karşılaştırabilir ve size en uygun olanı seçebilirsiniz.
                                            Çilingir fiyatları, kapı açma ücreti ve oto çilingir fiyatı bilgileri şeffaftır.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Son CTA */}
                <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Bursa'da İlçenizi Seçin, En Yakın Çilingirinizi Bulun!
                            </h2>
                            <p className="text-lg mb-6 text-blue-100">
                                Bursa'nın hangi ilçesinde çilingir, anahtarcı veya acil çilingir hizmetine ihtiyacınız var?
                                Osmangazi çilingir, Nilüfer çilingir, Yıldırım çilingir ve tüm Bursa ilçelerinde 7/24 açık çilingir hizmeti.
                                Tüm ilçeleri görmek için yukarı kaydırın.
                            </p>
                            <ScrollToTopButton />
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
