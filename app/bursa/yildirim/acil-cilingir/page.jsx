import { mockLocksmiths } from '../../../../data/mock-yildirim-cilingirler';
import LocksmithCard from '../../../../components/ui/locksmith-card';

export default function YildirimAcilCilingirPage() {
    const sssList = [
        {
            question: `Yıldırım'da gece açık çilingir var mı?`,
            answer: `Evet, Yıldırım'da 7/24 hizmet veren acil çilingirlerimiz bulunmaktadır. Gece-gündüz demeden en geç 20 dakika içinde yanınızda oluruz.`
        },
        {
            question: `Yıldırım'da acil çilingir ücreti ne kadar?`,
            answer: `Yıldırım'da acil çilingir hizmeti 300₺-500₺ arasında değişmektedir. Gece mesaisi ve acil durum ek ücreti uygulanabilir. Net fiyat için hemen arayabilirsiniz.`
        },
        {
            question: `Yıldırım'da çilingir kaç dakikada gelir?`,
            answer: `Yıldırım'da acil çilingir ekiplerimiz ortalama 15-20 dakika içinde olay yerine ulaşır. Trafik durumuna göre bu süre değişebilir.`
        },
        {
            question: `Yıldırım'da 24 saat çilingir hizmeti var mı?`,
            answer: `Evet, Yıldırım'da 24 saat kesintisiz çilingir hizmeti veriyoruz. Gece yarısı bile olsa hemen ulaşabilirsiniz.`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden touch-pan-y px-4 md:px-16 lg:px-32 pt-2 pb-8">
            {/* Sayfa başlığı */}
            <div className="mb-3">
                <h1 className="text-xl font-bold mb-2">Yıldırım Acil Çilingirler</h1>
                <a data-gtm="ilce-secimi" href="/" className="inline-block text-blue-600 hover:text-blue-800 mb-3">
                    📍 Başka ilçede misin? İlçeni seç!
                </a>
                <p className="text-sm md:text-base text-gray-700">
                    Yıldırım'da 7 gün 24 saat çalışan acil çilingirler listelenmiştir. Bilgi için hemen arayın!
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8">
                {mockLocksmiths.map((locksmith, index) => (
                    <LocksmithCard key={index} locksmith={locksmith} index={index} />
                ))}
            </div>

            <section aria-label="Çilingir Bilgilendirme">
                <h2 className="text-xl font-bold mb-4">Yıldırım Acil Çilingir Anahtarcılar</h2>
                <p className="text-gray-700 mb-6">
                    Yukarıda listelenen çilingirler Yıldırım'da 7/24 acil çilingir hizmeti vermektedir.
                    Tüm ekiplerimiz şu an aktif ve göreve hazırdır. Acil durumlar için hemen arayabilirsiniz.
                </p>
            </section>

            {/* Çilingir Hizmetleri */}
            <section aria-label="Acil Çilingir Hizmetleri" className="mb-8">
                <h2 className="text-xl font-bold mb-6">Yıldırım Acil Çilingir Hizmetleri</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "Kapıda Kalma",
                            desc: "Yıldırım'da kapınız mı kilitli kaldı? Ekiplerimiz 20 dakika içinde kapınızı hasarsız açar. 7/24 hızlı çözüm!"
                        },
                        {
                            title: "Çelik Kapı Açma",
                            desc: "Yıldırım'da çelik kapınız mı açılmıyor? Özel ekipmanlarımızla tüm çelik kapı sorunlarını anında çözüyoruz."
                        },
                        {
                            title: "Kırılan Anahtar Çıkarma",
                            desc: "Anahtarınız kilitde mi kırıldı? Özel aparatlarımızla kırık anahtarı çıkarıp, yenisini yapıyoruz."
                        },
                        {
                            title: "Acil Kilit Değişimi",
                            desc: "Güvenliğiniz risk altında mı? Yıldırım'da 7/24 acil kilit değişimi yapıyoruz. Anında müdahale!"
                        }
                    ].map((service, idx) => (
                        <article key={idx} className="bg-white p-6 rounded-lg border border-gray-100 hover:border-red-100 transition-colors">
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
        title: 'Yıldırım Acil Çilingir - 7/24 Hızlı Çilingir Hizmeti | 20dk İçinde Kapınızda',
        description: 'Yıldırım\'da acil çilingir mi lazım? ⚡ 20 dakika içinde kapınızdayız! 7/24 açık ✓ Kapı açma 300₺\'den başlayan fiyatlarla. Hemen Ara!',
        keywords: 'Yıldırım acil çilingir, Yıldırım 7/24 çilingir, kapı açma, çelik kapı açma, kırık anahtar çıkarma, gece çilingir',
        openGraph: {
            title: 'Yıldırım Acil Çilingir | 20 Dakika İçinde Kapınızda ⚡',
            description: '✓ 7/24 Hızlı Hizmet\n✓ 20dk İçinde Müdahale\n✓ Uygun Fiyat\n✓ Profesyonel Ekip',
            type: 'website',
            locale: 'tr_TR',
            url: 'https://bicilingir.com/bursa/yildirim/acil-cilingir',
            siteName: 'Bi Çilingir',
            images: [{
                url: 'https://bicilingir.com/images/yildirim-acil-cilingir.png',
                width: 1200,
                height: 630,
                alt: 'Yıldırım 7/24 Acil Çilingir'
            }]
        },
        twitter: {
            card: 'summary_large_image',
            title: 'Yıldırım Acil Çilingir | 20 Dakika İçinde Kapınızda ⚡',
            description: '✓ 7/24 Hızlı Hizmet\n✓ 20dk İçinde Müdahale\n✓ Uygun Fiyat',
            images: ['https://bicilingir.com/images/yildirim-acil-cilingir.png']
        },
        alternates: {
            canonical: 'https://bicilingir.com/bursa/yildirim/acil-cilingir'
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
