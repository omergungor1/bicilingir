import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Çilingir arama için async thunk
export const searchLocksmiths = createAsyncThunk(
  'search/searchLocksmiths',
  async (searchParams, { rejectWithValue }) => {
    try {
      const { provinceId, districtId, serviceId } = searchParams;
      
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
      
      return {
        locksmiths: data.locksmiths || [],
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