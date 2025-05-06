// http://localhost:3000/sehirler/bursa

import { Suspense } from 'react';
import CityContent from '../../components/city/CityContent';
import { getMetaData, getLocksmithsList } from '../utils/seo';
import Script from 'next/script';


// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getCityData(citySlug) {
    const locksmiths = await getLocksmithsList({ citySlug, count: 2 });
    const metadata = await getMetaData({
        citySlug,
        districtSlug: null,
        neighborhoodSlug: null,
        servicetypeSlug: null,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { metadata } = await getCityData(resolvedParams.city);
    return metadata;
}

export default async function CityPage({ params }) {
    const resolvedParams = await params;
    const { city: citySlug } = resolvedParams;
    const { locksmiths, metadata } = await getCityData(citySlug);

    // Structured data bilgisi
    const structuredData = metadata?.other?.structuredData;

    return (
        <>
            {structuredData && (
                <Script id="schema-data" type="application/ld+json" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: structuredData }} />
            )}
            <Suspense fallback={
                <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                    <div className="flex min-h-screen flex-col items-center justify-center p-4">
                        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-600">Yükleniyor...</p>
                    </div>
                </div>
            }>
                <CityContent citySlug={citySlug} locksmiths={locksmiths} />
            </Suspense>
        </>
    );
} 