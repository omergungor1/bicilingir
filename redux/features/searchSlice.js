import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logUserActivity } from './userSlice';

// Çilingir arama için async thunk
export const searchLocksmiths = createAsyncThunk(
  'search/searchLocksmiths',
  async (searchParams, { rejectWithValue, dispatch, getState }) => {
    try {
      const { provinceId, districtId, serviceId, shouldLog = true } = searchParams;
      
      if (!provinceId || !districtId || !serviceId) {
        return rejectWithValue('Lütfen il, ilçe ve servis seçiniz');
      }
      
      const urlParams = new URLSearchParams({
        provinceId,
        districtId,
        serviceId,
      });
      
      const response = await fetch(`/api/public/search?${urlParams.toString()}`);
      const data = await response.json();
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Arama sırasında bir hata oluştu');
      }
      
      // Çilingir listesi görüntüleme için her bir çilingir için ayrı log kaydı oluştur
      const locksmiths = data.locksmiths || [];
      
      // Sadece aktif aramalar için log oluştur (shouldLog true ise)
      if (shouldLog) {
        // Kullanıcı oturumu başlatılmış mı kontrol et
        const { user } = getState();
        if (user.isInitialized && user.userId && user.sessionId) {
          try {
            // Her bir çilingir için ayrı ayrı görüntüleme logu oluştur
            locksmiths.forEach(locksmith => {
              dispatch(logUserActivity({
                action: 'sayfa-goruntuleme',
                details: `${locksmith.name}`,
                entityType: 'locksmith',
                entityId: locksmith.id,
                additionalData: {
                  locksmithId: locksmith.id,
                  searchProvinceId: provinceId,
                  searchDistrictId: districtId,
                  searchServiceId: serviceId,
                  userAgent: navigator.userAgent || ''
                }
              }));
            });
            
            console.log(`${locksmiths.length} çilingir için görüntüleme logu oluşturuldu`);
          } catch (error) {
            console.error('Çilingir görüntüleme logları oluşturulurken hata:', error);
          }
        } else {
          console.warn('Kullanıcı oturumu başlatılmamış, görüntüleme logları oluşturulamadı');
        }
      } else {
        console.log('Bu arama için log oluşturulmadı (sayfa geçişi)');
      }
      
      return {
        locksmiths,
        searchParams: {
          provinceId,
          districtId,
          serviceId
        }
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search slice
const searchSlice = createSlice({
  name: 'search',
  initialState: {
    selectedValues: {
      serviceId: null,
      districtId: null,
      provinceId: null
    },
    locksmiths: [],
    isLoading: false,
    error: null,
    showResults: false,
    hasSearched: false
  },
  reducers: {
    // Seçili değerleri güncelle
    setSelectedValues: (state, action) => {
      state.selectedValues = {
        ...state.selectedValues,
        ...action.payload
      };
    },
    // Aramaları temizle ve başlangıç durumuna dön
    clearSearch: (state) => {
      state.locksmiths = [];
      state.error = null;
      state.showResults = false;
      state.hasSearched = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Arama işlemi başladığında
      .addCase(searchLocksmiths.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.showResults = true;
      })
      // Arama başarılı olduğunda
      .addCase(searchLocksmiths.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locksmiths = action.payload.locksmiths;
        state.selectedValues = action.payload.searchParams;
        state.showResults = true;
        state.hasSearched = true;
      })
      // Arama başarısız olduğunda
      .addCase(searchLocksmiths.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.showResults = true;
        state.hasSearched = true;
      });
  },
});

export const { setSelectedValues, clearSearch } = searchSlice.actions;
export default searchSlice.reducer; 