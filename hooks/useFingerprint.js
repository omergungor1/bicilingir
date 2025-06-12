import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useFingerprint() {
    const [visitorId, setVisitorId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function initFingerprint() {
            try {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                setVisitorId(result.visitorId);
                setIsLoading(false);
            } catch (err) {
                setError(err);
                setIsLoading(false);
            }
        }

        initFingerprint();
    }, []);

    return { visitorId, isLoading, error };
} 