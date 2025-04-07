import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userReducer from '../features/userSlice';
import searchReducer from '../features/searchSlice';

export const store = configureStore({
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
}); 