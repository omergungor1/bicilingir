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

      console.log('user***',user);

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
      
      // Eğer kullanıcı bir çilingir ise
      if (roleData.role === 'cilingir') {
        try {
          // Çilingir ID'sini al
          const { data: locksmithData, error: locksmithError } = await supabase
            .from('locksmiths')
            .select('id')
            .eq('authid', user.id)
            .single();

          console.log('user.id***',user.id);
          console.log('locksmithData***',locksmithData);
          
          if (locksmithError) {
            console.error('Çilingir bilgisi alınamadı:', locksmithError);
          } else if (locksmithData && locksmithData.id) {
            console.log('Çilingir bilgisi alındı, users tablosu güncelleniyor...');
            
            // User-Agent ve IP bilgilerini al
            const userAgent = navigator.userAgent;
            const userIp = await fetch('/api/public/user/get-ip')
              .then(res => res.json())
              .then(data => data.ip)
              .catch(() => '0.0.0.0');
            
            // Mevcut kullanıcı kaydını ara
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('id')
              .eq('userip', userIp)
              .eq('useragent', userAgent)
              .order('createdat', { ascending: false })
              .limit(1);

            const userId = userData && userData.length > 0 ? userData[0].id : null;
            
            if (userId) {
              // Mevcut kaydı güncelle
              const { error: updateError } = await supabase
                .from('users')
                .update({
                  islocksmith: true,
                  locksmithid: locksmithData.id,
                  updatedat: new Date().toISOString()
                })
                .eq('id', userId);
              
              if (updateError) {
                console.error('Çilingir kullanıcı güncellenirken hata:', updateError);
              } else {
                console.log('Çilingir kullanıcı başarıyla güncellendi');
              }
            } else {
              // Yeni kullanıcı kaydı oluştur
              const { v4: uuidv4 } = await import('uuid');
              const { error: newUserError } = await supabase
                .from('users')
                .insert({
                  id: uuidv4(),
                  userip: userIp,
                  useragent: userAgent,
                  islocksmith: true,
                  locksmithid: locksmithData.id,
                  createdat: new Date().toISOString(),
                  updatedat: new Date().toISOString()
                });
              
              if (newUserError) {
                console.error('Çilingir kullanıcı oluşturulurken hata:', newUserError);
              } else {
                console.log('Çilingir kullanıcı başarıyla oluşturuldu');
              }
            }
          }
        } catch (userUpdateError) {
          console.error('Çilingir kullanıcı güncelleme hatası:', userUpdateError);
        }
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
  async (options = {}, { rejectWithValue }) => {
    try {
      const { silent = false } = options;
      console.log('Auth durumu kontrol ediliyor, sessiz mod:', silent);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return null;

      // Eğer sessiz modda çalışıyorsak ve oturum varsa ek sorguları yapmaya gerek yok
      if (silent && session) {
        console.log('Sessiz modda oturum kontrolü: Oturum aktif');
        return { sessionActive: true };
      }

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
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.isAdmin = action.payload.role === 'admin';
        state.isCilingir = action.payload.role === 'cilingir';
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Bilinmeyen bir hata oluştu";
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.role = null;
        state.isAdmin = false;
        state.isCilingir = false;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Check auth state cases
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.loading = false;
        
        // Sessiz mod kontrolü - eğer sadece sessionActive özelliği varsa
        // state'i güncelleme, bu sayede gereksiz render önlenmiş olur
        if (action.payload && action.payload.sessionActive === true) {
          // Sadece oturum kontrolü yapıldığında state'i değiştirmiyoruz
          return;
        }
        
        if (!action.payload) {
          // Oturum yoksa tüm state'i sıfırla
          state.user = null;
          state.role = null;
          state.isAdmin = false;
          state.isCilingir = false;
          state.isAuthenticated = false;
        } else {
          // Oturum varsa bilgileri güncelle
          state.user = action.payload.user;
          state.role = action.payload.role;
          state.isAdmin = action.payload.role === 'admin';
          state.isCilingir = action.payload.role === 'cilingir';
          state.isAuthenticated = true;
        }
        state.error = null;
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer; 