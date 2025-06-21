"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createOrUpdateUser } from '../lib/client-utils';

const LOCATION_PERMISSION_KEY = 'location_permission_status';
const LOCATION_PERMISSION_DATE = 'location_permission_date';

export function useLocationPermission() {
    const [showModal, setShowModal] = useState(false);
    const supabase = createClientComponentClient();

    useEffect(() => {
        checkLocationPermissionStatus();
    }, []);

    const checkLocationPermissionStatus = () => {
        const status = localStorage.getItem(LOCATION_PERMISSION_KEY);
        const date = localStorage.getItem(LOCATION_PERMISSION_DATE);

        if (!status || !date) {
            setShowModal(true);
            return;
        }

        // Bir günden eski ise tekrar sor
        const savedDate = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now - savedDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= 1) {
            localStorage.removeItem(LOCATION_PERMISSION_KEY);
            localStorage.removeItem(LOCATION_PERMISSION_DATE);
            setShowModal(true);
        }
    };

    const saveLocationPermissionStatus = (status) => {
        localStorage.setItem(LOCATION_PERMISSION_KEY, status);
        localStorage.setItem(LOCATION_PERMISSION_DATE, new Date().toISOString());
    };

    const requestLocation = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude, accuracy } = position.coords;

            // Kullanıcı bilgilerini güncelle
            const response = await fetch('/api/public/user/get-ip');
            const { ip } = await response.json();

            await createOrUpdateUser(
                supabase,
                null, // userId
                null, // sessionId
                ip,
                navigator.userAgent,
                null, // fingerprintId
                { latitude, longitude, accuracy }
            );

            saveLocationPermissionStatus('granted');
            return { latitude, longitude, accuracy };
        } catch (error) {
            console.error('Konum alınamadı:', error);
            saveLocationPermissionStatus('denied');
            throw error;
        }
    };

    const handlePermissionResponse = async (accepted) => {
        setShowModal(false);

        if (accepted) {
            try {
                await requestLocation();
            } catch (error) {
                console.error('Konum izni alınamadı:', error);
            }
        } else {
            saveLocationPermissionStatus('denied');
        }
    };

    return {
        showModal,
        handlePermissionResponse,
        requestLocation
    };
} 