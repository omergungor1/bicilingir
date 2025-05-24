'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { initUserSession } from '../redux/features/userSlice'
import { checkAuthState } from '../redux/features/authSlice'

export default function Providers({ children }) {
  useEffect(() => {
    // Kullanıcı oturumunu başlat
    store.dispatch(initUserSession());

    // Kimlik doğrulama durumunu kontrol et - sadece ilk yüklemede
    store.dispatch(checkAuthState());

    // Oturum kontrolü için interval - 30 dakikada bir sessiz kontrol yap
    // Sadece session durumunu kontrol eder, sayfayı yenilemez
    const authCheckInterval = setInterval(() => {
      store.dispatch(checkAuthState({ silent: true }));
    }, 1800000); // 30 dakika (1800000 ms)

    return () => clearInterval(authCheckInterval);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
} 