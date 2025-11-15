'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

// Tüm uygulama için tek bir konfigürasyon
const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'GOOGLE_MAPS_API_KEY',
    libraries: ['places'],
    id: 'google-map-script',
    version: 'weekly',
    language: 'tr',
    region: 'TR',
};

const MapsContext = createContext();

export function MapsProvider({ children }) {
    const [deferLoad, setDeferLoad] = useState(false);

    // Google Maps'i sayfa yüklendikten sonra yükle (defer loading)
    useEffect(() => {
        // Sayfa yüklendikten 2 saniye sonra yükle - kritik olmayan kaynak
        const timer = setTimeout(() => {
            setDeferLoad(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // useJsApiLoader'ı sadece deferLoad true olduğunda aktif et
    const loaderConfig = deferLoad ? GOOGLE_MAPS_CONFIG : {
        ...GOOGLE_MAPS_CONFIG,
        googleMapsApiKey: '', // Boş key ile yükleme engellenir
    };

    const { isLoaded, loadError } = useJsApiLoader(loaderConfig);

    return (
        <MapsContext.Provider value={{ isLoaded: deferLoad ? isLoaded : false, loadError }}>
            {children}
        </MapsContext.Provider>
    );
}

export function useMaps() {
    const context = useContext(MapsContext);
    if (context === undefined) {
        throw new Error('useMaps must be used within a MapsProvider');
    }
    return context;
} 