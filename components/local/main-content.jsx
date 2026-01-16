"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import turkiyeIlIlce from '../../data/turkiye-il-ilce';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
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
        sideMenuParams,
        formatedName,
        type = 'city' } = params;

    // Bursa ilçelerini filtrele
    const bursaDistricts = turkiyeIlIlce.districts.filter(district => district.province_id === 16);

    // Toggle state
    const [isDistrictListOpen, setIsDistrictListOpen] = useState(false);

    // İlçe adını formatedName'den çıkar (örn: "Bursa Nilüfer" -> "Nilüfer")
    const districtName = formatedName ? formatedName.split(' ').slice(1).join(' ') : '';
    const cityName = formatedName ? formatedName.split(' ')[0] : '';

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
                <button
                    data-gtm="ilce-secimi"
                    id="ilce-secimi"
                    onClick={() => setIsDistrictListOpen(!isDistrictListOpen)}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    aria-expanded={isDistrictListOpen}
                    aria-label="İlçe seç"
                >
                    <MapPin className="h-4 w-4" />
                    <span>Başka ilçede misin? İlçeni seç!</span>
                    {isDistrictListOpen ? (
                        <ChevronUp className="h-4 w-4" />
                    ) : (
                        <ChevronDown className="h-4 w-4" />
                    )}
                </button>

                {isDistrictListOpen && (
                    <div className="mt-3 p-3 md:p-4 bg-white border border-gray-200 rounded-lg shadow-md transition-all duration-200 ease-in-out">
                        <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Bursa İlçeleri</h3>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {bursaDistricts.map((district) => {
                                const districtSlug = district.slug;
                                return (
                                    <Link
                                        key={district.id}
                                        href={`/bursa/${districtSlug}`}
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

            <p className="text-gray-600 mb-2 md:mb-6 text-base leading-relaxed">{locksmitList.description}</p>

            {/* Çilingirler Listesi */}
            <section className="mb-4 md:mb-8">
                <div className="grid grid-cols-1 gap-2 md:gap-6">
                    {locksmitList.data.map((locksmith, index) => (
                        <LocksmithCard key={index} locksmith={locksmith} index={index} />
                    ))}
                </div>
            </section>

            {/* Ana İçerik Bölümü */}
            <section className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">{mainCard.title}</h2>
                <p className="text-gray-600 mb-6 text-base leading-relaxed">{mainCard.description}</p>
            </section>

            {/* İlçe Hakkında Bölümü */}
            <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900">{seconCard.title}</h2>
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
                                <Link
                                    href={`/${service.slug}`}
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    {formatedName} {service.name} Bul
                                </Link>
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
                                {detailedDistrictList.data.map((mahalle, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <MapPin className="h-3 w-3 mr-1 text-gray-500" />
                                        <span className="font-medium">{mahalle.name}</span>
                                        <span className="ml-1 text-gray-600">Çilingir Anahtarcı</span>
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
            )}
        </article>
    );
}