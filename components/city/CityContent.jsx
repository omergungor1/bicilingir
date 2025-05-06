import React from 'react';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

export default function CityContent({ citySlug, locksmiths, cityData, sideMenuParams, mainContentParams, sssList }) {
    if (!cityData || !sideMenuParams || !mainContentParams) {
        return (
            <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
                <div className="flex min-h-screen flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    <p className="mt-4 text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <MainContent {...mainContentParams} />
                </div>

                <div className="lg:col-span-1">
                    <SideMenu {...sideMenuParams} />
                </div>
            </div>
        </div>
    );
} 