"use client";

import React from 'react';
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

export default function DistrictContent({
    citySlug,
    districtSlug,
    locksmiths,
    districtInfo,
    sideMenuParams,
    mainContentParams
}) {
    if (!districtInfo || !sideMenuParams || !mainContentParams) {
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
        <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <MainContent {...mainContentParams} />
                </div>
                <div className="lg:col-span-1 hidden md:block">
                    <SideMenu {...sideMenuParams} />
                </div>
            </div>
        </div>
    );
} 