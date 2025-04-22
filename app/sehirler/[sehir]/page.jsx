// http://localhost:3000/sehirler/bursa

import { Suspense } from 'react';
import CityContent from '../../../components/city/CityContent';

export async function generateMetadata({ params }) {
    const sehir = params.sehir;
    const capitalizedSehir = sehir.charAt(0).toUpperCase() + sehir.slice(1);

    return {
        title: `${capitalizedSehir} Çilingir Hizmetleri | BiÇilingir`,
        description: `${capitalizedSehir} ilinde 7/24 acil çilingir, oto çilingir, ev ve işyeri çilingir hizmetleri.`,
        openGraph: {
            title: `${capitalizedSehir} Çilingir Hizmetleri | BiÇilingir`,
            description: `${capitalizedSehir} ilinde 7/24 acil çilingir, oto çilingir, ev ve işyeri çilingir hizmetleri.`,
            images: '/images/og-image.jpg',
        },
    };
}

export default function CityPage({ params }) {
    const { sehir } = params;

    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        }>
            <CityContent sehir={sehir} />
        </Suspense>
    );
} 