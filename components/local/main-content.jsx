"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronUp, X, SearchX, Phone, Clock } from 'lucide-react';
import turkiyeIlIlce from '../../data/turkiye-il-ilce';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import LocksmithCard from '../ui/locksmith-card';
import SideMenu from '../local/side-menu';


export default function MainContent(params) {

    const {
        navbarList = [{ id: 1, name: '', slug: '' }],
        mainCard = { title: '', description: '' },
        locksmitList = { title: '', description: '', data: [{ id: 1, name: '', description: '', imageUrl: '', slug: '' }] },
        seconCard = { title: '', longDescription: '' },
        serviceList = { title: '', description: '', data: [{ id: 1, name: '', description: '', icon: '', slug: '' }] },
        sssList = { title: '', description: '', data: [{ id: 1, question: '', answer: '' }] },
        detailedDistrictList = { title: '', description: '', secondTitle: '', data: [{ id: 1, name: '', slug: '' }] },
        districtDescription = null,
        citySlug = null,
        districtSlug = null,
        cityId = null,
        districtId = null,
        sideMenuParams,
        formatedName,
        type = 'city' } = params;

    // İlgili şehrin ilçelerini filtrele (cityId varsa)
    const cityDistricts = cityId
        ? turkiyeIlIlce.districts.filter(district => district.province_id === cityId)
        : [];

    // Toggle state
    const [isDistrictListOpen, setIsDistrictListOpen] = useState(false);
    const [isMahalleListOpen, setIsMahalleListOpen] = useState(false);

    const MAHALLE_PREVIEW_COUNT = 8;

    // İlçe adını formatedName'den çıkar (örn: "Bursa Nilüfer" -> "Nilüfer")
    const districtName = formatedName ? formatedName.split(' ').slice(1).join(' ') : '';
    const cityName = formatedName ? formatedName.split(' ')[0] : '';

    const firstLocksmith = locksmitList.data?.[0];
    const firstPhone = firstLocksmith?.phone;
    const telHref = firstPhone ? `tel:${String(firstPhone).replace(/\D/g, '')}` : null;
    const firstWhatsapp = firstLocksmith?.whatsapp;
    const whatsappHref = firstWhatsapp
        ? `https://wa.me/${String(firstWhatsapp).replace(/\D/g, '')}?text=${encodeURIComponent('Merhaba, çilingir hizmetiniz hakkında bilgi almak istiyorum.')}`
        : null;

    return (
        <article>
            {/* Breadcrumb navigasyonu */}
            <nav className="flex text-sm text-gray-600 mb-2 md:mb-6 flex-wrap" aria-label="Breadcrumb">
                {navbarList.map((item, index) => (
                    <React.Fragment key={index}>
                        {index === navbarList.length - 1 ? (
                            <span className="text-gray-900 font-medium">{item.name}</span>
                        ) : (
                            <>
                                <Link href={`${item.slug}`} className="hover:text-blue-600">
                                    {item.name}
                                </Link>
                                <span className="mx-1">&gt;</span>
                            </>
                        )}
                    </React.Fragment>
                ))}
            </nav>

            {/* Ana Başlık - H1 */}
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-6 text-gray-900">{locksmitList.title}</h1>

            {/* İlçe Seçim Bileşeni */}
            <div className="mb-1 md:mb-3 py-1">
                {!isDistrictListOpen && (
                    <button
                        data-gtm="ilce-secimi"
                        id="ilce-secimi"
                        onClick={() => setIsDistrictListOpen(!isDistrictListOpen)}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                        aria-expanded={isDistrictListOpen}
                        aria-label="İlçe seç"
                    >
                        <MapPin className="h-4 w-4" />
                        <span>
                            {type === 'district'
                                ? 'Başka ilçede misin? İlçeni seç!'
                                : 'İlçeni seç!'}
                        </span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                )}
                {isDistrictListOpen && citySlug && cityDistricts.length > 0 && (
                    <div className="mt-3 p-3 md:p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                        <div className="flex items-center justify-between mb-2 md:mb-3">
                            <h3 className="text-xs md:text-sm font-semibold text-gray-700">{cityName} İlçeleri</h3>
                            <button
                                onClick={() => setIsDistrictListOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                                aria-label="İlçe listesini kapat"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {cityDistricts.map((district) => {
                                const currentDistrictSlug = district.slug;
                                return (
                                    <Link
                                        key={district.id}
                                        href={`/${citySlug}/${currentDistrictSlug}`}
                                        className="inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 active:bg-blue-100 transition-all duration-150"
                                        onClick={() => setIsDistrictListOpen(false)}
                                        prefetch={true}
                                    >
                                        <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 md:mr-1.5 flex-shrink-0" />
                                        <span className="whitespace-nowrap">{district.name === "Mustafakemalpaşa" ? "Kemalpaşa" : district.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {locksmitList.description && (
                <div className="mb-4 md:mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-6 shadow-sm">
                    {locksmitList.description.split('\n').map((line, index) => (
                        <p
                            className="text-gray-700 text-base md:text-lg leading-relaxed mb-2 last:mb-0"
                            key={index}
                        >
                            {line}
                        </p>
                    ))}

                    {telHref && (
                        <div className="mt-5 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-5 md:p-6 shadow-xl shadow-green-700/20">
                            {/* Banner başlık */}
                            <div className="mb-4 text-center sm:text-left">
                                <p className="text-white/90 font-extrabold text-lg md:text-2xl leading-snug">
                                    {districtName || cityName
                                        ? `${districtName || cityName} Çilingir — 7/24 Hizmet`
                                        : 'Çilingir — 7/24 Hizmet'}
                                </p>
                                <p className="mt-1 flex items-center justify-center sm:justify-start gap-1.5 text-white/80 text-sm md:text-base font-medium">
                                    <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                                    Ortalama 15 Dakikada Kapınızdayız
                                </p>
                            </div>

                            {/* Butonlar */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                {/* Hemen Ara */}
                                <a
                                    href={telHref}
                                    data-gtm="hemen-ara-cta"
                                    id="hemen-ara-cta"
                                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-xl bg-white text-green-700 hover:bg-green-50 active:bg-green-100 font-extrabold text-base md:text-xl px-5 py-4 shadow-md transition-all duration-150 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]"
                                    aria-label={`${firstLocksmith?.name || 'Çilingir'} hemen ara`}
                                >
                                    <Phone className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                    <span className="flex items-center gap-2 flex-wrap justify-center leading-tight">
                                        <span>{firstPhone}</span>
                                        <span className="font-bold opacity-80">— Hemen Ara</span>
                                    </span>
                                </a>

                                {/* WhatsApp */}
                                {whatsappHref && (
                                    <a
                                        href={whatsappHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        data-gtm="whatsapp-cta"
                                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl text-white font-bold text-base md:text-lg px-5 py-4 transition-all duration-150 shadow-md"
                                        style={{ backgroundColor: '#25D366' }}
                                        aria-label="WhatsApp ile mesaj gönder"
                                    >
                                        <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                        </svg>
                                        WhatsApp ile Yaz
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Çilingirler Listesi */}
            <section className="mb-4 md:mb-8">
                {locksmitList.data && locksmitList.data.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 md:gap-6">
                        {locksmitList.data.map((locksmith, index) => (
                            <LocksmithCard key={index} locksmith={locksmith} index={index} />
                        ))}
                    </div>
                ) : (
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <div className="mb-4 p-4 bg-white rounded-full shadow-lg">
                                <SearchX className="h-12 w-12 text-blue-500" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                Bölgenizde Çilingir Bulunamadı
                            </h3>
                            <p className="text-gray-600 text-base md:text-lg max-w-md">
                                Maalesef bu bölgede şu anda aktif çilingir bulunmamaktadır. Lütfen daha sonra tekrar kontrol edin veya yakındaki bölgeleri deneyin.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* Ana İçerik Bölümü */}
            <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{mainCard.title}</h2>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">{mainCard.description}</p>
            </section>

            {/* İlçe Hakkında Bölümü */}
            <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{seconCard.title}</h2>
                {districtDescription && districtDescription.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                        <p className="mt-4 text-gray-700 leading-relaxed text-base" key={index}>
                            {paragraph.trim()}
                        </p>
                    )
                ))}
                {seconCard.longDescription && seconCard.longDescription.split('\n').map((line, index) => (
                    <p className="mt-2 text-gray-700 leading-relaxed" key={index}>{line}</p>
                ))}
            </section>

            {/* Çilingir Hizmetleri Bölümü */}
            <section className="mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{serviceList.title}</h2>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">{serviceList.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceList.data.map((service) => (
                        <div key={service.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                            <div className="text-4xl mb-3">{service.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                            {serviceList.neighborhoods && serviceList.neighborhoods.length > 0 ? (
                                <details className="mt-2">
                                    <summary className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                                        {serviceList.name} {service.name} Bul
                                    </summary>
                                    <div className="mt-2 pl-4 space-y-1">
                                        {serviceList.neighborhoods.map((neighborhood, index) => (
                                            <span
                                                key={index}
                                                className="block text-gray-700 py-1"
                                            >
                                                {serviceList.name} {neighborhood.name} {service.name}
                                            </span>
                                        ))}
                                    </div>
                                </details>
                            ) : (
                                <button
                                    onClick={() => {
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                                >
                                    {formatedName} {service.name} Bul
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Mobil Side Menu */}
            <aside className='block md:hidden mb-8'>
                {sideMenuParams && <SideMenu {...sideMenuParams} />}
            </aside>

            {/* Fiyat Rehberi Bölümü - Fiyat Arayan Kullanıcılar İçin */}
            {type === 'district' && districtName && (
                <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                        {districtName} Çilingir Fiyatları ve Ücretleri
                    </h2>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                        {districtName} ilçesinde çilingir hizmetleri fiyatları, hizmet türüne, kapı modeline ve saate göre değişiklik göstermektedir.
                        {districtName} çilingir fiyatları genellikle 300₺ ile 1500₺ arasında değişmektedir.
                        Kapı açma ücreti, oto çilingir fiyatı, kasa çilingir fiyatı ve anahtar kopyalama fiyatı gibi hizmetlere göre farklılık gösterebilir.
                    </p>
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Ortalama Fiyat Aralıkları</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex justify-between">
                                <span><strong>{districtName} Çelik Kapı Çilingir Fiyatları:</strong></span>
                                <span>500₺ - 1.500₺</span>
                            </li>
                            <li className="flex justify-between">
                                <span><strong>{districtName} Kapı Açma Ücreti:</strong></span>
                                <span>500₺ - 1.000₺</span>
                            </li>
                            <li className="flex justify-between">
                                <span><strong>{districtName} Oto Çilingir Fiyatı:</strong></span>
                                <span>600₺ - 1.200₺</span>
                            </li>
                            <li className="flex justify-between">
                                <span><strong>{districtName} Kasa Çilingir Fiyatı:</strong></span>
                                <span>800₺ - 4.000₺</span>
                            </li>
                            <li className="flex justify-between">
                                <span><strong>{districtName} Anahtar Kopyalama Fiyatı:</strong></span>
                                <span>70₺ - 150₺</span>
                            </li>
                        </ul>
                    </div>
                    <p className="text-sm text-gray-600 italic">
                        * {districtName} çilingir fiyatları yaklaşık değerlerdir. Gece ve mesai dışı saatlerde fiyatlar değişiklik gösterebilir. Kesin fiyat bilgisi için çilingir ile telefonda görüşmeniz gerekmektedir.
                    </p>
                </section>
            )}

            {/* Intent Cluster Bölümleri - Acil Çilingir, Oto Çilingir, Anahtar Kopyalama, Kasa Çilingiri */}
            {type === 'district' && districtName && (
                <section className="mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                        {districtName} Çilingir Hizmetleri - Detaylı Bilgi
                    </h2>

                    <div className="space-y-6">
                        {/* Acil Çilingir Bölümü */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                7/24 Acil Çilingir Hizmeti - {districtName}
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                {districtName} ilçesinde acil çilingir hizmetine mi ihtiyacınız var?
                                {districtName} acil çilingir ekiplerimiz 7/24 hizmetinizdedir.
                                Kapı açma, anahtar kırılması, kilit takılması gibi acil durumlarda {districtName} en yakın çilingir
                                hizmeti saniyeler içinde yanınızda olacaktır. {districtName} çilingir numarası ile hemen iletişime geçebilirsiniz.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                {districtName} acil çilingir hizmeti ortalama 15-30 dakika içinde adresinize ulaşmaktadır.
                                Gece saatlerinde de {districtName} 7/24 açık çilingir hizmeti veren ekiplerimiz bulunmaktadır.
                            </p>
                        </div>

                        {/* Oto Çilingir Bölümü */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                {districtName} Oto Çilingir ve Araç Anahtarcı Hizmetleri
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                {districtName} oto çilingir hizmetleri kapsamında araç anahtarı kopyalama, oto anahtar yapımı,
                                motor anahtar, moto anahtar, araç kapısı açma ve immobilizer programlama gibi tüm hizmetler sunulmaktadır.
                                {districtName} oto anahtarcı uzmanlarımız modern araçların çipli anahtarları için de profesyonel hizmet vermektedir.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                {districtName} oto çilingir fiyatları araç markasına ve anahtar tipine göre değişmektedir.
                                Oto anahtar kopyalama fiyatı ve oto yedek anahtar fiyatları için {districtName} çilingir telefonu ile iletişime geçebilirsiniz.
                            </p>
                        </div>

                        {/* Anahtar Kopyalama Bölümü */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                {districtName} Anahtar Kopyalama ve Çoğaltma Hizmetleri
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                {districtName} anahtarcı hizmetleri kapsamında ev anahtarı kopyalama, araç anahtarcı,
                                anahtar çoğaltma ve özel kilit sistemleri için anahtar yapımı hizmetleri sunulmaktadır.
                                {districtName} anahtarcı uzmanlarımız Kale, Yale, Mul-T-Lock gibi markalar için de anahtar kopyalama yapmaktadır.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                {districtName} anahtar kopyalama fiyatı anahtar tipine göre 50₺ ile 200₺ arasında değişmektedir.
                                Anahtar kopyalama fiyat bilgisi için {districtName} anahtarcı ile iletişime geçebilirsiniz.
                            </p>
                        </div>

                        {/* Kasa Çilingiri Bölümü */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                                {districtName} Kasa Çilingiri ve Güvenlik Kasası Açma
                            </h3>
                            <p className="text-gray-700 leading-relaxed mb-3">
                                {districtName} kasa çilingiri hizmetleri kapsamında çelik kasa açma, şifreli kasa açma,
                                elektronik kasa açma ve kasa çilingiri hizmetleri sunulmaktadır. {districtName} kasa çilingiri
                                uzmanlarımız güvenlik kasaları için profesyonel açma hizmeti vermektedir.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                {districtName} kasa çilingir fiyatları kasa tipine ve karmaşıklığına göre 500₺ ile 1500₺ arasında değişmektedir.
                                Kasa açma hizmeti için {districtName} çilingir numarası ile iletişime geçebilirsiniz.
                            </p>
                        </div>
                    </div>
                </section>
            )}

            {/* Sık Sorulan Sorular */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{sssList.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{sssList.description}</p>

                <div className="space-y-4">
                    {
                        sssList.data.map((item, index) => (
                            <details key={index} className="bg-gray-50 rounded-lg p-4">
                                <summary className="font-semibold text-gray-800 cursor-pointer">{item.question}</summary>
                                <p className="mt-2 text-gray-600 leading-relaxed">
                                    {item.answer}
                                </p>
                            </details>
                        ))
                    }
                </div>
            </section>


            {/* Mahalleler Bölümü */}
            {detailedDistrictList.data.length > 1 && (
                <section className="mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl md:text-2xl">
                                {detailedDistrictList.title}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {detailedDistrictList.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg mt-4 mb-2 text-gray-900">{detailedDistrictList.secondTitle}</h3>
                            <div className="flex flex-wrap gap-2">
                                {(isMahalleListOpen
                                    ? detailedDistrictList.data
                                    : detailedDistrictList.data.slice(0, MAHALLE_PREVIEW_COUNT)
                                ).map((mahalle, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                        <span className="font-medium">{mahalle.name}</span>
                                        <span className="ml-1 text-gray-600">Çilingir Anahtarcı</span>
                                    </span>
                                ))}
                            </div>

                            {detailedDistrictList.data.length > MAHALLE_PREVIEW_COUNT && (
                                <button
                                    onClick={() => setIsMahalleListOpen(prev => !prev)}
                                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                    aria-expanded={isMahalleListOpen}
                                >
                                    {isMahalleListOpen ? (
                                        <>
                                            <ChevronUp className="h-4 w-4" />
                                            Daha az göster
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4" />
                                            Tümünü Göster ({detailedDistrictList.data.length} mahalle)
                                        </>
                                    )}
                                </button>
                            )}
                        </CardContent>
                    </Card>
                </section>
            )}
        </article>
    );
}