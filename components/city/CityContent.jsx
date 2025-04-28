"use client";

import { useState, useEffect } from 'react';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

import { services, mockLocksmiths } from '../../lib/test-data';

export default function CityContent({ city }) {
    const [isLoading, setIsLoading] = useState(true);
    const [cityData, setCityData] = useState(null);
    const [locksmiths, setLocksmiths] = useState([]);


    useEffect(() => {
        setLocksmiths(mockLocksmiths);
    }, []);

    useEffect(() => {
        // Gerçek uygulamada API'den veri çekilecek
        setTimeout(() => {
            const mockData = {
                id: 1,
                name: city.charAt(0).toUpperCase() + city.slice(1),
                description: `${city.charAt(0).toUpperCase() + city.slice(1)} ili için 7/24 çilingir hizmetleri. Kapınızda kaldığınızda, anahtarınızı kaybettiğinizde veya acil durumlar için profesyonel çilingirlerimiz hizmetinizdedir. Aşağıdaki listeden Bursa da aktif hizmet veren çilingir anahtarcıları bulabilirsiniz. Hemen arayarak detaylı bilgi alabilirsiniz.`,
                longDescription: `Bursa, Türkiyenin en büyük illerinden biridir. Bölgede hizmet veren birçok çilingir bulunmaktadır.\n Bursa'da 7/24 çilingir, acil çilingir, otomobil çilingir, ev çilingiri, kasa çilingir hizmetleri alabilirsiniz.\n Bursada çilingir anahtarcı hizmetleri oldukça gelişmiş bir çilingir ağı ile sağlanmaktadır. Türkiyenin ilk ve tek çilingir ağı olan Bi Çilingir platformu sayesinde çilingir hizmetlerinizi kolayca bulabilirsiniz.`,
                districts: [
                    { id: 1, name: 'Osmangazi', slug: 'osmangazi' },
                    { id: 2, name: 'Yıldırım', slug: 'yildirim' },
                    { id: 3, name: 'Nilüfer', slug: 'nilufer' },
                    { id: 4, name: 'Gürsu', slug: 'gursu' },
                    { id: 5, name: 'Kestel', slug: 'kestel' },
                    { id: 6, name: 'Mudanya', slug: 'mudanya' },
                    { id: 7, name: 'Gemlik', slug: 'gemlik' },
                    { id: 8, name: 'İnegöl', slug: 'inegol' },
                    { id: 9, name: 'Karacabey', slug: 'karacabey' },
                    { id: 10, name: 'Mustafakemalpaşa', slug: 'mustafakemalpasa' },
                    { id: 11, name: 'Orhangazi', slug: 'orhangazi' },
                    { id: 12, name: 'İznik', slug: 'iznik' },
                    { id: 13, name: 'Yenişehir', slug: 'yenisehir' },
                    { id: 14, name: 'Orhaneli', slug: 'orhaneli' },
                    { id: 15, name: 'Büyükorhan', slug: 'buyukorhan' },
                    { id: 16, name: 'Harmancık', slug: 'harmanci' },
                    { id: 17, name: 'Keles', slug: 'keles' },
                ],
                mapLocation: { lat: 40.1885, lng: 29.0610 }, // Bursa için örnek koordinat
                contactInfo: {
                    phone: '+90 850 123 4567',
                    address: `${city.charAt(0).toUpperCase() + city.slice(1)} Merkez, Atatürk Cad. No: 123`,
                    workingHours: '7/24 Hizmet'
                }
            };

            setCityData(mockData);
            setIsLoading(false);
        }, 1000);
    }, [city]);

    if (isLoading) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    const sideMenuParams = {
        map: {
            locksmithPositions: locksmiths.map(locksmith => ({
                position: { lat: locksmith.location.lat, lng: locksmith.location.lng },
                title: locksmith.name,
                description: locksmith.description,
            })),
            mapCenter: cityData.mapLocation
        },
        nearbySection: {
            title: 'Yakındaki Mahalleler',
            description: '',
            data: cityData.districts.map(district => ({
                id: district.id,
                name: district.name,
                slug: district.name.toLowerCase().replace(/\s+/g, '-')
            }))
        },
        locksmithPricing: {
            title: 'Çilingir Hizmetleri Fiyatları',
            description: 'Çilingir hizmetleri fiyatları, çilingirin hizmet türüne, kapı modeline ve saate göre değişiklik gösterebilir. Fiyatlar yaklaşık değerlerdir. Kesin fiyat için çilingir ile görüşmeniz gerekmektedir.',
            data: services.map(service => ({
                id: service.id,
                name: service.name,
                minPrice: service.price.min,
                maxPrice: service.price.max
            }))
        },
        categorySection: {
            title: 'Çilingir Hizmetleri Kategorileri',
            description: '',
            data: services.map(service => ({
                id: service.id,
                name: service.name,
                slug: service.name.toLowerCase().replace(/\s+/g, '-')
            }))
        },
        formattedName: cityData.name,
        type: 'city'
    }

    const sssList = [
        { id: 1, question: `${cityData.name}'de en yakın çilingir nerede?`, answer: `BiÇilingir platformu sayesinde ${cityData.name} ilçesinin tüm mahallelerinde hizmet veren en yakın çilingiri bulabilirsiniz. Arama formunu kullanarak konumunuza en yakın çilingiri tespit edebilir ve hemen iletişime geçebilirsiniz.` },
        { id: 2, question: `${cityData.name}'de çilingir ücretleri ne kadar?`, answer: `${cityData.name} ilçesinde çilingir ücretleri genellikle 200₺ ile 800₺ arasında değişmektedir. Kapı açma işlemleri ortalama 200₺-350₺, kilit değiştirme 300₺-500₺, çelik kapı tamiri ise 400₺-800₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.` },
        { id: 3, question: `${cityData.name}'de gece çilingir hizmeti alabilir miyim?`, answer: `Evet, ${cityData.name} ilçesinde 7/24 hizmet veren çilingir ekiplerimiz bulunmaktadır. Gece saatlerinde de kapınız kilitli kaldığında veya acil kilit değişimi gerektiğinde çilingir hizmetimize ulaşabilirsiniz.` },
        { id: 4, question: `${cityData.name}'de oto çilingir hizmeti var mı?`, answer: `Evet, ${cityData.name} ilçesinde uzman oto çilingir ekiplerimiz hizmet vermektedir. Araç anahtarı kopyalama, kayıp anahtar yerine yenisini yapma, immobilizer programlama ve araç kapısı açma gibi hizmetlerimiz bulunmaktadır.` },
    ]

    const mainContentParams = {
        navbarList: [
            { id: 1, name: 'Ana Sayfa', slug: '/' },
            { id: 2, name: cityData.name, slug: '#' },
        ],
        mainCard: { title: `${cityData.name} Çilingir Anahtarcı`, description: cityData.description },
        locksmitList: { title: `${cityData.name} Çilingirler`, description: 'Bursa ilinde hizmet veren çilingirler', data: locksmiths },
        seconCard: { title: `${cityData.name} Hakkında`, longDescription: cityData.longDescription },
        serviceList: { title: 'Çilingir Hizmetleri Kategorileri', description: '', data: services },
        sssList: { title: `${cityData.name} Çilingir Sık Sorulan Sorular`, description: `${cityData.name} da bir çok kişi çilingirler hakkında bazı soruların cevabını merak ediyor. Sık sorulan soruların cevaplarını aşağıdaki listede bulabilirsiniz.`, data: sssList },
        detailedDistrictList: { title: 'Bursa İlçeleri', description: 'Bursa da çilingir hizmetleri verilen ilçeler', data: cityData.districts },
        sideMenuParams: sideMenuParams,
        formatedName: cityData.name,
        type: 'city'
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <MainContent {...mainContentParams} />
                </div>

                <div className="lg:col-span-1">
                    <SideMenu {...sideMenuParams} />
                </div>
            </div>
        </div>
    );
} 