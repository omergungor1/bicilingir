import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';
import searchReducer from '../features/searchSlice';

// Store yapılandırması
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    search: searchReducer,
    // Diğer reducer'lar buraya eklenebilir
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Supabase nesneleri için
    }),
  // DevTools sadece development ortamında aktif olsun
  devTools: process.env.NODE_ENV === 'development',
});

export { store }; 