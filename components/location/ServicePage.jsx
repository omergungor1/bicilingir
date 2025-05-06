"use client";

import React from "react";
import SideMenu from '../local/side-menu';
import MainContent from '../local/main-content';

export default function ServicePage({
    data,
    serviceInfo,
    locationInfo,
    sideMenuParams,
    mainContentParams
}) {
    const { citySlug, districtSlug, neighborhoodSlug, servicetypeSlug, locksmiths } = data;

    if (!serviceInfo || !locationInfo || !sideMenuParams || !mainContentParams) {
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