import React from 'react';
import Script from 'next/script';
import StorySection from './components/StorySection';
import PostFeed from './components/PostFeed';
import VideoSection from './components/VideoSection';
import ImageGallery from './components/ImageGallery';
import PriceTable from './components/PriceTable';
import TrustSection from './components/TrustSection';
import FAQSection from './components/FAQSection';
import RelatedLinks from './components/RelatedLinks';

// SEO uyumlu metadata
export const metadata = {
    title: 'Çilingir Çağırmadan Önce Bilmeniz Gerekenler | Bi Çilingir',
    description: 'Çilingir hizmeti almadan önce bilmeniz gereken önemli bilgiler, fiyatlar, güvenlik önlemleri ve daha fazlası. Profesyonel çilingir hizmeti için doğru adımları öğrenin.',
    keywords: 'çilingir çağırmadan önce, çilingir bilgileri, çilingir fiyatları, çilingir güvenlik, çilingir tavsiyeleri, çilingir rehberi',
    openGraph: {
        title: 'Çilingir Çağırmadan Önce Bilmeniz Gerekenler | Bi Çilingir',
        description: 'Çilingir hizmeti almadan önce bilmeniz gereken önemli bilgiler, fiyatlar, güvenlik önlemleri ve daha fazlası.',
        type: 'article',
        url: 'https://bicilingir.com/cilingir-cagirmadan-once-bilmeniz-gerekenler',
    },
    alternates: {
        canonical: 'https://bicilingir.com/cilingir-cagirmadan-once-bilmeniz-gerekenler',
    },
    robots: {
        index: true,
        follow: true,
    },
};

// SSG için yapılandırma
export const dynamic = 'force-static';
export const fetchCache = 'force-cache';
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

export default function CilingirCagirmadanOnceBilmenizGerekenlerPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            {/* Story Section */}
            <section className="w-full py-4 bg-white border-b">
                <StorySection />
            </section>

            {/* SEO Çekirdek - Başlık ve Açıklama */}
            <article className="w-full py-8 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <header>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Çilingir Çağırmadan Önce Bilmeniz Gerekenler
                        </h1>
                    </header>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
                        <p className="text-lg leading-relaxed">
                            Kapınız kilitli kaldı, anahtarınız içeride kaldı veya acil bir çilingir ihtiyacınız var.
                            Panik anında yanlış kararlar almak hem maddi hem de güvenlik açısından ciddi sorunlara yol açabilir.
                            Bu rehber, çilingir çağırmadan önce bilmeniz gereken her şeyi kapsar.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Yanlış çilingir seçimi, kapınıza gereksiz zarar verebilir, fiyatlar beklenmedik şekilde yüksek çıkabilir
                            veya güvenlik riskleri oluşabilir. Bu rehber sayesinde doğru adımları atarak hem zaman hem de para tasarrufu
                            yapabilir, güvenli bir şekilde sorununuzu çözebilirsiniz.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Aşağıdaki bilgiler, çilingir hizmeti alırken dikkat etmeniz gereken tüm önemli noktaları içerir.
                            Her bölümü dikkatlice okuyarak bilinçli bir karar verebilirsiniz.
                        </p>
                    </div>
                </div>
            </article>

            {/* Post Feed Section */}
            <section id="yapilan-hatalar" className="w-full py-8 bg-white">
                <div className="container mx-auto max-w-2xl">
                    <PostFeed />
                </div>
            </section>

            {/* Video Section */}
            <section id="kapida-kaldim" className="w-full py-12 bg-gray-50">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Çilingir İşlemlerini İzleyin
                    </h2>
                    <VideoSection />
                </div>
            </section>

            {/* Image Gallery */}
            <section id="anahtar-iceride" className="w-full py-12 bg-white">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Çilingir İşlemleri Galerisi
                    </h2>
                    <ImageGallery />
                </div>
            </section>

            {/* Price Table */}
            <section id="fiyatlar" className="w-full py-12 bg-gray-50">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Çilingir Hizmet Fiyatları
                    </h2>
                    <PriceTable />
                </div>
            </section>

            {/* Trust Section */}
            <section id="gece-cilingir" className="w-full py-12 bg-white">
                <div className="container mx-auto max-w-4xl px-4">
                    <TrustSection />
                </div>
            </section>

            {/* FAQ Section */}
            <section className="w-full py-12 bg-gray-50">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
                        Sıkça Sorulan Sorular
                    </h2>
                    <FAQSection />
                </div>
            </section>

            {/* FAQ Schema JSON-LD */}
            <Script
                id="faq-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "Çilingir çağırmak güvenli mi?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Evet, güvenilir ve sertifikalı çilingirlerle çalışırsanız güvenlidir. Bi Çilingir platformundaki tüm çilingirler doğrulanmış ve güvenilirdir. Çilingirler kimlik kontrolü yapmalı ve ev sahibi olduğunuzu doğrulamalıdır."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Kapıya zarar verir mi?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Profesyonel çilingirler özel aletler kullanarak kapıyı hasarsız açabilir. Ancak kapıyı zorlamak veya kırmaya çalışmak ciddi hasarlara yol açabilir. Bu yüzden profesyonel çilingir çağırmak önemlidir."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Kimlik ister mi?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Evet, güvenlik nedeniyle çilingirler kimlik ve ev sahibi olduğunuzu gösteren belgeler (tapu, kira sözleşmesi, fatura vb.) isteyebilir. Bu standart bir güvenlik prosedürüdür."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "Gece fiyat farkı olur mu?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Evet, gece saatlerinde (genellikle 22:00-06:00 arası) çilingir hizmetleri için ek ücret alınabilir. Bu normal bir uygulamadır çünkü gece hizmeti daha zorlu ve acil durumlarda verilir."
                                }
                            }
                        ]
                    })
                }}
            />

            {/* Related Links */}
            <section className="w-full py-12 bg-white">
                <div className="container mx-auto max-w-4xl px-4">
                    <RelatedLinks />
                </div>
            </section>
        </main>
    );
}
