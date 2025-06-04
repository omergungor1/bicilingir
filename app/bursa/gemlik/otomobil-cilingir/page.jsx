import { mockLocksmiths } from '../../../../data/mock-gemlik-cilingirler';
import LocksmithCard from '../../../../components/ui/locksmith-card';

export default function GemlikOtomobilCilingirPage() {
    const sssList = [
        {
            question: `Gemlik'te oto çilingir ne kadar?`,
            answer: `Gemlik'te oto çilingir hizmet fiyatları 300₺-800₺ arasında değişmektedir. Araç markası, modeli ve yapılacak işleme göre fiyat değişebilir. Net fiyat için arayabilirsiniz.`
        },
        {
            question: `Araç anahtarımı kaybettim ne yapmalıyım?`,
            answer: `Endişelenmeyin, yedek anahtarınız olmasa bile aracınıza yeni anahtar yapabiliyoruz. Araç ruhsatı ve kimliğinizle birlikte bizi arayın.`
        },
        {
            question: `Immobilizer anahtar yapımı yapıyor musunuz?`,
            answer: `Evet, tüm marka araçlar için chip kodlama ve immobilizer anahtar yapımı hizmeti veriyoruz.`
        },
        {
            question: `Araç kapısı açma işlemi ne kadar sürer?`,
            answer: `Araç kapısı açma işlemi ortalama 15-20 dakika sürer. Aracın markası ve kilit sistemine göre bu süre değişebilir.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y px-4 md:px-16 lg:px-32 pt-2 pb-8">
            {/* Sayfa başlığı */}
            <div className="mb-3">
                <h1 className="text-xl font-bold mb-2">Gemlik Otomobil Çilingiri</h1>
                <a data-gtm="ilce-secimi" href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-3">
                    📍 Başka ilçede misin? İlçeni seç!
                </a>
                <p className="text-sm md:text-base text-gray-700">
                    Gemlik'te araç kapısı açma, anahtar yapımı ve kontak tamiri konusunda uzman çilingirler. Tüm marka araçlar için hizmet veriliyor. Bilgi için hemen arayın!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            <section aria-label="Otomobil Çilingiri Bilgilendirme">
                <h2 className="text-xl font-bold mb-4">Gemlik Otomobil Çilingiri Hizmetleri</h2>
                <p className="text-gray-700 mb-6">
                    Otomobil güvenliği konusunda uzman çilingir ekiplerimiz, her marka ve model araç için profesyonel çözümler sunar.
                    Anahtar kaybı, kapı açma veya kontak arızası durumlarında 7/24 hizmetinizdeyiz.
                </p>
            </section>

            {/* Otomobil Çilingiri Hizmetleri */}
            <section aria-label="Otomobil Çilingiri Hizmetleri" className="mb-8">
                <h2 className="text-xl font-bold mb-6">Otomobil Çilingiri Hizmet Listesi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Araç Kapısı Açma",
                            desc: "Anahtarınızı içeride unuttunuz veya kaybettiyseniz, aracınızı hasarsız şekilde açıyoruz."
                        },
                        {
                            title: "Anahtar Yapımı",
                            desc: "Tüm marka araçlar için yedek anahtar, kumanda kopyalama ve chip kodlama hizmeti veriyoruz."
                        },
                        {
                            title: "Kontak Tamiri",
                            desc: "Kontak arızası, kontak yuvası değişimi ve tamiri işlemlerini gerçekleştiriyoruz."
                        },
                        {
                            title: "İmmobilizer Kodlama",
                            desc: "Araç immobilizer sistemleri için anahtar kodlama ve programlama yapıyoruz."
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
        title: 'Gemlik Otomobil Çilingiri - Araç Kapısı Açma ve Anahtar Yapımı | Profesyonel Hizmet',
        description: 'Gemlik\'te otomobil çilingiri hizmeti ✓ Araç kapısı açma 300₺\'den başlayan fiyatlarla ✓ Anahtar yapımı ✓ Kontak tamiri. Hemen Ara!',
        keywords: 'Gemlik otomobil çilingiri, araç kapısı açma, anahtar yapımı, kontak tamiri, immobilizer kodlama',
        openGraph: {
            title: 'Gemlik Otomobil Çilingiri | Güvenilir ve Profesyonel',
            description: '✓ Araç Kapısı Açma\n✓ Anahtar Yapımı\n✓ Kontak Tamiri\n✓ Uzman Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/gemlik/otomobil-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/gemlik-otomobil-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Gemlik Otomobil Çilingiri Hizmeti'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Gemlik Otomobil Çilingiri | Güvenilir ve Profesyonel',
            description: '✓ Araç Kapısı Açma\n✓ Anahtar Yapımı\n✓ Kontak Tamiri',
            images: ['https://bicilingir.com/images/gemlik-otomobil-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/gemlik/otomobil-cilingir'
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
