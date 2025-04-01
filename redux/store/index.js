import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Diğer reducer'lar buraya eklenebilir
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Supabase nesneleri için
    }),
});

export default store; 