'use client';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Users, Star } from 'lucide-react';

// Dynamic import to prevent SSR issues with Google Maps
const Map = dynamic(() => import('../../components/Map'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Harita yükleniyor...</p>
            </div>
        </div>
    ),
});

// Türkiye'nin merkez koordinatları
const TURKEY_CENTER = {
    lat: 40.2756196,
    lng: 29.0513208
};

// Client-side çilingir verilerini çek
async function fetchLocksmiths() {
    try {
        const response = await fetch('/api/maps/locksmiths');

        if (!response.ok) {
            throw new Error('Çilingir verileri alınamadı');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Çilingir verileri yüklenirken hata:', error);
        return { locksmiths: [], count: 0 };
    }
}

// Loading component
function MapLoading() {
    return (
        <div className="w-full h-[600px] bg-gray-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Harita yükleniyor...</p>
            </div>
        </div>
    );
}

// İstatistik kartı
function StatsCard({ icon: Icon, title, value, description }) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-blue-600" />
                </div>
            </div>
        </div>
    );
}

export default function MapsPage() {
    const [locksmiths, setLocksmiths] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocksmith, setSelectedLocksmith] = useState(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await fetchLocksmiths();
                setLocksmiths(data.locksmiths);
                setCount(data.count);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // ESC tuşu ile seçimi iptal et
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                setSelectedLocksmith(null);
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, []);



    // Çilingir seçme fonksiyonu
    const handleLocksmithSelect = (locksmith) => {
        setSelectedLocksmith(locksmith);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Çilingir verileri yükleniyor...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Hata: {error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Yeniden Dene
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Türkiye Çilingir Haritası
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Türkiye genelindeki aktif çilingirlerin konumlarını keşfedin.
                            Size en yakın güvenilir çilingiri bulun.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Ana İçerik - Sol Liste, Sağ Harita */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="flex h-[700px]">
                        {/* Sol Panel - Çilingir Listesi */}
                        <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Aktif Çilingirler ({count})
                                </h3>
                                <div className="space-y-4">
                                    {locksmiths.map((locksmith) => (
                                        <div
                                            key={locksmith.id}
                                            className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${selectedLocksmith?.id === locksmith.id
                                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                                : 'border-gray-200'
                                                }`}
                                            onClick={() => handleLocksmithSelect(locksmith)}
                                        >
                                            <div className="flex items-start gap-3">
                                                {locksmith.profileImage ? (
                                                    <img
                                                        src={locksmith.profileImage}
                                                        alt={locksmith.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <span className="text-blue-600 font-semibold text-sm">
                                                            {locksmith.title.charAt(0)}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate">
                                                        {locksmith.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {locksmith.description}
                                                    </p>

                                                    <div className="flex items-center gap-4 mt-2">
                                                        {locksmith.rating && (
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-yellow-400">★</span>
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {locksmith.rating}
                                                                </span>
                                                                <span className="text-sm text-gray-500">
                                                                    ({locksmith.reviewCount})
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-2">
                                                        <span className="text-sm font-medium text-blue-600">
                                                            {locksmith.phoneNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sağ Panel - Harita */}
                        <div className="flex-1">
                            <div className="h-full">
                                <Suspense fallback={<MapLoading />}>
                                    <Map
                                        center={selectedLocksmith ? selectedLocksmith.position : TURKEY_CENTER}
                                        zoom={selectedLocksmith ? 12 : 9}
                                        markers={locksmiths}
                                        selectedLocksmith={selectedLocksmith}
                                        onMarkerClick={setSelectedLocksmith}
                                    />
                                </Suspense>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}


