'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({ error, reset }) {
    const router = useRouter();

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600 mb-4">Hata</h1>
                <h2 className="text-3xl font-semibold mb-6">Bir Şeyler Yanlış Gitti</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                    Beklenmeyen bir hata oluştu. Bu durumu teknik ekibimize bildirdik.
                    Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
                </p>

                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Tekrar Dene
                        </button>
                        <button
                            onClick={handleGoHome}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Ana Sayfaya Dön
                        </button>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-200 pt-8">
                    <p className="text-sm text-gray-500">
                        Çilingir mi lazım?{' '}
                        <button
                            onClick={handleGoHome}
                            className="text-blue-600 hover:underline"
                        >
                            BiÇilingir ile en yakın çilingiri hemen bulun.
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
