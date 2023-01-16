import { createSlice } from "@reduxjs/toolkit";

export interface ThemeState {
  mode: "dark" | "light";
}

const initialState: ThemeState = {
  mode: "dark",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode === "dark" ? (state.mode = "light") : (state.mode = "dark");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

const themeReducer = themeSlice.reducer;

export default themeReducer;
