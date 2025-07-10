"use client";

//Şuan kullanılmıyor..! Daha sonra aktif edilecek..!
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
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setSupabase(getSupabaseClient());

        // Tarayıcı izni ve localStorage kontrolü
        const checkPermissions = async () => {
            const locationPreference = localStorage.getItem('locationPermission');

            if (!locationPreference && fingerprintId) {
                // Mevcut konum izni durumunu kontrol et
                try {
                    const permission = await navigator.permissions.query({ name: 'geolocation' });

                    if (permission.state === 'granted') {
                        // Zaten izin verilmiş, konumu al
                        getCurrentPosition();
                    } else if (permission.state === 'prompt') {
                        // İzin henüz sorulmamış, modalı göster
                        setIsOpen(true);
                    } else if (permission.state === 'denied') {
                        // İzin reddedilmiş, localStorage'a kaydet
                        localStorage.setItem('locationPermission', 'denied');
                    }
                } catch (error) {
                    // Permissions API desteklenmiyorsa modalı göster
                    setIsOpen(true);
                }
            }
        };

        checkPermissions();
    }, [fingerprintId]);

    const getCurrentPosition = () => {
        if (!supabase) return;
        setIsLoading(true);
        setError(null);

        // Konum alma seçenekleri
        const geoOptions = {
            enableHighAccuracy: false, // Yüksek hassasiyet kapalı, daha hızlı sonuç
            timeout: 30000,           // 30 saniye timeout
            maximumAge: 300000        // 5 dakikalık cache kullan
        };

        if ('geolocation' in navigator) {
            // Önce düşük hassasiyetle deneyelim
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const locationData = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        };

                        const result = await updateUserLocation(supabase, fingerprintId, locationData);

                        if (result.success) {
                            console.log('Konum başarıyla güncellendi');
                            localStorage.setItem('locationPermission', 'granted');
                            setIsOpen(false);
                        } else {
                            throw new Error('Konum güncellenirken bir hata oluştu');
                        }
                    } catch (error) {
                        console.error('Konum güncelleme hatası:', error);
                        setError('Konum bilginiz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
                    } finally {
                        setIsLoading(false);
                    }
                },
                async (error) => {
                    console.error('Düşük hassasiyetli konum alınamadı:', error);

                    // Eğer timeout hatası aldıysak, yüksek hassasiyetle tekrar deneyelim
                    if (error.code === error.TIMEOUT) {
                        try {
                            // Yüksek hassasiyetli konum alma seçenekleri
                            const highAccuracyOptions = {
                                ...geoOptions,
                                enableHighAccuracy: true,
                                timeout: 60000 // 1 dakika
                            };

                            navigator.geolocation.getCurrentPosition(
                                async (position) => {
                                    try {
                                        const locationData = {
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                            accuracy: position.coords.accuracy
                                        };

                                        const result = await updateUserLocation(supabase, fingerprintId, locationData);

                                        if (result.success) {
                                            console.log('Konum başarıyla güncellendi (yüksek hassasiyet)');
                                            localStorage.setItem('locationPermission', 'granted');
                                            setIsOpen(false);
                                        } else {
                                            throw new Error('Konum güncellenirken bir hata oluştu');
                                        }
                                    } catch (error) {
                                        setError('Konum bilginiz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.');
                                    } finally {
                                        setIsLoading(false);
                                    }
                                },
                                (highAccError) => {
                                    console.error('Yüksek hassasiyetli konum alınamadı:', highAccError);
                                    setIsLoading(false);

                                    switch (highAccError.code) {
                                        case highAccError.PERMISSION_DENIED:
                                            localStorage.setItem('locationPermission', 'denied');
                                            setError('Konum izni reddedildi. Konumu kullanabilmek için tarayıcı ayarlarından konum iznini etkinleştirmeniz gerekiyor.');
                                            break;
                                        case highAccError.POSITION_UNAVAILABLE:
                                            setError('Konum servislerine erişilemiyor. Lütfen konum servislerinizin açık olduğundan emin olun ve tekrar deneyin.');
                                            break;
                                        case highAccError.TIMEOUT:
                                            setError('Konum alınamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
                                            break;
                                        default:
                                            setError('Konum alınırken bir hata oluştu. Lütfen tekrar deneyin.');
                                    }
                                },
                                highAccuracyOptions
                            );
                        } catch (retryError) {
                            setIsLoading(false);
                            setError('Konum alınamadı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.');
                        }
                    } else {
                        setIsLoading(false);
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                localStorage.setItem('locationPermission', 'denied');
                                setError('Konum izni reddedildi. Konumu kullanabilmek için tarayıcı ayarlarından konum iznini etkinleştirmeniz gerekiyor.');
                                break;
                            case error.POSITION_UNAVAILABLE:
                                setError('Konum servislerine erişilemiyor. Lütfen konum servislerinizin açık olduğundan emin olun ve tekrar deneyin.');
                                break;
                            default:
                                setError('Konum alınırken bir hata oluştu. Lütfen tekrar deneyin.');
                        }
                    }
                },
                geoOptions
            );
        } else {
            setError('Tarayıcınız konum özelliğini desteklemiyor.');
            setIsLoading(false);
        }
    };

    const handleAccept = () => {
        getCurrentPosition();
    };

    const handleReject = () => {
        localStorage.setItem('locationPermission', 'denied');
        setIsOpen(false);
    };

    const handleRetry = () => {
        setError(null);
        getCurrentPosition();
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
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                            {error}
                            {error.includes('reddedildi') && (
                                <div className="mt-2">
                                    <Button size="sm" onClick={handleRetry}>
                                        Tekrar Dene
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="mt-6 flex justify-end space-x-4">
                        <Button variant="outline" onClick={handleReject} disabled={isLoading}>
                            Şimdi Değil
                        </Button>
                        <Button onClick={handleAccept} disabled={isLoading}>
                            {isLoading ? 'Konum Alınıyor...' : 'Konumumu Paylaş'}
                        </Button>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none"
                            aria-label="Kapat"
                            disabled={isLoading}
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