import Script from 'next/script';

// Schema JSON verisi
const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Bi Çilingir Kapı Açma Hizmeti",
    "image": "https://www.bicilingir.com/images/main-logo.png",
    "description": "Bursa'da 7/24 çilingir ve kapı açma hizmeti veren profesyonel ekibimizle hizmetinizdeyiz.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Atatürk Caddesi No:123",
        "addressLocality": "Nilüfer",
        "addressRegion": "Bursa",
        "postalCode": "16000",
        "addressCountry": "TR"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.1885,
        "longitude": 29.0610
    },
    "url": "https://www.bicilingir.com/bursa",
    "telephone": "+902121234567",
    "priceRange": "$$",
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            "opens": "00:00",
            "closes": "23:59"
        }
    ]
};

// Metadata statik olarak tanımlayalım
export const metadata = {
    title: "Bi Çilingir - Test Schema",
    description: "Bi Çilingir Schema.org test sayfası",
};

export default function TestSchemaPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold my-4">Çilingir Hizmetleri Test Sayfası</h1>
            <p className="my-4">
                Bursa'nın tüm ilçelerinde 7/24 kapı açma, kilit değiştirme, çelik kapı, kasa çilingir ve oto çilingir hizmetleri vermekteyiz.
            </p>

            <div className="my-8 p-4 border rounded shadow-md">
                <h2 className="text-2xl font-semibold">Bursa Çilingir Hizmetleri</h2>
                <p className="mt-2">Adres: Atatürk Caddesi No:123, Nilüfer, Bursa</p>
                <p>Telefon: +902121234567</p>
                <p>Çalışma Saatleri: 7/24 açık</p>
            </div>

            <Script id="schema-jsonld" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(schemaData)}
            </Script>
        </div>
    );
} 