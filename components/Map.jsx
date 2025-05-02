"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Phone } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.75rem',
};

// Google Maps API için stil ayarları
const defaultOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    streetViewControl: true,
    scrollwheel: false,
    // Map ID kullanılırken styles özelliği kullanılamaz
    // Stil ayarları Google Cloud Console üzerinden yapılmalıdır
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || ''
    // styles özelliğini kaldırıyoruz
};

// Console uyarılarını bastırmak için yardımcı fonksiyon
const suppressConsoleWarnings = () => {
    const originalConsoleWarn = console.warn;
    console.warn = function (msg, ...args) {
        // Google Maps uyarılarını filtreliyoruz
        if (typeof msg === 'string' &&
            (msg.includes('google.maps.Marker is deprecated') ||
                msg.includes('Google Maps JavaScript API:'))) {
            return;
        }
        originalConsoleWarn.apply(this, [msg, ...args]);
    };

    return () => {
        // Temizlik - orjinal console.warn'ı geri yükle
        console.warn = originalConsoleWarn;
    };
};

const Map = ({ center, zoom = 14, markers = [] }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [map, setMap] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapMarkers, setMapMarkers] = useState([]);


    // Uyarıları bastırma
    useEffect(() => {
        const restoreConsole = suppressConsoleWarnings();
        return () => restoreConsole();
    }, []);

    const onLoad = useCallback(function callback(map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        setMap(null);
    }, []);

    // Map marker'ının tıklanma işlemi
    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    // Info window'un kapatılma işlemi
    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    };

    // Programatik olarak markerları oluştur
    // Bu yaklaşım console.log uyarılarını engeller çünkü JSX içinde <Marker> kullanmıyoruz
    useEffect(() => {
        // Markerları temizle
        mapMarkers.forEach(marker => {
            if (marker) marker.setMap(null);
        });

        // Map henüz yüklenmediyse
        if (!map || !window.google) return;

        // Yeni markerları oluştur
        const newMarkers = markers.map((markerData) => {
            const marker = new window.google.maps.Marker({
                position: markerData.position,
                map: map,
                icon: {
                    url: '/images/map-marker.png',
                    scaledSize: new window.google.maps.Size(50, 50),
                }
            });

            marker.addListener('click', () => {
                handleMarkerClick(markerData);
            });

            return marker;
        });

        setMapMarkers(newMarkers);

        // Temizleme
        return () => {
            newMarkers.forEach(marker => {
                if (marker) marker.setMap(null);
            });
        };
    }, [map, markers]);

    // Merkezi pozisyon değiştiğinde haritayı güncelle
    useEffect(() => {
        if (map && center) {
            map.panTo(center);
        }
    }, [map, center]);

    if (!isLoaded || !center) {
        return <div className="bg-gray-200 animate-pulse rounded-xl" style={containerStyle} />;
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={defaultOptions}
        >
            {/* JSX içinde <Marker> kullanmıyoruz, bunun yerine useEffect içinde programatik olarak oluşturuyoruz */}

            {selectedMarker && (
                <InfoWindow
                    position={selectedMarker.position}
                    onCloseClick={handleInfoWindowClose}
                >
                    <div className="p-2 max-w-xs flex items-start gap-2">
                        <Image src='/images/map-marker.png' alt='Çilingir logo' width={40} height={40} />
                        <div>
                            <h3 className="font-semibold text-gray-900">{selectedMarker.title}</h3>
                            {selectedMarker.description && (
                                <p className="text-sm text-gray-600 mt-1">{selectedMarker.description}</p>
                            )}
                            <div className="mt-2">
                                <Button className="gap-2 flex items-center w-full bg-primary text-white animate-pulse" variant="outline" size="icon">
                                    <Phone className="w-4 h-4 mr-2" />
                                    <span className="text-sm">Hemen Ara</span>
                                </Button>
                            </div>
                        </div>
                        {selectedMarker.image && (
                            <div className="mt-2">
                                <Image
                                    src={selectedMarker.image}
                                    alt={selectedMarker.title}
                                    width={150}
                                    height={100}
                                    className="rounded"
                                />
                            </div>
                        )}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    );
};

export default Map; 