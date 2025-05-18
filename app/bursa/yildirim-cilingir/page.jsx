import { mockLocksmiths } from '../../../data/mock-yildirim-cilingirler';
import LocksmithCard from '../../../components/ui/locksmith-card';

export default function YildirimCilingirPage() {
    const sssList = [
        {
            question: `Bursa Yıldırım'de çilingir ücretleri ne kadar?`,
            answer: `Bursa Yıldırım ilçesinde çilingir ücretleri genellikle 300₺ ile 1000₺ arasında değişmektedir. Kapı açma işlemleri ortalama 300₺-500₺, kilit değiştirme 500₺-1000₺, çelik kapı tamiri ise 500₺-1500₺ arasındadır. Fiyatlar mesafeye, zamana ve hizmet türüne göre farklılık gösterebilir.`
        },
        {
            question: `Bursa Yıldırım'da gece açık çilingirci var mı?`,
            answer: `Evet, Bursa Yıldırım'da 7/24 hizmet veren çilingirler bulunmaktadır. Yukarıdaki çilingirler 7/24 hizmet vermektedir.`
        },
        {
            question: `Bursa Yıldırım'de oto çilingirci var mı?`,
            answer: `Evet, Bursa Yıldırımda uzman oto çilingir ekipleri vardır. Detaylı bilgi için ana sayfadan çilingir arama formu ile en yakın oto çilingirleri BiÇilingir ile bulabilir ve hemen arayabilirsiniz.`
        },
        {
            question: `Bursa Yıldırım'da çilingir kaç dakikada gelir?`,
            answer: `Bursa Yıldırım'da çilingirler genellikle 15-20 dakika içinde olay yerine ulaşır. Trafik durumuna göre bu süre değişebilir.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y p-4">
            {/* Sayfa başlığı */}
            <h1 className="text-xl font-bold mb-2">Yıldırım 7/24 Acil Çilingirler</h1>
            <p className="text-gray-600 mb-6">Yıldırım 7/24 çalışan acil çilingirler aşağıda listelenmiştir. Hemen arayıp bilgi alabilirsiniz.</p>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            <h2 className="text-2xl font-semibold mb-4">Yıldırım Çilingir Anahtarcılar</h2>
            <p className="text-gray-600 mb-6">Yukarıda Bursa Yıldırım ilçesinde faaliyet gösteren çilingirler listelenmiştir. Şuanda açık ve aktif hizmet vermektedir. Hemen arayarak bilgi alabilirsiniz.</p>


            {/* Sık Sorulan Sorular */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sık Sorulan Sorular</h2>
            <div className="space-y-4">
                {
                    sssList.map((item, index) => (
                        <details key={index} className="bg-gray-50 rounded-lg p-4">
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
    return [{ city: 'bursa', district: 'yildirim' }];
}

// Sayfa metadatalarını oluştur
export async function generateMetadata() {
    return {
        title: 'Yıldırım Çilingir - 7/24 Acil Çilingir Hizmeti | Bursa',
        description: 'Yıldırım\'da 7/24 acil çilingir hizmeti. Dakikalar içinde kapınızda! Kapı açma 300₺\'den başlayan fiyatlarla. ☎️ Hemen Ara',
        keywords: 'yıldırım çilingir, bursa çilingir, acil çilingir, 7/24 çilingir, kapı açma, kilit değiştirme, çelik kapı, kasa açma',
        openGraph: {
            title: '7/24 Yıldırım Çilingir | Dakikalar İçinde Kapınızda ⚡',
            description: '✓ Çok Hızlı Hizmet\n✓ 7/24 Açık\n✓ Uygun Fiyat Garantisi\n✓ Profesyonel Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/yildirim-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/yildirim-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Yıldırım 7/24 Acil Çilingir Anahtarcı'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: '7/24 Yıldırım Çilingir | Dakikalar İçinde Kapınızda ⚡',
            description: '✓ Çok Hızlı Hizmet\n✓ 7/24 Açık\n✓ Uygun Fiyat Garantisi',
            images: ['https://bicilingir.com/images/yildirim-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/yildirim-cilingir'
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