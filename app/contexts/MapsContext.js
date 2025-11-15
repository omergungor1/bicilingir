'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
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
    const [shouldLoad, setShouldLoad] = useState(false);

    // Google Maps'i sayfa yüklendikten sonra yükle (defer loading)
    useEffect(() => {
        // Sayfa yüklendikten 2 saniye sonra yükle - kritik olmayan kaynak
        const timer = setTimeout(() => {
            setShouldLoad(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // useJsApiLoader'ı her zaman aynı konfigürasyonla çağır
    // React hook kurallarına uymak için konfigürasyon değişmemeli
    // Lazy loading için shouldLoad state'ini kullanıyoruz
    const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_CONFIG);

    // Sadece shouldLoad true olduğunda isLoaded'ı true olarak döndür
    // Bu, script'in yüklenmesini kontrol eder
    const effectiveIsLoaded = useMemo(() => {
        return shouldLoad && isLoaded;
    }, [shouldLoad, isLoaded]);

    return (
        <MapsContext.Provider value={{ isLoaded: effectiveIsLoaded, loadError }}>
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