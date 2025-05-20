import { mockLocksmiths } from '../../../../data/mock-yildirim-cilingirler';
import LocksmithCard from '../../../../components/ui/locksmith-card';

export default function YildirimEvCilingirPage() {
    const sssList = [
        {
            question: `Yıldırım'da ev çilingiri ne kadar?`,
            answer: `Yıldırım'da ev çilingiri hizmet fiyatları 250₺-400₺ arasında değişmektedir. Kapı tipi ve kilit sistemine göre fiyat değişebilir. Net fiyat için arayabilirsiniz.`
        },
        {
            question: `Ev kilidi değiştirmek ne kadar sürer?`,
            answer: `Ev kilidi değiştirme işlemi ortalama 20-30 dakika sürer. Kilit tipi ve kapının durumuna göre bu süre değişebilir.`
        },
        {
            question: `Ev anahtarımı kaybettim ne yapmalıyım?`,
            answer: `Öncelikle sakin olun ve bizi arayın. Ekiplerimiz en kısa sürede kapınızı hasarsız açarak yeni anahtar yapacaktır.`
        },
        {
            question: `Ev kapısı kilidi bozuldu, değiştirmeli miyim?`,
            answer: `Kilit mekanizmasının durumuna göre tamir veya değişim önerilir. Ekiplerimiz ücretsiz kontrol ederek en uygun çözümü sunar.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y px-4 md:px-16 lg:px-32 pt-2 pb-8">
            {/* Sayfa başlığı */}
            <div className="mb-3">
                <h1 className="text-xl font-bold mb-2">Yıldırım Ev Çilingiri</h1>
                <p className="text-sm md:text-base text-gray-700">
                    Yıldırım'da ev kilitlerinde uzman çilingirler. Kapı açma, kilit değişimi ve anahtar kopyalama hizmetleri için hemen arayın!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            <section aria-label="Ev Çilingiri Bilgilendirme">
                <h2 className="text-xl font-bold mb-4">Yıldırım Ev Çilingiri Hizmetleri</h2>
                <p className="text-gray-700 mb-6">
                    Ev güvenliği konusunda uzman çilingir ekiplerimiz, modern ve güvenilir çözümler sunar.
                    Kapı açma, kilit değişimi ve anahtar kopyalama işlemleriniz için bizi tercih edebilirsiniz.
                </p>
            </section>

            {/* Ev Çilingiri Hizmetleri */}
            <section aria-label="Ev Çilingiri Hizmetleri" className="mb-8">
                <h2 className="text-xl font-bold mb-6">Ev Çilingiri Hizmet Listesi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Ev Kapısı Açma",
                            desc: "Anahtarınızı kaybettiyseniz veya içeride unuttaysanız, kapınızı hasarsız şekilde açıyoruz."
                        },
                        {
                            title: "Ev Kilidi Değişimi",
                            desc: "Bozulan, eskiyen veya güvenlik nedeniyle değiştirilmesi gereken ev kilitlerini değiştiriyoruz."
                        },
                        {
                            title: "Ev Anahtarı Kopyalama",
                            desc: "Her türlü ev anahtarınızın kopyasını çıkartıyor, yedek anahtar yapıyoruz."
                        },
                        {
                            title: "Çelik Kapı Tamiri",
                            desc: "Çelik kapı kilit sistemleri, barel değişimi ve tamir işlemlerini yapıyoruz."
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
        title: 'Yıldırım Ev Çilingiri - Kapı Açma ve Kilit Değişimi | Uygun Fiyat',
        description: 'Yıldırım\'da ev çilingiri hizmeti ✓ Kapı açma 250₺\'den başlayan fiyatlarla ✓ Kilit değişimi ✓ Anahtar kopyalama. Hemen Ara!',
        keywords: 'Yıldırım ev çilingiri, ev kapısı açma, kilit değişimi, anahtar kopyalama, çelik kapı tamiri',
        openGraph: {
            title: 'Yıldırım Ev Çilingiri | Güvenilir ve Uygun Fiyatlı',
            description: '✓ Kapı Açma\n✓ Kilit Değişimi\n✓ Anahtar Kopyalama\n✓ Profesyonel Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/yildirim/ev-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/yildirim-ev-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Yıldırım Ev Çilingiri Hizmeti'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Yıldırım Ev Çilingiri | Güvenilir ve Uygun Fiyatlı',
            description: '✓ Kapı Açma\n✓ Kilit Değişimi\n✓ Anahtar Kopyalama',
            images: ['https://bicilingir.com/images/yildirim-ev-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/yildirim/ev-cilingir'
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
