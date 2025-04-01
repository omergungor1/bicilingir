'use client'

import { Provider } from 'react-redux'
import store from '../redux/store'
import { useEffect } from 'react'
import { checkAuthState } from '../redux/features/authSlice'

export function Providers({ children }) {
  // Uygulama başladığında oturum durumunu kontrol et
  useEffect(() => {
    store.dispatch(checkAuthState())
  }, [])

  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
} 