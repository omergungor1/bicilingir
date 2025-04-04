import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';

// Initial state
const initialState = {
  user: null,
  role: null,
  isAdmin: false,
  isCilingir: false,
  isAuthenticated: false,
  loading: false,
  error: null
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log('Login başlatılıyor:', email);
      
      // Supabase login işlemi
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Eğer giriş hatası varsa
      if (error) {
        console.log('Login hatası:', error);
        
        // Invalid login credentials hatasını kullanıcı dostu bir mesaja çeviriyoruz
        if (error.message && error.message.includes("Invalid login credentials")) {
          return rejectWithValue("E-posta veya şifre hatalı");
        }
        
        // Diğer supabase hatalarını işleme
        let errorMessage = "Giriş yapılırken bir hata oluştu";
        
        if (typeof error === 'string') {
          errorMessage = error;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.error_description) {
          errorMessage = error.error_description;
        }
        
        return rejectWithValue(errorMessage);
      }

      console.log('Login başarılı:', data);
      const user = data.user;

      // Kullanıcı rolünü al
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.log('Rol sorgusu hatası:', roleError);
        return rejectWithValue("Kullanıcı rolü alınamadı. Lütfen daha sonra tekrar deneyin.");
      }

      // Rol bilgisini user_metadata'ya ekle (API isteklerinde kullanmak için)
      await supabase.auth.updateUser({
        data: { role: roleData.role }
      });

      console.log('Kullanıcı rolü:', roleData.role);
      return {
        user,
        role: roleData.role
      };
    } catch (error) {
      console.log('Login thunk hatası:', error);
      
      // Beklenmeyen hatalar için
      let errorMessage = "Giriş yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      // Önce metadata'daki rol bilgisini kontrol et
      if (user.user_metadata?.role) {
        return {
          user,
          role: user.user_metadata.role
        };
      }

      // Metadata'da rol yoksa veritabanından al
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (roleError) {
        console.log('Rol sorgusu hatası:', roleError);
        return rejectWithValue("Kullanıcı rolü alınamadı.");
      }

      // Rol bilgisini user_metadata'ya ekle (API isteklerinde kullanmak için)
      await supabase.auth.updateUser({
        data: { role: roleData.role }
      });

      return {
        user,
        role: roleData.role
      };
    } catch (error) {
      console.log('Auth state kontrol hatası:', error);
      
      // Hata objesini string'e dönüştürüyoruz
      let errorMessage = "Oturum kontrolü yapılırken bir hata oluştu";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('loginUser.fulfilled çalışıyor, payload:', action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.isAdmin = action.payload.role === 'admin';
        state.isCilingir = action.payload.role === 'cilingir';
        state.isAuthenticated = true;
        console.log('State güncellendi:', { 
          role: state.role, 
          isAuthenticated: state.isAuthenticated 
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        return initialState;
      })
      
      // Check Auth State
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        if (action.payload) {
          state.loading = false;
          state.user = action.payload.user;
          state.role = action.payload.role;
          state.isAdmin = action.payload.role === 'admin';
          state.isCilingir = action.payload.role === 'cilingir';
          state.isAuthenticated = true;
        } else {
          Object.assign(state, initialState);
        }
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        Object.assign(state, {
          ...initialState,
          error: action.payload
        });
      });
  }
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer; 