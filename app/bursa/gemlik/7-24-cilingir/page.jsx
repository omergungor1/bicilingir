import { mockLocksmiths } from '../../../../data/mock-gemlik-cilingirler';
import LocksmithCard from '../../../../components/ui/locksmith-card';

export default function Gemlik724CilingirPage() {
    const sssList = [
        {
            question: `Gemlik'te 7/24 çilingir hizmeti var mı?`,
            answer: `Evet, Gemlik'te 7 gün 24 saat kesintisiz çilingir hizmeti veriyoruz. Gece gündüz demeden profesyonel ekiplerimiz hizmetinizdedir.`
        },
        {
            question: `Gemlik'te gece çilingir ücreti ne kadar?`,
            answer: `Gemlik'de 7/24 çilingir hizmeti 300₺-500₺ arasında değişmektedir. Gece mesai saatlerinde ek ücret uygulanabilir. Detaylı bilgi için hemen arayabilirsiniz.`
        },
        {
            question: `Gemlik'te hafta sonu çilingir var mı?`,
            answer: `Evet, Gemlik'te hafta sonu ve resmi tatillerde de kesintisiz çilingir hizmeti veriyoruz. 7 gün 24 saat bize ulaşabilirsiniz.`
        },
        {
            question: `Gemlik'te çilingir ne kadar sürede gelir?`,
            answer: `Gemlik'te çilingir ekiplerimiz bulunduğunuz konuma göre ortalama 15-20 dakika içinde yanınızda olur. Trafik durumuna göre bu süre değişebilir.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y px-4 md:px-16 lg:px-32 pt-2 pb-8">
            {/* Sayfa başlığı */}
            <div className="mb-3">
                <h1 className="text-xl font-bold mb-2">Gemlik 7/24 Çilingirler</h1>
                <p className="text-sm md:text-base text-gray-700">
                    Gemlik'te 7 gün 24 saat çalışan çilingirler listelenmiştir. Bilgi için hemen arayın!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            <section aria-label="Çilingir Bilgilendirme">
                <h2 className="text-xl font-bold mb-4">Gemlik 7/24 Çilingir Anahtarcılar</h2>
                <p className="text-gray-700 mb-6">
                    Aşağıda listelenen çilingirler Gemlik'te kesintisiz hizmet vermektedir.
                    Tüm ekiplerimiz aktif ve göreve hazırdır. Gece gündüz demeden arayabilirsiniz.
                </p>
            </section>

            {/* Çilingir Hizmetleri */}
            <section aria-label="7/24 Çilingir Hizmetleri" className="mb-8">
                <h2 className="text-xl font-bold mb-6">Gemlik 7/24 Çilingir Hizmetleri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Gece Çilingir",
                            desc: "Gemlik'te gece yarısı mı kapıda kaldınız? 7/24 çilingir ekiplerimiz her an yanınızda. Gece gündüz demeden hizmetinizdeyiz!"
                        },
                        {
                            title: "Hafta Sonu Çilingir",
                            desc: "Hafta sonu ve tatil günlerinde de kesintisiz hizmet. Gemlik'te 7 gün 24 saat çilingir hizmeti veriyoruz."
                        },
                        {
                            title: "Anahtar Kopyalama",
                            desc: "Her türlü anahtar kopyalama ve çoğaltma işlemi için 7/24 hizmetinizdeyiz. Gemlik'te istediğiniz zaman gelin!"
                        },
                        {
                            title: "Kilit Değişimi",
                            desc: "Gemlik'te 7/24 kilit değişimi ve montajı yapıyoruz. Çelik kapı, normal kapı ve garaj kilitleri için bizi arayın."
                        }
                    ].map((service, idx) => (
                        <article key={idx} className="bg-white p-6 rounded-lg border border-gray-100 hover:border-blue-100 transition-colors">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                            <p className="text-gray-700 leading-relaxed">{service.desc}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* Sık Sorulan Sorular */}
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sık Sorulan Sorular</h2>
            <div className="space-y-2">
                {
                    sssList.map((item, index) => (
                        <details key={index} className="bg-gray-50 rounded-lg p-2">
                            <summary className="font-semibold text-gray-800 cursor-pointer">{item.question}</summary>
                            <p className="mt-2 text-gray-700">
                                {item.answer}
                            </p>
                        </details>
                    ))
                }
            </div>
        </div>
    );
}

// Sayfa metadatalarını oluştur
export async function generateMetadata() {
    return {
        title: 'Gemlik 7/24 Çilingir - Kesintisiz Çilingir Hizmeti | Gece Gündüz Açık',
        description: 'Gemlik\'te 7/24 çilingir hizmeti ✓ Gece gündüz açık ✓ Kapı açma 300₺\'den başlayan fiyatlarla. Hemen Ara!',
        keywords: 'Gemlik 7/24 çilingir, Gemlik gece çilingir, hafta sonu çilingir, kesintisiz çilingir, kapı açma, kilit değiştirme',
        openGraph: {
            title: 'Gemlik 7/24 Çilingir | Gece Gündüz Hizmetinizdeyiz',
            description: '✓ 7 Gün 24 Saat Açık\n✓ Gece Çilingir Hizmeti\n✓ Uygun Fiyat\n✓ Profesyonel Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/gemlik/7-24-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/gemlik-724-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Gemlik 7/24 Çilingir Hizmeti'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Gemlik 7/24 Çilingir | Gece Gündüz Hizmetinizdeyiz',
            description: '✓ 7 Gün 24 Saat Açık\n✓ Gece Çilingir Hizmeti\n✓ Uygun Fiyat',
            images: ['https://bicilingir.com/images/gemlik-724-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/gemlik/7-24-cilingir'
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
