import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '../redux/store';
import { restoreSearchState } from '../redux/features/searchSlice';

// İç komponent - client tarafında çalışacak
function AppContent({ Component, pageProps }) {
    const dispatch = useDispatch();

    useEffect(() => {
        // Client tarafında olduğumuzdan emin olalım
        if (typeof window !== 'undefined') {
            dispatch(restoreSearchState());
        }
    }, [dispatch]);

    return <Component {...pageProps} />;
}

// Ana App komponenti
function MyApp({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContent Component={Component} pageProps={pageProps} />
        </Provider>
    );
}

export default MyApp; 