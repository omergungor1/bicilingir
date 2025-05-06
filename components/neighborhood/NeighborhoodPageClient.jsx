import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

export default function NeighborhoodPageClient({
    citySlug,
    districtSlug,
    neighborhoodSlug,
    locksmiths,
    neighborhoodInfo,
    sideMenuParams,
    mainContentParams
}) {
    // params kontrolü 
    if (!citySlug || !districtSlug || !neighborhoodSlug) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
                    <p className="text-gray-600">Geçersiz şehir, ilçe veya mahalle bilgisi. Lütfen geçerli bir adres seçin.</p>
                    <Button className="mt-4" asChild>
                        <Link href="/">Ana Sayfaya Dön</Link>
                    </Button>
                </div>
            </div>
        );
    }

    if (!neighborhoodInfo || !sideMenuParams || !mainContentParams) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-xl">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="md:col-span-2">
                    <MainContent {...mainContentParams} />
                </div>

                <div className="md:col-span-1">
                    {/* SideMenu - sadece masaüstü görünümde */}
                    <div className="hidden md:block">
                        <SideMenu {...sideMenuParams} />
                    </div>
                </div>
            </div>
        </div>
    );
} 