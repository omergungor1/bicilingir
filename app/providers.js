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
    
    // Oturum kontrolü için interval - 5 dakikada bir yap
    // Böylece her dakikada bir yenileme sorunu ortadan kalkacak
    const authCheckInterval = setInterval(() => {
      // Sadece token kontrolü yap, tam sayfa yenileme olmadan
      store.dispatch(checkAuthState({ silent: true }));
    }, 300000); // 5 dakikaya çıkarıldı (300000 ms)
    
    return () => clearInterval(authCheckInterval);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
} 