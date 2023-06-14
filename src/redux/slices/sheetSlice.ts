import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISheetResponse } from "../../interfaces/sheets/ISheetResponse";
import { createSheet, getSheets } from "../api/sheetsApi";

export interface SheetsState {
  data: ISheetResponse[];
  loaders: {
    gettingSheets: boolean;
    addingSheet: boolean;
  };
}

const initialState: SheetsState = {
  data: [],
  loaders: {
    gettingSheets: false,
    addingSheet: false,
  },
};

export const sheetsSlice = createSlice({
  name: "sheets",
  initialState,
  reducers: {},
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
      });
  },
});

const sheetsReducer = sheetsSlice.reducer;

export default sheetsReducer;
