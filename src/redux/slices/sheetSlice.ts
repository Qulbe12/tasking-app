import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISheetResponse } from "../../interfaces/sheets/ISheetResponse";
import { createSheet, createSheetVersion, getSheets, updateSheet } from "../api/sheetsApi";

export interface SheetsState {
  data: ISheetResponse[];
  loaders: {
    gettingSheets: boolean;
    addingSheet: boolean;
    addingVersion: boolean;
    updatingSheet: boolean;
  };
}

const initialState: SheetsState = {
  data: [],
  loaders: {
    gettingSheets: false,
    updatingSheet: false,
    addingSheet: false,
    addingVersion: false,
  },
};

export const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {
    setSheets: (state, action: PayloadAction<ISheetResponse[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // Get All Sheets
      .addCase(getSheets.pending, (state) => {
        state.loaders.gettingSheets = true;
        state.data = [];
      })
      .addCase(getSheets.fulfilled, (state, action: PayloadAction<ISheetResponse[]>) => {
        state.loaders.gettingSheets = false;
        state.data = action.payload;
      })
      .addCase(getSheets.rejected, (state) => {
        state.loaders.gettingSheets = false;
      })
      //   Create Sheet
      .addCase(createSheet.pending, (state) => {
        state.loaders.addingSheet = true;
      })
      .addCase(createSheet.fulfilled, (state, action: PayloadAction<ISheetResponse>) => {
        state.loaders.addingSheet = false;
        state.data.push(action.payload);
      })
      .addCase(createSheet.rejected, (state) => {
        state.loaders.addingSheet = false;
      })
      // Update Sheet
      .addCase(updateSheet.pending, (state) => {
        state.loaders.updatingSheet = true;
      })
      .addCase(updateSheet.fulfilled, (state, action: PayloadAction<ISheetResponse>) => {
        state.loaders.updatingSheet = false;
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);

        if (foundIndex >= 0) {
          state.data[foundIndex] = action.payload;
        }
      })
      .addCase(updateSheet.rejected, (state) => {
        state.loaders.updatingSheet = false;
      })
      // Create Sheet Version
      .addCase(createSheetVersion.pending, (state) => {
        state.loaders.addingVersion = true;
      })
      .addCase(createSheetVersion.fulfilled, (state, action: PayloadAction<ISheetResponse>) => {
        const sheetIndex = state.data.findIndex((s) => s.id === action.payload.id);
        if (sheetIndex < 0) return;
        state.data[sheetIndex] = action.payload;
        state.loaders.addingVersion = false;
      })
      .addCase(createSheetVersion.rejected, (state) => {
        state.loaders.addingVersion = false;
      });
  },
});

const sheetsReducer = sheetsSlice.reducer;

export const { setSheets } = sheetsSlice.actions;

export default sheetsReducer;
