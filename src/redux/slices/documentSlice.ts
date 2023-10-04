import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  addDocumentFiles,
  addDocumentUsers,
  addLinkedDocsAction,
  createDocument,
  getDocuments,
  removeDocumentFiles,
  removeDocumentUser,
  removeLinkedDocsAction,
  updateDocument,
} from "../api/documentApi";
import { IDocumentResponse } from "../../interfaces/documents/IDocumentResponse";

export interface DocumentState {
  data: IDocumentResponse[];
  loading: boolean;
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
  loading: false,
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
  reducers: {
    setDocuments: (state, action: PayloadAction<IDocumentResponse[]>) => {
      state.data = action.payload;
    },
  },
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
        state.loading = true;
      })
      .addCase(getDocuments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getDocuments.rejected, (state) => {
        state.loading = false;
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
      // Add Document Files
      .addCase(addDocumentFiles.pending, (state, action) => {
        state.loaders.updating = action.meta.requestId;
      })
      .addCase(addDocumentFiles.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload?.id);
        if (!foundIndex || !action.payload) return;
        state.data[foundIndex] = action.payload;
        state.loaders.updating = null;
      })
      .addCase(addDocumentFiles.rejected, (state) => {
        state.loaders.updating = null;
      })
      // Remove Document Files
      .addCase(removeDocumentFiles.pending, (state, action) => {
        state.loaders.updating = action.meta.requestId;
      })
      .addCase(removeDocumentFiles.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload?.id);
        if (!foundIndex || !action.payload) return;
        state.data[foundIndex] = action.payload;
        state.loaders.updating = null;
      })
      .addCase(removeDocumentFiles.rejected, (state) => {
        state.loaders.updating = null;
      })
      // Link Document
      .addCase(addLinkedDocsAction.pending, (state) => {
        state.loaders.linkingDocument = true;
      })
      .addCase(addLinkedDocsAction.fulfilled, (state, action: PayloadAction<IDocumentResponse>) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
        state.data[foundIndex] = action.payload;

        state.data = state.data.map((d) => {
          if (action.payload.linkedDocs.includes(d.id)) {
            d.linkedDocs.push(action.payload.id);
          }
          return d;
        });

        state.loaders.linkingDocument = null;
      })
      .addCase(addLinkedDocsAction.rejected, (state) => {
        state.loaders.linkingDocument = null;
      })
      // Unlink Document
      .addCase(removeLinkedDocsAction.pending, (state) => {
        state.loaders.linkingDocument = true;
      })
      .addCase(
        removeLinkedDocsAction.fulfilled,
        (state, action: PayloadAction<IDocumentResponse>) => {
          const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
          state.data[foundIndex] = action.payload;
          state.data = state.data.map((d) => {
            const filteredLinkedDocs = d.linkedDocs.filter((d) => d !== action.payload.id);
            d.linkedDocs = filteredLinkedDocs;
            return d;
          });

          state.loaders.linkingDocument = null;
        },
      )
      .addCase(removeLinkedDocsAction.rejected, (state) => {
        state.loaders.linkingDocument = null;
      })
      // Add Document Users
      .addCase(addDocumentUsers.pending, (state) => {
        state.loaders.addingUser = true;
      })
      .addCase(addDocumentUsers.fulfilled, (state, action) => {
        const foundIndex = state.data.findIndex((d) => d.id === action.payload.id);
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

export const { setDocuments } = documentsSlice.actions;

export default documentsReducer;
