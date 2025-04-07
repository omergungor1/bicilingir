import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    // Diğer reducer'lar buraya eklenebilir
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Supabase nesneleri için
    }),
}); 