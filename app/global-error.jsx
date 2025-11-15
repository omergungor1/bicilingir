'use client';

import Link from 'next/link';

export default function GlobalError({ error, reset }) {
    return (
        <html lang="tr">
            <body>
                <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold text-red-600 mb-4">Hata</h1>
                        <h2 className="text-3xl font-semibold mb-6">Kritik Bir Hata Oluştu</h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
                            Uygulamamızda kritik bir hata oluştu. Bu durumu teknik ekibimize bildirdik.
                            Lütfen sayfayı yenilemeyi deneyin.
                        </p>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                                <button
                                    onClick={() => reset()}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Tekrar Dene
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Ana Sayfaya Dön
                                </Link>
                            </div>
                        </div>

                        <div className="mt-12 border-t border-gray-200 pt-8">
                            <p className="text-sm text-gray-500">
                                Çilingir mi lazım?{' '}
                                <Link href="/" className="text-blue-600 hover:underline">
                                    BiÇilingir ile en yakın çilingiri hemen bulun.
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
