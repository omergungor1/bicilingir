"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import Image from 'next/image';
import { Button } from '../components/ui/button';
import { Phone } from 'lucide-react';
import { useMaps } from '../app/contexts/MapsContext';

const containerStyle = {
    width: '100%',
    minHeight: '400px',
    height: '100%',
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

const Map = ({ center, zoom = 14, markers = [], onMarkerClick, selectedLocksmith }) => {
    let isLoaded = false;
    try {
        const mapsContext = useMaps();
        isLoaded = mapsContext.isLoaded;
    } catch (error) {
        console.error('MapsContext error:', error);
        isLoaded = false;
    }

    const [map, setMap] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapMarkers, setMapMarkers] = useState([]);
    const mapRef = useRef(null);

    // Uyarıları bastırma
    useEffect(() => {
        const restoreConsole = suppressConsoleWarnings();
        return () => restoreConsole();
    }, []);

    const onLoad = useCallback(function callback(map) {
        mapRef.current = map;
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback() {
        mapRef.current = null;
        setMap(null);
    }, []);

    // Map marker'ının tıklanma işlemi
    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };

    // Info window'un kapatılma işlemi
    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
        if (onMarkerClick) {
            onMarkerClick(null);
        }
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
            const lat = parseFloat(markerData.position?.lat);
            const lng = parseFloat(markerData.position?.lng);

            // Geçersiz koordinatları atla
            if (isNaN(lat) || isNaN(lng)) return null;

            // Seçili çilingir için farklı ikon
            const isSelected = selectedLocksmith && selectedLocksmith.id === markerData.id;

            const marker = new window.google.maps.Marker({
                position: { lat, lng },
                map: map,
                icon: (markers.length > 1) ? {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: isSelected ? 12 : 8,
                    fillColor: isSelected ? '#FF4444' : '#4169E1',
                    fillOpacity: isSelected ? 1 : 0.8,
                    strokeColor: '#ffffff',
                    strokeWeight: isSelected ? 3 : 2
                } : {
                    url: '/images/map-marker.png',
                    scaledSize: new window.google.maps.Size(50, 50),
                },
                zIndex: isSelected ? 1000 : 1
            });

            marker.addListener('click', () => {
                handleMarkerClick(markerData);
                if (onMarkerClick) {
                    onMarkerClick(markerData);
                }
            });

            return marker;
        }).filter(Boolean); // null değerleri filtrele

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

    // Seçili çilingir değiştiğinde InfoWindow'u aç
    useEffect(() => {
        if (selectedLocksmith) {
            setSelectedMarker(selectedLocksmith);
        } else {
            setSelectedMarker(null);
        }
    }, [selectedLocksmith]);

    useEffect(() => {
        if (markers && markers.length > 0 && isLoaded && window.google) {
            try {
                // Haritayı markerların ortasına konumlandır
                const bounds = new window.google.maps.LatLngBounds();
                markers.forEach(marker => {
                    const lat = parseFloat(marker.position?.lat);
                    const lng = parseFloat(marker.position?.lng);

                    // Geçerli koordinat kontrolü
                    if (!isNaN(lat) && !isNaN(lng)) {
                        bounds.extend({ lat, lng });
                    }
                });

                // En az bir geçerli marker varsa haritayı güncelle
                if (mapRef.current && bounds.getNorthEast().equals(bounds.getSouthWest()) === false) {
                    mapRef.current.fitBounds(bounds);
                }
            } catch (error) {
                console.error('Harita sınırları ayarlanırken hata oluştu:', error);
            }
        }
    }, [markers, isLoaded]);

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
                    <div className="p-3 max-w-sm">
                        <div className="flex items-start gap-3">
                            {selectedMarker.profileImage ? (
                                <img
                                    src={selectedMarker.profileImage}
                                    alt={selectedMarker.title}
                                    className="w-12 h-12 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold text-sm">
                                        {selectedMarker.title.charAt(0)}
                                    </span>
                                </div>
                            )}

                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{selectedMarker.title}</h3>
                                {selectedMarker.description && (
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{selectedMarker.description}</p>
                                )}

                                {selectedMarker.rating && (
                                    <div className="flex items-center gap-1 mb-2">
                                        <span className="text-yellow-400 text-sm">★</span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {selectedMarker.rating}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({selectedMarker.reviewCount})
                                        </span>
                                    </div>
                                )}

                                {selectedMarker.phoneNumber && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm font-medium text-blue-600">
                                            {selectedMarker.phoneNumber}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </InfoWindow>
            )}


        </GoogleMap>
    );
};

export default Map; 