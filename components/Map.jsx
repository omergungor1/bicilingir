"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
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
    styles: [
        {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ weight: '2.00' }]
        },
        {
            featureType: 'all',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#9c9c9c' }]
        },
        {
            featureType: 'all',
            elementType: 'labels.text',
            stylers: [{ visibility: 'on' }]
        },
        {
            featureType: 'administrative',
            elementType: 'all',
            stylers: [{ visibility: 'on' }]
        },
        {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [{ color: '#f2f2f2' }]
        },
        {
            featureType: 'poi',
            elementType: 'all',
            stylers: [{ visibility: 'on' }]
        },
        {
            featureType: 'road',
            elementType: 'all',
            stylers: [{ saturation: -100 }, { lightness: 45 }]
        },
        {
            featureType: 'road.highway',
            elementType: 'all',
            stylers: [{ visibility: 'simplified' }]
        },
        {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#6e99e6' }, { visibility: 'on' }]
        }
    ]
};

const Map = ({ center, zoom = 14, markers = [] }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    });

    const [map, setMap] = useState(null);
    const [selectedMarker, setSelectedMarker] = useState(null);

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
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.position}
                    onClick={() => handleMarkerClick(marker)}
                    icon={{
                        url: '/images/map-marker.png', // /images/map-marker.svg
                        scaledSize: new window.google.maps.Size(40, 40),
                    }}
                />
            ))}

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