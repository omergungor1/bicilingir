'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function SchemaTest() {
    const [loaded, setLoaded] = useState(false);

    // Basit bir şema örneği
    const schemaExample = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Bursa Çilingir Listesi",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "LocalBusiness",
                    "name": "Ahmet Çilingirlik",
                    "image": "https://www.bicilingir.com/images/locksmith1.jpg",
                    "telephone": "+902421234567",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Atatürk Caddesi No:123",
                        "addressLocality": "Nilüfer",
                        "addressRegion": "Bursa",
                        "postalCode": "16000",
                        "addressCountry": "TR"
                    },
                    "priceRange": "$$",
                    "url": "https://www.bicilingir.com/cilingirler/ahmet-cilingirlik"
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "LocalBusiness",
                    "name": "Mehmet Çilingirlik",
                    "image": "https://www.bicilingir.com/images/locksmith2.jpg",
                    "telephone": "+902429876543",
                    "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "İnönü Caddesi No:456",
                        "addressLocality": "Osmangazi",
                        "addressRegion": "Bursa",
                        "postalCode": "16000",
                        "addressCountry": "TR"
                    },
                    "priceRange": "$$",
                    "url": "https://www.bicilingir.com/cilingirler/mehmet-cilingirlik"
                }
            }
        ]
    };

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">Bursa Çilingir Listesi</h1>
            <p className="my-4">Bu sayfada Bursa'daki çilingirler listelenmektedir. Google zengin sonuçlar testi için schema.org yapısı eklenmiştir.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
                <div className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Ahmet Çilingirlik</h2>
                    <p>Adres: Atatürk Caddesi No:123, Nilüfer, Bursa</p>
                    <p>Telefon: +902421234567</p>
                    <a href="/cilingirler/ahmet-cilingirlik" className="text-blue-600 hover:underline">Detaylar</a>
                </div>

                <div className="border p-4 rounded shadow">
                    <h2 className="text-xl font-semibold">Mehmet Çilingirlik</h2>
                    <p>Adres: İnönü Caddesi No:456, Osmangazi, Bursa</p>
                    <p>Telefon: +902429876543</p>
                    <a href="/cilingirler/mehmet-cilingirlik" className="text-blue-600 hover:underline">Detaylar</a>
                </div>
            </div>

            {/* Schema.org yapısı */}
            {loaded && (
                <Script id="schema-org-script" type="application/ld+json" strategy="afterInteractive">
                    {JSON.stringify(schemaExample)}
                </Script>
            )}
        </div>
    );
} 