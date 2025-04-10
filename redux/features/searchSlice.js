import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Çilingir arama için async thunk
export const searchLocksmiths = createAsyncThunk(
  'search/searchLocksmiths',
  async ({ selectedValues, userAgent, shouldLog = true }, { getState, rejectWithValue }) => {
    try {
      // Kullanıcı bilgilerini ve oturum kimliğini al
      const userId = localStorage.getItem('userId');
      const sessionId = localStorage.getItem('sessionId');
      
      // shouldLog true ise aktivite logu oluştur
      if (shouldLog && userId && sessionId) {
        // Önce arama aktivitesini logla
        try {
          const activityResponse = await fetch('/api/public/user/activity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              activitytype: 'search',
              data: JSON.stringify({
                districtId: selectedValues.districtId,
                provinceId: selectedValues.provinceId,
                serviceId: selectedValues.serviceId
              }),
              userId,
              sessionId,
              userAgent
            }),
          });
          
          if (!activityResponse.ok) {
            console.error('Arama aktivite log hatası:', await activityResponse.text());
          } else {
            console.log('Arama aktivitesi kaydedildi');
          }
        } catch (error) {
          console.error('Arama aktivite log hatası:', error);
        }
      } else {
        console.log('shouldLog=false olduğu için arama aktivitesi loglanmadı');
      }
      
      // Çilingir verilerini GET ile getir
      const queryParams = new URLSearchParams({
        serviceId: selectedValues.serviceId,
        districtId: selectedValues.districtId,
        provinceId: selectedValues.provinceId
      }).toString();
      
      const response = await fetch(`/api/public/search?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        return rejectWithValue('Arama sırasında bir hata oluştu');
      }
      
      const data = await response.json();
      
      // Çilingir görüntüleme aktivitelerini logla - seviyelerine göre (shouldLog true ise)
      if (shouldLog && userId && sessionId && data.locksmiths && data.locksmiths.length > 0) {
        console.log(`${data.locksmiths.length} çilingir için görüntüleme aktiviteleri loglanıyor...`);
        
        try {
          // İlk çilingir - seviye 1
          if (data.locksmiths.length >= 1) {
            const firstLocksmithResponse = await fetch('/api/public/user/activity', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activitytype: 'locksmith_list_view',
                level: 1,
                data: JSON.stringify({
                  locksmithId: data.locksmiths[0].id,
                  searchProvinceId: selectedValues.provinceId,
                  searchDistrictId: selectedValues.districtId,
                  searchServiceId: selectedValues.serviceId,
                  position: 1
                }),
                userId,
                sessionId,
                userAgent
              }),
            });

            console.log('firstLocksmithResponse', firstLocksmithResponse)
            console.log('activitytype', 'locksmith_list_view')
            console.log('level', 1)
            console.log('locksmithId', data.locksmiths[0].id)
            console.log('searchProvinceId', selectedValues.provinceId)
            console.log('searchDistrictId', selectedValues.districtId)
            console.log('searchServiceId', selectedValues.serviceId)
            console.log('position', 1)
            console.log('userId', userId)
            console.log('sessionId', sessionId)
            console.log('userAgent', userAgent)
            
            if (!firstLocksmithResponse.ok) {
              console.error('1. çilingir aktivite log hatası:', await firstLocksmithResponse.text());
            }
          }
          
          // İkinci çilingir - seviye 2
          if (data.locksmiths.length >= 2) {
            const secondLocksmithResponse = await fetch('/api/public/user/activity', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activitytype: 'locksmith_list_view',
                level: 2,
                data: JSON.stringify({
                  locksmithId: data.locksmiths[1].id,
                  searchProvinceId: selectedValues.provinceId,
                  searchDistrictId: selectedValues.districtId,
                  searchServiceId: selectedValues.serviceId,
                  position: 2
                }),
                userId,
                sessionId,
                userAgent
              }),
            });
            
            if (!secondLocksmithResponse.ok) {
              console.error('2. çilingir aktivite log hatası:', await secondLocksmithResponse.text());
            }
          }
          
          // Diğer tüm çilingirler - seviye 3
          for (let i = 2; i < data.locksmiths.length; i++) {
            const otherLocksmithResponse = await fetch('/api/public/user/activity', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                activitytype: 'locksmith_list_view',
                level: 3,
                data: JSON.stringify({
                  locksmithId: data.locksmiths[i].id,
                  searchProvinceId: selectedValues.provinceId,
                  searchDistrictId: selectedValues.districtId,
                  searchServiceId: selectedValues.serviceId,
                  position: i + 1
                }),
                userId,
                sessionId,
                userAgent
              }),
            });
            
            if (!otherLocksmithResponse.ok) {
              console.error(`${i+1}. çilingir aktivite log hatası:`, await otherLocksmithResponse.text());
            }
          }
          
          console.log('Tüm çilingir görüntüleme aktiviteleri loglandı.');
        } catch (error) {
          console.error('Çilingir görüntüleme aktivitesi log hatası:', error);
        }
      } else if (!shouldLog) {
        console.log('shouldLog=false olduğu için çilingir görüntüleme aktiviteleri loglanmadı');
      }
      
      // Seçilen değerleri de yanıtta gönder
      return { 
        locksmiths: data.locksmiths || [],
        selectedValues 
      };
    } catch (error) {
      console.error('Çilingir arama hatası:', error);
      return rejectWithValue('Çilingir arama sırasında bir hata oluştu');
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
        state.selectedValues = action.payload.selectedValues;
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