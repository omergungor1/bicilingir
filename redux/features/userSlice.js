import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Kullanıcı oturum başlatma
export const initUserSession = createAsyncThunk(
  'user/initUserSession',
  async (_, { rejectWithValue }) => {
    try {
      // LocalStorage'dan sessionId'yi kontrol et
      let sessionId = localStorage.getItem('sessionId');
      let userId = localStorage.getItem('userId');

      // Eğer sessionId yoksa yeni bir tane oluştur
      if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('sessionId', sessionId);
      }

      // FingerprintJS'i yükle ve visitorId al
      let fingerprintId = null;
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        fingerprintId = result.visitorId;
      } catch (fpError) {
        console.error('[UserSlice] Fingerprint alınamadı:', fpError);
      }

      // Kullanıcı IP adresini al
      let userIp = '0.0.0.0'; // Varsayılan değer
      try {
        const ipResponse = await fetch('/api/public/user/get-ip');
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          userIp = ipData.ip;
          // console.log(`[UserSlice] Kullanıcı IP: ${userIp}`);
        } else {
          console.warn('[UserSlice] IP adresi alınamadı, varsayılan değer kullanılıyor');
        }
      } catch (ipError) {
        console.error('[UserSlice] IP adresi alınırken hata:', ipError);
      }

      // Kullanıcı bilgilerini kaydet/güncelle
      try {
        const trackResponse = await fetch('/api/public/user/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId,
            userIp,
            userAgent: navigator.userAgent,
            fingerprintId
          }),
        });

        if (trackResponse.ok) {
          const trackData = await trackResponse.json();

          // Eğer yeni bir kullanıcı ID'si aldıysak kaydet
          if (trackData.userId) {
            localStorage.setItem('userId', trackData.userId);
            userId = trackData.userId;
            // console.log(`[UserSlice] Kullanıcı ID güncellendi: ${userId}`);
          }

          // Eğer kullanıcı şüpheli olarak işaretlendiyse
          if (trackData.isSuspicious) {
            console.warn('[UserSlice] Kullanıcı şüpheli olarak işaretlendi');
          }

          // Eğer yeni bir kullanıcıysa, giriş aktivitesi kaydet
          if (trackData.isNewUser) {
            // console.log('[UserSlice] Yeni kullanıcı, giriş aktivitesi kaydediliyor');
            await logActivity(userId, sessionId, 'website_visit');
          }
        } else {
          console.error('[UserSlice] Kullanıcı izlenemedi:', await trackResponse.text());
        }
      } catch (trackError) {
        console.error('[UserSlice] Kullanıcı izleme hatası:', trackError);
      }

      return {
        sessionId,
        userId,
        fingerprintId,
        isInitialized: true
      };
    } catch (error) {
      console.error('[UserSlice] Kullanıcı oturumu başlatılamadı:', error);
      return rejectWithValue(error.message);
    }
  }
);

// Yardımcı fonksiyon - aktivite kaydetme
async function logActivity(userId, sessionId, action, details = null, entityId = null, entityType = null, additionalData = {}, level = 1) {
  try {
    if (!userId || !sessionId) {
      console.error('[UserSlice] Aktivite kaydı için kullanıcı ID veya oturum ID eksik');
      return null;
    }

    // Action'a göre level kontrolü (sunucu tarafında da yapılıyor ama burada da yapalım)
    let finalLevel = level;


    if (action === 'call_request' || action === 'locksmith_detail_view') {
      finalLevel = 1;
      // console.log(`[UserSlice] ${action} için level zorla 1 olarak ayarlandı`);
    }

    const response = await fetch('/api/public/user/activity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        sessionId,
        activitytype: action,
        details,
        entityId,
        entityType,
        level: finalLevel, // Güncellenen level değerini gönder
        ...additionalData
      }),
    });

    if (!response.ok) {
      console.error('[UserSlice] Aktivite kaydedilemedi:', await response.text());
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[UserSlice] Aktivite kaydı hatası:', error);
    return null;
  }
}

// Kullanıcı aktivitesini kaydetme
export const logUserActivity = createAsyncThunk(
  'user/logUserActivity',
  async ({ action, details, entityId, entityType, additionalData = {}, level = 1 }, { getState, rejectWithValue }) => {
    try {
      const { user, search } = getState();

      // Eğer kullanıcı oturumu başlatılmadıysa hata ver
      if (!user.isInitialized || !user.userId || !user.sessionId) {
        console.warn('[UserSlice] Aktivite kaydı atlanıyor: Kullanıcı oturumu başlatılmamış');
        return rejectWithValue('Kullanıcı oturumu başlatılmamış');
      }

      // console.log(`[UserSlice] Aktivite kaydediliyor: ${action}`);

      // Redux store'dan arama değerlerini ekle
      const enhancedAdditionalData = { ...additionalData };

      // Eğer additionalData içinde zaten varsa, onları kullan
      // Yoksa ve Redux store'da varsa, store'dan al
      if (!enhancedAdditionalData.searchProvinceId && search.selectedValues.provinceId) {
        enhancedAdditionalData.searchProvinceId = search.selectedValues.provinceId;
      }

      if (!enhancedAdditionalData.searchDistrictId && search.selectedValues.districtId) {
        enhancedAdditionalData.searchDistrictId = search.selectedValues.districtId;
      }

      if (!enhancedAdditionalData.searchServiceId && search.selectedValues.serviceId) {
        enhancedAdditionalData.searchServiceId = search.selectedValues.serviceId;
      }

      // console.log('[UserSlice] Aktivite kaydı ek verileri:', enhancedAdditionalData);

      const result = await logActivity(
        user.userId,
        user.sessionId,
        action,
        details,
        entityId,
        entityType,
        enhancedAdditionalData,
        level
      );

      if (!result) {
        return rejectWithValue('Aktivite kaydedilemedi');
      }

      return { action, activityId: result.activityId };
    } catch (error) {
      console.error('[UserSlice] Kullanıcı aktivitesi kaydedilemedi:', error);
      return rejectWithValue(error.message);
    }
  }
);

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: null,
    sessionId: null,
    fingerprintId: null,
    isInitialized: false,
    isLoading: false,
    error: null,
    lastActivity: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // initUserSession işleyicileri
      .addCase(initUserSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initUserSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userId = action.payload.userId;
        state.sessionId = action.payload.sessionId;
        state.fingerprintId = action.payload.fingerprintId;
        state.isInitialized = true;
      })
      .addCase(initUserSession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
        state.isInitialized = true;
      })

      // logUserActivity işleyicileri
      .addCase(logUserActivity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logUserActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastActivity = action.payload.action;
      })
      .addCase(logUserActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default userSlice.reducer; 