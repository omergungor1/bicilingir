'use client'

import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '../redux/store'
import { initUserSession } from '../redux/features/userSlice'

export default function Providers({ children }) {
  useEffect(() => {
    // Kullanıcı oturumunu başlat
    store.dispatch(initUserSession());
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
} 