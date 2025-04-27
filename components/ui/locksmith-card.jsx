"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "..//ui/button";
import { ChevronRight, Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"
import { useRouter } from "next/navigation";

export default function LocksmithCard({ locksmith, index }) {
    const [loadingLocksmithIds, setLoadingLocksmithIds] = useState({});

    const styles = {
        accentButton: {
            backgroundColor: '#6495ED',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            fontWeight: 'bold',
        },
        jobCard: {
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#ffffff',
        },
        companyLogo: {
            width: '50px',
            height: '50px',
            backgroundColor: '#4169E1',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 'bold',
        },
        starRating: {
            display: 'flex',
            alignItems: 'center',
        },
        star: {
            color: '#FFD700',
            marginRight: '2px',
        }
    };

    const RatingStars = ({ rating }) => {
        return (
            <div style={styles.starRating}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} style={styles.star}>
                        {i < Math.floor(rating) ? "★" : (i < rating ? "★" : "☆")}
                    </span>
                ))}
                <span className="ml-1 text-gray-700">{rating}</span>
            </div>
        );
    };

    const router = useRouter();
    const handleViewDetails = async (id, slug) => {
        // Sadece ilgili çilingir için yükleniyor durumunu güncelle
        const updatedLoadingStates = { ...loadingLocksmithIds };
        updatedLoadingStates[id] = true;
        setLoadingLocksmithIds(updatedLoadingStates);

        try {
            // API üzerinden doğrudan aktivite kaydı oluştur
            const response = await fetch('/api/public/user/activity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    activitytype: 'locksmith_detail_view',
                    level: 1,
                    data: JSON.stringify({
                        locksmithId: id,
                        searchProvinceId: reduxSelectedValues.provinceId,
                        searchDistrictId: reduxSelectedValues.districtId,
                        searchServiceId: reduxSelectedValues.serviceId
                    }),
                    userId: localStorage.getItem('userId'),
                    sessionId: localStorage.getItem('sessionId'),
                    userAgent: navigator.userAgent || ''
                }),
            });

            if (!response.ok) {
                console.error('Aktivite log hatası:', await response.text());
            } else {
                console.log('Çilingir detay görüntüleme aktivitesi kaydedildi.');
            }
        } catch (error) {
            console.error('Aktivite log hatası:', error);
        }

        // Detay sayfasına yönlendir, scroll davranışını engellemek için scroll=false
        router.push(`/${slug}?fromDetail=true`, undefined, { scroll: false });
    };


    return (
        <div key={locksmith.id} className={`border ${index === 0 ? 'border-blue-400 border-2 shadow-lg relative transform transition hover:scale-[1.02]' : 'border-gray-200 hover:shadow-md transition'} rounded-lg overflow-hidden ${index === 0 ? 'bg-blue-50' : ''}`}>
            {index === 0 && (
                <div className="bg-blue-600 text-white py-1 px-4 absolute top-0 left-0 rounded-br-lg font-medium text-sm shadow-md z-10">
                    En İyi Eşleşme
                </div>
            )}
            <div className="flex flex-col md:flex-row">
                <div className={`p-6 flex-1 ${index === 0 ? 'pt-10' : ''}`}>
                    <div className="flex items-start mb-4">
                        <div style={styles.companyLogo} className={`mr-4 flex-shrink-0 ${index === 0 ? 'bg-blue-600 text-white shadow-md' : ''}`}>
                            <span>{locksmith.name.substring(0, 2)}</span>
                        </div>
                        <div>
                            <div className="flex flex-col md:flex-row md:items-center mt-1 gap-2">
                                <h3 className={`text-xl font-bold ${index === 0 ? 'text-blue-800' : 'text-gray-800'}`}>{locksmith.name}</h3>
                                {index === 0 && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center w-fit">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Onaylı Çilingir
                                    </span>
                                )}
                                <div className="w-1 h-1 bg-gray-400 rounded-full hidden md:block" />
                                <p className="text-gray-600">{locksmith.city} - {locksmith.district}</p>
                            </div>
                            <div className="flex flex-col md:flex-row md:items-center mt-1">
                                <RatingStars rating={locksmith?.rating?.toFixed(1)} />
                                <span className="md:ml-2 text-sm text-gray-500">({locksmith?.reviewCount} değerlendirme)</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-700 mb-4">{locksmith?.description}</p>

                    <div className="flex flex-wrap gap-2">
                        {locksmith?.serviceNames?.map((serviceName, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{serviceName}</span>
                        ))}
                        <Popover>
                            <PopoverTrigger asChild>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center gap-1"><Info className="w-4 h-4" />{locksmith?.price?.min}₺ - {locksmith?.price?.max}₺ (Tahmini Fiyat)</span>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-3 text-sm text-gray-700 max-h-[300px] overflow-y-auto">
                                <div>
                                    <p className="text-gray-600">Bu fiyat, çilingir hizmet için fiyatıdır. Fiyatlar; yol ücreti, değişmesi gereken parçalar, kilitlerin markası gibi faktörlere göre değişebilir. Net ücreti çilingir ile görüşerek öğrenebilirsiniz.</p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="p-6 flex flex-col justify-center md:w-64">
                    <div className="space-y-3">
                        <Button
                            onClick={() => handleCallLocksmith(locksmith, index)}
                            className={`w-full ${index === 0 ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold animate-pulse shadow-md' : 'bg-[#4169E1]'}`}
                        >
                            {index === 0 ? 'Hemen Ara' : 'Ara'}
                            {index === 0 && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            )}
                        </Button>
                        {/* Whatsapp Butonu */}
                        <Button
                            variant="outline"
                            className={`w-full text-white! flex items-center justify-center gap-2 ${index === 0 ? 'bg-green-600 hover:bg-green-700 font-bold shadow-md' : 'bg-green-500 hover:bg-green-600'}`}
                            onClick={() => handleWhatsappMessage(locksmith, index)}
                        >
                            WhatsApp
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            disabled={loadingLocksmithIds[locksmith.id]}
                            onClick={() => handleViewDetails(locksmith.id, locksmith.slug)}
                        >
                            {loadingLocksmithIds[locksmith.id] ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    Çilingir Profili
                                    <ChevronRight className="w-4 h-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}