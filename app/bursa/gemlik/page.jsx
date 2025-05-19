import { mockLocksmiths } from '../../../data/mock-gemlik-cilingirler';
import LocksmithCard from '../../../components/ui/locksmith-card';

export default function GemlikCilingirPage() {
    const sssList = [
        {
            question: `Bursa Gemlik'de çilingir ücretleri ne kadar?`,
            answer: `Bursa Gemlik ilçesinde çilingir ücretleri genellikle 300₺ ile 1000₺ arasında değişmektedir. Kapı açma işlemleri ortalama 300₺-500₺, kilit değiştirme 500₺-1000₺, çelik kapı tamiri ise 500₺-1500₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.`
        },
        {
            question: `Bursa Gemlik'da gece açık çilingirci var mı?`,
            answer: `Evet, Bursa Gemlik'de 7/24 hizmet veren çilingirler bulunmaktadır. Yukarıdaki çilingirler 7/24 hizmet vermektedir.`
        },
        {
            question: `Bursa Gemlik'de oto çilingirci var mı?`,
            answer: `Evet, Bursa Gemlik'de uzman oto çilingir ekipleri vardır. Detaylı bilgi için ana sayfadan çilingir arama formu ile en yakın oto çilingirleri BiÇilingir ile bulabilir ve hemen arayabilirsiniz.`
        },
        {
            question: `Bursa Gemlik'de çilingir kaç dakikada gelir?`,
            answer: `Bursa Gemlik'de çilingirler genellikle 15-20 dakika içinde olay yerine ulaşır. Trafik durumuna göre bu süre değişebilir.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y px-4 md:px-16 lg:px-32 pt-2 pb-8">
            {/* Sayfa başlığı */}
            <h1 className="text-xl font-bold mb-2">Gemlik 7/24 Acil Çilingirler</h1>
            <p className="text-sm md:text-base text-gray-600 mb-3">Gemlik 7/24 çalışan acil çilingirler aşağıda listelenmiştir. Hemen arayıp bilgi alabilirsiniz.</p>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            {/* Çilingir Hizmetleri */}
            <h2 className="text-xl font-bold mb-4">Gemlik Çilingir Hizmetleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {/* 7/24 Çilingir */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">7/24 Çilingir</h3>
                            <p className="text-sm text-gray-600">Gemlik'in tüm mahallelerinde 7/24 kesintisiz çilingir hizmeti. Gece gündüz demeden dakikalar içinde yanınızdayız. Hemen arayın!</p>
                        </div>
                    </div>
                </div>

                {/* Acil Çilingir */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Acil Çilingir</h3>
                            <p className="text-sm text-gray-600">Gemlik'te kapıda mı kaldınız? Endişelenmeyin! En yakın çilingir ekibimiz size bir telefon kadar yakın. Uygun fiyat garantisiyle hemen gelelim.</p>
                        </div>
                    </div>
                </div>

                {/* Otomobil Çilingir */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Otomobil Çilingir</h3>
                            <p className="text-sm text-gray-600">Gemlik'te araç anahtarı mı kayboldu? Tüm marka araçlar için yerinde anahtar kopyalama, immobilizer ve kumanda kodlama. Şimdi ulaşın!</p>
                        </div>
                    </div>
                </div>

                {/* Ev Çilingir */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Ev Çilingir</h3>
                            <p className="text-sm text-gray-600">Gemlik'te ev, apartman ve iş yeri kapıları için uzman çilingir. Çelik kapı, elektronik kilit ve alarm sistemleri için hemen bizi arayın!</p>
                        </div>
                    </div>
                </div>

                {/* Kasa Çilingir */}
                <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-1">Kasa Çilingir</h3>
                            <p className="text-sm text-gray-600">Gemlik'te kasa açma konusunda uzman ekip. Para kasası, çelik kasa ve dijital kasa sorunlarınız için güvenilir çözüm ortağınız. Bizi arayın!</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mb-2">Gemlik Çilingir Anahtarcılar</h2>
            <p className="text-gray-600 mb-6">Yukarıda Bursa Gemlik ilçesinde faaliyet gösteren çilingirler listelenmiştir. Şuanda açık ve aktif hizmet vermektedir. Hemen arayarak bilgi alabilirsiniz.</p>

            {/* Sık Sorulan Sorular */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sık Sorulan Sorular</h2>
            <div className="space-y-2">
                {
                    sssList.map((item, index) => (
                        <details key={index} className="bg-gray-50 rounded-lg p-2">
                            <summary className="font-semibold text-gray-800 cursor-pointer">{item.question}</summary>
                            <p className="mt-2 text-gray-600">
                                {item.answer}
                            </p>
                        </details>
                    ))
                }
            </div>
        </div>
    );
}

// Statik sayfa oluşturma
export async function generateStaticParams() {
    return [{ city: 'bursa', district: 'gemlik' }];
}

// Sayfa metadatalarını oluştur
export async function generateMetadata() {
    return {
        title: 'Gemlik Çilingir - 7/24 Acil Çilingir Hizmeti | Bursa',
        description: 'Gemlik\'da 7/24 acil çilingir hizmeti. Dakikalar içinde kapınızda! Kapı açma 300₺\'den başlayan fiyatlarla. ☎️ Hemen Ara',
        keywords: 'Gemlik çilingir, bursa çilingir, acil çilingir, 7/24 çilingir, kapı açma, kilit değiştirme, çelik kapı, kasa açma',
        openGraph: {
            title: '7/24 Gemlik Çilingir | Dakikalar İçinde Kapınızda ⚡',
            description: '✓ Çok Hızlı Hizmet\n✓ 7/24 Açık\n✓ Uygun Fiyat Garantisi\n✓ Profesyonel Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/gemlik-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/gemlik-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Gemlik 7/24 Acil Çilingir Anahtarcı'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: '7/24 Gemlik Çilingir | Dakikalar İçinde Kapınızda ⚡',
            description: '✓ Çok Hızlı Hizmet\n✓ 7/24 Açık\n✓ Uygun Fiyat Garantisi',
            images: ['https://bicilingir.com/images/gemlik-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/gemlik-cilingir'
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: 'google-site-verification-code',
        },
        other: {
            'format-detection': 'telephone=no',
        }
    };
}

// Yapılandırma ayarları
export const dynamic = 'force-static';
export const revalidate = false;
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const maxDuration = 5;