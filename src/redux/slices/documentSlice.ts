import { createSlice } from "@reduxjs/toolkit";
import { IDocument } from "hexa-sdk/dist/app.api";
import { createDocument, getDocuments, updateDocument } from "../api/documentApi";
import { showError } from "../commonSliceFunctions";

export interface DocumentState {
  data: IDocument[];
  loading: number;
  error?: string;
  loaders: {
    adding: string | null;
    updating: string | null;
    deleting: string | null;
  };
}

const initialState: DocumentState = {
  loading: 0,
  data: [],
  loaders: {
    adding: null,
    updating: null,
    deleting: null,
  },
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Document
      .addCase(createDocument.pending, (state) => {
        state.loaders.adding = "adding";
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.data?.unshift(action.payload);
        state.loaders.adding = null;
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loaders.adding = null;
        state.error = action.error.message;
        showError(action.error.message);
      })
      // Get Documents
      .addCase(getDocuments.pending, (state) => {
        state.loading += 1;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading -= 1;
      })
      .addCase(getDocuments.rejected, (state, action) => {
        state.loading -= 1;
        state.error = action.error.message;
        showError(action.error.message);
      }) // Update Documents
      .addCase(updateDocument.pending, (state, action) => {
        state.loaders.updating = action.meta.requestId;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        state.data[foundIndex] = action.payload;
        state.loaders.updating = null;
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.loaders.updating = null;
        state.error = action.error.message;
        showError(action.error.message);
      });
  },
});

const documentsReducer = documentsSlice.reducer;

export default documentsReducer;
