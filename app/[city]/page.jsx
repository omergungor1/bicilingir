// http://localhost:3000/sehirler/bursa

import { Suspense } from 'react';
import CityContent from '../../components/city/CityContent';
import { getMetaData } from '../utils/seo';

// API'den çilingir verilerini çek
async function getLocksmithsData(citySlug) {
    try {
        const params = new URLSearchParams();
        if (citySlug) params.append('citySlug', citySlug);

        const response = await fetch(`/api/locksmiths?${params.toString()}`, {
            cache: 'no-store' // Gerçek verileri almak için önbelleği devre dışı bırak
        });

        if (!response.ok) {
            throw new Error('API yanıt vermedi');
        }

        const data = await response.json();
        return data.locksmiths || [];
    } catch (error) {
        console.error('Çilingir verileri çekilirken hata:', error);
        return [];
    }
}

// Veriyi tek bir yerden çekmek için yardımcı fonksiyon
async function getCityData(citySlug) {
    const locksmiths = await getLocksmithsData(citySlug);
    const metadata = await getMetaData({
        citySlug,
        districtSlug: null,
        neighborhoodSlug: null,
        serviceTypeSlug: null,
        locksmiths
    });

    return { locksmiths, metadata };
}

export async function generateMetadata({ params }) {
    const { metadata } = await getCityData(params.city);
    return metadata;
}

export default async function CityPage({ params }) {
    const { city: citySlug } = params;
    const { locksmiths } = await getCityData(citySlug);

    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        }>
            <CityContent city={citySlug} locksmiths={locksmiths} />
        </Suspense>
    );
} 