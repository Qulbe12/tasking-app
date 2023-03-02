import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filters",
  initialState: {
    search: "",
    filtersOpen: false,
  },

  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    toggleFilterOpen: (state) => {
      state.filtersOpen = !state.filtersOpen;
    },
    resetFilters: (state) => {
      state.search = "";
      state.filtersOpen = false;
    },
  },
});

const filterReducer = filterSlice.reducer;

export const { toggleFilterOpen, setSearch, resetFilters } = filterSlice.actions;

export default filterReducer;
