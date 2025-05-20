import { mockLocksmiths } from '../../../../data/mock-yildirim-cilingirler';
import LocksmithCard from '../../../../components/ui/locksmith-card';

export default function YildirimKasaCilingirPage() {
    const sssList = [
        {
            question: `Yıldırım'da kasa çilingiri ne kadar?`,
            answer: `Yıldırım'da kasa çilingiri hizmet fiyatları 500₺-1500₺ arasında değişmektedir. Kasanın tipi, markası ve durumuna göre fiyat değişebilir. Net fiyat için arayabilirsiniz.`
        },
        {
            question: `Kasa şifremi unuttum ne yapmalıyım?`,
            answer: `Endişelenmeyin, profesyonel ekibimiz kasanızı hasarsız şekilde açabilir. Kasa markası ve modelini belirterek bizi arayın.`
        },
        {
            question: `Dijital kasa şifre değişimi yapıyor musunuz?`,
            answer: `Evet, her marka dijital kasanın şifre değişimi ve yeniden programlama işlemlerini yapıyoruz.`
        },
        {
            question: `Kasa tamiri ne kadar sürer?`,
            answer: `Kasa tamiri ortalama 1-2 saat sürer. Arıza durumu ve kasa tipine göre bu süre değişebilir. Yerinde tespit sonrası net bilgi verilir.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y px-4 md:px-16 lg:px-32 pt-2 pb-8">
            {/* Sayfa başlığı */}
            <div className="mb-3">
                <h1 className="text-xl font-bold mb-2">Yıldırım Kasa Çilingiri</h1>
                <p className="text-sm md:text-base text-gray-700">
                    Yıldırım'da kasa açma, şifre değişimi ve tamir konusunda uzman çilingirler. Tüm marka kasalar için hizmet veriliyor. Bilgi için hemen arayın!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            <section aria-label="Kasa Çilingiri Bilgilendirme">
                <h2 className="text-xl font-bold mb-4">Yıldırım Kasa Çilingiri Hizmetleri</h2>
                <p className="text-gray-700 mb-6">
                    Kasa güvenliği konusunda uzman çilingir ekiplerimiz, her marka ve model kasa için profesyonel çözümler sunar.
                    Şifre unutulması, arıza veya bakım işlemleriniz için 7/24 hizmetinizdeyiz.
                </p>
            </section>

            {/* Kasa Çilingiri Hizmetleri */}
            <section aria-label="Kasa Çilingiri Hizmetleri" className="mb-8">
                <h2 className="text-xl font-bold mb-6">Kasa Çilingiri Hizmet Listesi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Kasa Açma",
                            desc: "Şifresini unuttuğunuz veya arızalanan kasanızı hasarsız şekilde açıyoruz. Tüm marka kasalar için geçerlidir."
                        },
                        {
                            title: "Kasa Şifre Değişimi",
                            desc: "Mekanik ve dijital kasaların şifre değişimi, yeniden programlama işlemlerini yapıyoruz."
                        },
                        {
                            title: "Kasa Tamiri",
                            desc: "Her türlü kasa arızası, kilit sistemi tamiri ve bakım işlemlerini gerçekleştiriyoruz."
                        },
                        {
                            title: "Kasa Bakımı",
                            desc: "Düzenli bakım ile kasanızın ömrünü uzatıyor, olası arızaların önüne geçiyoruz."
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
        title: 'Yıldırım Kasa Çilingiri - Kasa Açma ve Şifre Değişimi | Profesyonel Hizmet',
        description: 'Yıldırım\'da kasa çilingiri hizmeti ✓ Kasa açma 500₺\'den başlayan fiyatlarla ✓ Şifre değişimi ✓ Kasa tamiri. Hemen Ara!',
        keywords: 'Yıldırım kasa çilingiri, kasa açma, şifre değişimi, kasa tamiri, kasa bakımı',
        openGraph: {
            title: 'Yıldırım Kasa Çilingiri | Güvenilir ve Profesyonel',
            description: '✓ Kasa Açma\n✓ Şifre Değişimi\n✓ Kasa Tamiri\n✓ Uzman Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/yildirim/kasa-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/yildirim-kasa-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Yıldırım Kasa Çilingiri Hizmeti'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Yıldırım Kasa Çilingiri | Güvenilir ve Profesyonel',
            description: '✓ Kasa Açma\n✓ Şifre Değişimi\n✓ Kasa Tamiri',
            images: ['https://bicilingir.com/images/yildirim-kasa-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/yildirim/kasa-cilingir'
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
