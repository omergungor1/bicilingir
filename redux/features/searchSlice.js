import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Çilingir arama için async thunk
export const searchLocksmiths = createAsyncThunk(
  'search/searchLocksmiths',
  async ({ selectedValues }, { rejectWithValue }) => {
    try {
      // Çilingir verilerini GET ile getir
      const queryParams = new URLSearchParams({
        serviceId: selectedValues.serviceId || '',
        districtId: selectedValues.districtId || '',
        provinceId: selectedValues.provinceId || '',
        count: 3
      }).toString();

      const response = await fetch(`/api/locksmiths?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        return rejectWithValue('Arama sırasında bir hata oluştu');
      }

      const data = await response.json();

      // Seçilen değerleri ve çilingir verilerini döndür
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
      serviceSlug: null,
      districtId: null,
      provinceId: null,
      districtName: null,
      provinceName: null
    },
    locksmiths: [],
    isLoading: false,
    error: null,
    showResults: false,
    hasSearched: false,
    lastSearchTimestamp: null
  },
  reducers: {
    setSelectedValues: (state, action) => {
      state.selectedValues = {
        ...state.selectedValues,
        ...action.payload
      };
      state.lastSearchTimestamp = Date.now();

      // Local storage'a kaydet
      localStorage.setItem('searchState', JSON.stringify({
        selectedValues: state.selectedValues,
        lastSearchTimestamp: state.lastSearchTimestamp
      }));
    },
    clearSearch: (state) => {
      state.locksmiths = [];
      state.error = null;
      state.showResults = false;
      state.hasSearched = false;
      state.lastSearchTimestamp = null;
      localStorage.removeItem('searchState');
    },
    restoreSearchState: (state) => {
      const savedState = localStorage.getItem('searchState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        // Son aramadan bu yana 1 saat geçmediyse durumu geri yükle
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - parsedState.lastSearchTimestamp < oneHour) {
          state.selectedValues = parsedState.selectedValues;
          state.lastSearchTimestamp = parsedState.lastSearchTimestamp;
        } else {
          localStorage.removeItem('searchState');
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchLocksmiths.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.showResults = true;
      })
      .addCase(searchLocksmiths.fulfilled, (state, action) => {
        state.isLoading = false;
        state.locksmiths = action.payload.locksmiths;
        state.selectedValues = action.payload.selectedValues;
        state.showResults = true;
        state.hasSearched = true;
        state.lastSearchTimestamp = Date.now();

        // Local storage'a kaydet
        localStorage.setItem('searchState', JSON.stringify({
          selectedValues: state.selectedValues,
          locksmiths: state.locksmiths,
          lastSearchTimestamp: state.lastSearchTimestamp
        }));
      })
      .addCase(searchLocksmiths.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.showResults = true;
        state.hasSearched = true;
      });
  },
});

export const { setSelectedValues, clearSearch, restoreSearchState } = searchSlice.actions;
export default searchSlice.reducer; 