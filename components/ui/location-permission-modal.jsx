"use client";

import { useEffect, useState } from 'react';
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from './button';
import { updateUserLocation } from '../../app/api/utils';
import { getSupabaseClient } from '../../lib/supabase';
import { useFingerprint } from '../../hooks/useFingerprint';

export function LocationPermissionModal() {
    const { visitorId: fingerprintId } = useFingerprint();
    const [isOpen, setIsOpen] = useState(false);
    const [supabase, setSupabase] = useState(null);

    useEffect(() => {
        // Supabase client'ı sadece client-side'da oluştur
        setSupabase(getSupabaseClient());

        // localStorage'dan konum tercihini kontrol et
        const locationPreference = localStorage.getItem('locationPermission');
        if (!locationPreference && fingerprintId) {
            setIsOpen(true);
        }
    }, [fingerprintId]);

    const getCurrentPosition = () => {
        console.log('getCurrentPosition 1');
        if (!supabase) return;
        console.log('getCurrentPosition 2');
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    console.log('getCurrentPosition 3');
                    console.log(locationData, 'locationData');
                    // Konum bilgisini güncelle
                    const result = await updateUserLocation(supabase, fingerprintId, locationData);
                    console.log('getCurrentPosition 4');
                    if (result.success) {
                        console.log('Konum başarıyla güncellendi');
                    } else {
                        console.error('Konum güncellenirken hata oluştu:', result.error);
                    }
                },
                (error) => {
                    console.error('Konum alınamadı:', error);
                }
            );
        }
    };

    const handleAccept = () => {
        localStorage.setItem('locationPermission', 'granted');
        getCurrentPosition();
        setIsOpen(false);
    };

    const handleReject = () => {
        localStorage.setItem('locationPermission', 'denied');
        setIsOpen(false);
    };

    if (!fingerprintId) {
        return null;
    }

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <Dialog.Title className="m-0 text-[17px] font-medium">
                        Size En Yakın Çilingiri Bulalım
                    </Dialog.Title>
                    <Dialog.Description className="mb-2 mt-3 text-[15px] leading-normal text-gray-600">
                        Size en yakın çilingir için konum bilginize ihtiyacımız var.
                    </Dialog.Description>
                    <div className="text-[15px] leading-normal text-gray-600">
                        Bu sayede:
                        <ul className="mt-2 list-disc pl-4">
                            <li>Size en yakın çilingiri bulabiliriz</li>
                            <li>En yakın çilingir telefonunu anında gösterebiliriz</li>
                        </ul>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <Button variant="outline" onClick={handleReject}>
                            Şimdi Değil
                        </Button>
                        <Button onClick={handleAccept}>
                            Konumumu Paylaş
                        </Button>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                            aria-label="Kapat"
                        >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
} 