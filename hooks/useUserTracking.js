import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initUserSession } from '../redux/features/userSlice';
import { useFingerprint } from './useFingerprint';

export function useUserTracking() {
    const dispatch = useDispatch();
    const { visitorId, isLoading } = useFingerprint();

    useEffect(() => {
        // FingerprintJS yüklendiğinde ve visitorId hazır olduğunda
        if (!isLoading && visitorId) {
            dispatch(initUserSession());
        }
    }, [dispatch, isLoading, visitorId]);

    return { isLoading };
} 