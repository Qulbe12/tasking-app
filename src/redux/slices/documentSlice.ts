import { createSlice } from "@reduxjs/toolkit";
import { IDocument } from "hexa-sdk/dist/app.api";
import {
  addDocumentUsers,
  addLinkedDocsAction,
  createDocument,
  getDocuments,
  removeDocumentUser,
  removeLinkedDocsAction,
  updateDocument,
} from "../api/documentApi";

export interface DocumentState {
  data: IDocument[];
  loading: number;
  error?: string;
  loaders: {
    adding: string | null;
    updating: string | null;
    deleting: string | null;
    linkingDocument: boolean | null;
    addingUser: boolean | null;
  };
}

const initialState: DocumentState = {
  loading: 0,
  data: [],
  loaders: {
    adding: null,
    updating: null,
    deleting: null,
    linkingDocument: null,
    addingUser: null,
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
      .addCase(createDocument.rejected, (state) => {
        state.loaders.adding = null;
      })
      // Get Documents
      .addCase(getDocuments.pending, (state) => {
        state.loading += 1;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading -= 1;
      })
      .addCase(getDocuments.rejected, (state) => {
        state.loading -= 1;
      }) // Update Documents
      .addCase(updateDocument.pending, (state, action) => {
        state.loaders.updating = action.meta.requestId;
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        state.data[foundIndex] = action.payload;
        state.loaders.updating = null;
      })
      .addCase(updateDocument.rejected, (state) => {
        state.loaders.updating = null;
      })
      // Link Document
      .addCase(addLinkedDocsAction.pending, (state) => {
        state.loaders.linkingDocument = true;
      })
      .addCase(addLinkedDocsAction.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        state.data[foundIndex] = action.payload;
        state.loaders.linkingDocument = null;
      })
      .addCase(addLinkedDocsAction.rejected, (state) => {
        state.loaders.linkingDocument = null;
      })
      // Unlink Document
      .addCase(removeLinkedDocsAction.pending, (state) => {
        state.loaders.linkingDocument = true;
      })
      .addCase(removeLinkedDocsAction.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        state.data[foundIndex] = action.payload;
        state.loaders.linkingDocument = null;
      })
      .addCase(removeLinkedDocsAction.rejected, (state) => {
        state.loaders.linkingDocument = null;
      })
      // Add Document Users
      .addCase(addDocumentUsers.pending, (state) => {
        state.loaders.addingUser = true;
      })
      .addCase(addDocumentUsers.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        console.log(foundIndex);
        if (foundIndex >= 0) {
          state.data[foundIndex] = action.payload;
        }
        state.loaders.addingUser = false;
      })
      .addCase(addDocumentUsers.rejected, (state) => {
        state.loaders.addingUser = false;
      })
      // Remove Document Users
      .addCase(removeDocumentUser.pending, (state) => {
        state.loaders.addingUser = true;
      })
      .addCase(removeDocumentUser.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        if (foundIndex) {
          state.data[foundIndex] = action.payload;
        }
        state.loaders.addingUser = false;
      })
      .addCase(removeDocumentUser.rejected, (state) => {
        state.loaders.addingUser = false;
      });
  },
});

const documentsReducer = documentsSlice.reducer;

export default documentsReducer;
