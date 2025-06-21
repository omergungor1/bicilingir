"use client";

import { LocationPermissionModal } from '../components/ui/location-permission-modal';
import { useLocationPermission } from '../hooks/useLocationPermission';

export function LocationProvider({ children }) {
    const { showModal, handlePermissionResponse } = useLocationPermission();

    return (
        <>
            {children}
            <LocationPermissionModal
                isOpen={showModal}
                onClose={() => handlePermissionResponse(false)}
                onAccept={() => handlePermissionResponse(true)}
            />
        </>
    );
} 