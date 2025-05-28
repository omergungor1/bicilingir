'use client';

import { createContext, useContext } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

// Tüm uygulama için tek bir konfigürasyon
const GOOGLE_MAPS_CONFIG = {
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'GOOGLE_MAPS_API_KEY',
    libraries: ['places', 'maps'],
    id: 'google-map-script',
    version: 'weekly',
    language: 'tr',
    region: 'TR'
};

const MapsContext = createContext();

export function MapsProvider({ children }) {
    const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_CONFIG);

    return (
        <MapsContext.Provider value={{ isLoaded, loadError }}>
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