'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Clock, Phone, Shield, Star, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import ScrollToTopButton from '../ui/scroll-to-top-button';

// Hizmet kartı renk temaları
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

const defaultTheme = {
    bg: 'from-gray-50 to-gray-100',
    border: 'border-gray-200',
    iconBg: 'bg-gray-500',
    text: 'text-gray-600',
    hover: 'hover:border-gray-400'
};

// Markdown'dan HTML'e çevir (sadece bold için basit versiyon)
const markdownToHtml = (markdown) => {
    if (!markdown) return ''
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
        .replace(/\n/g, '<br>')
}

export default function CityPageContent({
    cityName,
    citySlug,
    districts,
    services,
    hasRegion = false, // İstanbul gibi şehirler için Avrupa/Anadolu ayrımı
    avrupaDistricts = [],
    anadoluDistricts = [],
    popularDistricts = [],
    faqList = [],
    priceData = {},
    buildDate = null, // Build zamanında oluşturulan tarih
    description = null // AI ile üretilen şehir açıklaması
}) {
    // Popüler ilçeler - eğer belirtilmemişse ilk 6 ilçeyi al
    const displayPopularDistricts = popularDistricts.length > 0
        ? popularDistricts
        : districts.slice(0, 6);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section - İlçe Seçimi Odaklı */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 md:py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        {/* Başlık Bölümü */}
                        <div className="text-center mb-6 md:mb-10">
                            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
                                {cityName} Çilingir | 7/24 Acil Kilit ve Anahtar Hizmetleri
                            </h1>
                            <p className="text-sm md:text-lg text-blue-200 max-w-3xl mx-auto">
                                {cityName} genelinde 7/24 acil çilingir, oto çilingir ve anahtarcı hizmeti.
                                {hasRegion ? " Avrupa ve Anadolu Yakası'nda" : " Tüm ilçelerde"} deneyimli ve güvenilir çilingirler.
                                İlçenizi seçin, size en yakın çilingiri hemen bulun!
                            </p>
                        </div>

                        {/* İlçe Seçim Bölümü */}
                        <div id="ilce-secim-bolumu" className="bg-slate-800/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700/50 shadow-2xl">
                            {hasRegion ? (
                                // İstanbul gibi bölgeli şehirler için
                                <>
                                    {/* Avrupa Yakası */}
                                    <div className="mb-6">
                                        <h2 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-blue-400" />
                                            <span>Avrupa Yakası İlçeleri</span>
                                        </h2>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                            {avrupaDistricts.map((district) => (
                                                <Link
                                                    key={district.id}
                                                    href={`/${citySlug}/${district.slug}`}
                                                    className="group bg-blue-700 hover:bg-blue-600 border-2 border-blue-600 hover:border-blue-500 rounded-lg p-2 md:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                                                    prefetch={true}
                                                >
                                                    <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                                        <MapPin className="h-3 w-3 md:h-4 md:w-4 text-white flex-shrink-0" />
                                                        <span className="text-xs md:text-sm font-medium text-white text-center leading-tight">
                                                            {district.name}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Anadolu Yakası */}
                                    <div>
                                        <h2 className="text-lg md:text-xl font-semibold mb-3 flex items-center gap-2">
                                            <MapPin className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
                                            <span>Anadolu Yakası İlçeleri</span>
                                        </h2>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                            {anadoluDistricts.map((district) => (
                                                <Link
                                                    key={district.id}
                                                    href={`/${citySlug}/${district.slug}`}
                                                    className="group bg-green-700 hover:bg-green-600 border-2 border-green-600 hover:border-green-500 rounded-lg p-2 md:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                                                    prefetch={true}
                                                >
                                                    <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                                        <MapPin className="h-3 w-3 md:h-4 md:w-4 text-white flex-shrink-0" />
                                                        <span className="text-xs md:text-sm font-medium text-white text-center leading-tight">
                                                            {district.name}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                // Normal şehirler için tek liste
                                <>
                                    <div className="mb-4 md:mb-6">
                                        <h2 className="text-lg md:text-xl font-semibold text-center mb-2 flex items-center justify-center gap-2">
                                            <MapPin className="h-5 w-5 md:h-6 md:w-6" />
                                            <span>{cityName} İlçelerinde En Yakın Çilingir Bul</span>
                                        </h2>
                                        <p className="text-xs md:text-sm text-slate-300 text-center">
                                            {cityName}&apos;da tüm ilçelerde 7/24 açık çilingir hizmeti. İlçenizi seçerek size en yakın çilingiri bulun.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 md:gap-3">
                                        {districts.map((district) => (
                                            <Link
                                                key={district.id}
                                                href={`/${citySlug}/${district.slug}`}
                                                className="group bg-blue-700 hover:bg-blue-600 border-2 border-blue-600 hover:border-blue-500 rounded-lg p-2 md:p-3 transition-all duration-200 hover:scale-105 active:scale-95"
                                                prefetch={true}
                                            >
                                                <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                                    {district.name.length < 10 && <MapPin className="h-3 w-3 md:h-4 md:w-4 text-white flex-shrink-0" />}
                                                    <span className="text-xs md:text-sm font-medium text-white text-center leading-tight">
                                                        {district.name}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>


            {/* Şehir Hakkında SEO İçerik */}
            <section className="py-8 md:py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                            {cityName} Çilingir ve Anahtarcı Hizmetleri Hakkında
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            {/* AI ile üretilen description - İlk olarak göster */}
                            {description && (
                                <div className="text-gray-700 leading-relaxed mb-6">
                                    {description.split('\n\n').map((paragraph, index) => (
                                        <p
                                            key={index}
                                            className="mb-4"
                                            dangerouslySetInnerHTML={{ __html: markdownToHtml(paragraph) }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Ek bilgiler - Description yoksa göster */}
                            {!description && (
                                <>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {cityName}&apos;da çilingir hizmetine mi ihtiyacınız var? {cityName} genelinde {hasRegion ? "Avrupa ve Anadolu Yakası'nda" : 'tüm ilçelerde'} profesyonel çilingir ve anahtarcı hizmetleri sunulmaktadır.
                                        Acil kapı açma, kilit değiştirme, anahtar kopyalama, oto çilingir ve kasa çilingir hizmetleri 7/24 güvenilir ustalar tarafından sağlanmaktadır.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        {cityName}&apos;da çilingir hizmetleri geniş bir ağla sunulmaktadır. Deneyimli çilingir ve anahtarcılar bölgede aktif olarak hizmet vermektedir.
                                        {cityName} çilingir fiyatları, ilçe ve hizmete göre değişkenlik göstermektedir. Ev çilingiri, otomobil çilingiri, acil çilingir, 7/24 çilingir,
                                        oto anahtar, çelik kapı çilingir ve kasa çilingir hizmetleri kolayca bulunabilmektedir.
                                    </p>
                                </>
                            )}

                            {/* Her zaman gösterilecek ek bilgiler - Description'dan sonra */}
                            <p className="text-gray-700 leading-relaxed mb-4">
                                <strong>{cityName}&apos;da En Yakın Çilingir Nasıl Bulunur?</strong> BiÇilingir platformu sayesinde {cityName}&apos;da tüm ilçelerde hizmet veren en yakın çilingiri bulabilir,
                                çilingir fiyatlarını görebilirsiniz. İlçenizi seçerek size en yakın çilingir ve anahtarcı hizmetine hemen ulaşabilirsiniz.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                <strong>{cityName} Çilingir Hizmetleri:</strong> Kapı açma, kilit değiştirme, anahtar kopyalama, oto anahtar, araç anahtarı,
                                çelik kapı çilingir, kasa çilingir, şifreli kilit ve akıllı kilit hizmetleri verilmektedir. {cityName} çilingirleri 7/24 açık ve acil durumlarda
                                hızlı hizmet vermektedir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Hizmetler Bölümü */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center">
                            {cityName}&apos;da Sunulan Çilingir Hizmetleri
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {services.map((service) => {
                                const theme = colorThemes[service.slug] || defaultTheme;

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
                                        <button
                                            onClick={() => {
                                                const element = document.getElementById('ilce-secim-bolumu');
                                                if (element) {
                                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }}
                                            className={`${theme.text} font-semibold text-sm hover:underline inline-flex items-center gap-2 group-hover:gap-3 transition-all`}
                                        >
                                            İlçe Seçerek {service.name} Bul
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>


            {/* Fiyat Rehberi */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                            {cityName} Çilingir Fiyatları 2026
                        </h2>
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 md:p-8 border border-blue-200">
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                {cityName} çilingir fiyatları ve çilingir ücretleri, hizmet türüne, kapı modeline ve saate göre değişiklik göstermektedir.
                                Aşağıdaki fiyatlar yaklaşık değerler olup, bağlayıcı değildir. Kesin fiyat için çilingir ile görüşmeniz gerekmektedir.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Kapı Açma</h3>
                                    <p className="text-2xl font-bold text-blue-600">{priceData.kapiAcma?.min || 300}₺ - {priceData.kapiAcma?.max || 600}₺</p>
                                    <p className="text-xs text-gray-600 mt-1">{priceData.kapiAcma?.note || 'Normal kapı ve çelik kapı dahil'}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Kilit Değiştirme</h3>
                                    <p className="text-2xl font-bold text-blue-600">{priceData.kilitDegistirme?.min || 400}₺ - {priceData.kilitDegistirme?.max || 1000}₺</p>
                                    <p className="text-xs text-gray-600 mt-1">{priceData.kilitDegistirme?.note || 'Kilit modeline göre değişir'}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Anahtar Kopyalama</h3>
                                    <p className="text-2xl font-bold text-blue-600">{priceData.anahtarKopyalama?.min || 50}₺ - {priceData.anahtarKopyalama?.max || 200}₺</p>
                                    <p className="text-xs text-gray-600 mt-1">{priceData.anahtarKopyalama?.note || 'Normal ve güvenlikli anahtar'}</p>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <h3 className="font-semibold text-gray-800 mb-2">Oto Çilingir</h3>
                                    <p className="text-2xl font-bold text-blue-600">{priceData.otoCilingir?.min || 400}₺ - {priceData.otoCilingir?.max || 1200}₺</p>
                                    <p className="text-xs text-gray-600 mt-1">{priceData.otoCilingir?.note || 'Araç modeline göre değişir'}</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 italic mt-4">
                                * Fiyatlar yaklaşık değerlerdir. Gece hizmeti ve acil durumlar için ek ücret uygulanabilir.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popüler İlçeler */}
            {displayPopularDistricts.length > 0 && (
                <section className="py-8 md:py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-6xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                                {cityName}&apos;da Popüler İlçelerde Çilingir Hizmetleri
                            </h2>
                            <p className="text-center text-gray-600 mb-6 max-w-3xl mx-auto">
                                {cityName}&apos;ın en çok aranan ilçelerinde profesyonel çilingir ve anahtarcı hizmetleri.
                                Tüm ilçelerde 7/24 açık çilingir hizmeti.
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {displayPopularDistricts.map((district) => (
                                    <Link
                                        key={district.id}
                                        href={`/${citySlug}/${district.slug}`}
                                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all text-center group"
                                        prefetch={true}
                                    >
                                        <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <h3 className="font-semibold text-gray-900 text-sm">{district.name} Çilingir</h3>
                                        <p className="text-xs text-gray-600 mt-1">7/24 Hizmet</p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Neden Bizi Seçmelisiniz */}
            <section className="py-8 md:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                            Neden {cityName}&apos;da BiÇilingir ile Çilingir Bulmalısınız?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex gap-4">
                                <div className="bg-green-100 rounded-full p-3 h-fit">
                                    <Clock className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">7/24 Kesintisiz Hizmet</h3>
                                    <p className="text-gray-700 text-sm">
                                        Gece, gündüz, hafta sonu fark etmeksizin {cityName}&apos;da 24 saat çilingir hizmeti alabilirsiniz.
                                        Acil durumlarınızda her zaman yanınızdayız.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-blue-100 rounded-full p-3 h-fit">
                                    <Shield className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Hasarsız Kapı Açma</h3>
                                    <p className="text-gray-700 text-sm">
                                        Profesyonel ekipmanlarla kapınıza ve kilidinize zarar vermeden açma işlemi yapılır.
                                        Deneyimli ustalar hizmetinizde.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-purple-100 rounded-full p-3 h-fit">
                                    <Star className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Şeffaf Fiyatlandırma</h3>
                                    <p className="text-gray-700 text-sm">
                                        {cityName} çilingir fiyatlarını önceden görebilir, karşılaştırabilir ve size en uygun olanı seçebilirsiniz.
                                        Sürpriz ücret yok.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-orange-100 rounded-full p-3 h-fit">
                                    <CheckCircle2 className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Deneyimli Ustalar</h3>
                                    <p className="text-gray-700 text-sm">
                                        Platformumuzdaki tüm çilingirler kimlik kontrolünden geçmiş, tecrübeli ve güvenilir profesyonellerdir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SSS Bölümü */}
            {faqList.length > 0 && (
                <section className="py-8 md:py-12 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                                {cityName} Çilingir Sık Sorulan Sorular
                            </h2>
                            <div className="space-y-4">
                                {faqList.map((faq, index) => (
                                    <div key={index} className="bg-white rounded-lg p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                                        <h3 className="font-semibold text-gray-900 mb-2 flex items-start gap-2">
                                            <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            {faq.question}
                                        </h3>
                                        <p className="text-gray-700 text-sm ml-7">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Son CTA */}
            <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">
                            {cityName}&apos;da İlçenizi Seçin, Çilingirinizi Bulun!
                        </h2>
                        <p className="text-lg mb-6 text-blue-100">
                            {cityName}&apos;ın hangi ilçesinde çilingir hizmetine ihtiyacınız var?
                            {hasRegion ? " Avrupa veya Anadolu Yakası fark etmez," : ""} Tüm ilçelerde 7/24 açık çilingir hizmeti.
                        </p>
                        <ScrollToTopButton targetId="ilce-secim-bolumu" label="Tüm İlçeleri Gör" />
                    </div>
                </div>
            </section>

            {/* Son Güncelleme Notu */}
            <div className="bg-gray-100 py-4">
                <div className="container mx-auto px-4">
                    <p className="text-center text-sm text-gray-500">
                        Son güncelleme: {buildDate || 'Ocak 2026'}
                    </p>
                </div>
            </div>
        </div>
    );
}
