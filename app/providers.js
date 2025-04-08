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
    
    // Kimlik doğrulama durumunu kontrol et
    store.dispatch(checkAuthState());
    
    // 60 saniyede bir oturum durumunu kontrol et (token yenileme)
    const authCheckInterval = setInterval(() => {
      store.dispatch(checkAuthState());
    }, 60000);
    
    return () => clearInterval(authCheckInterval);
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
} 