import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ISignatureResponse } from "../../interfaces/signatures/ISignatureResponse";
import {
  createSignature,
  deleteSignature,
  getSignatures,
  updateSignature,
} from "../api/signatureApi";

interface CommentsState {
  signatures: ISignatureResponse[];
  loading: boolean;
  loaders: {
    updating: boolean;
    deleting: boolean;
  };
}

const initialState: CommentsState = {
  signatures: [],
  loading: false,
  loaders: {
    updating: false,
    deleting: false,
  },
};

const signatureSlice = createSlice({
  name: "signatures",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Signature
      .addCase(createSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSignature.fulfilled, (state, action: PayloadAction<ISignatureResponse>) => {
        if (action.payload) {
          state.signatures.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createSignature.rejected, (state) => {
        state.loading = false;
      })
      //  Get Signatures
      .addCase(getSignatures.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSignatures.fulfilled, (state, action: PayloadAction<ISignatureResponse[]>) => {
        state.signatures = action.payload;
        state.loading = false;
      })
      .addCase(getSignatures.rejected, (state) => {
        state.loading = false;
      })
      //   Update Signature
      .addCase(updateSignature.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSignature.fulfilled, (state, action: PayloadAction<ISignatureResponse>) => {
        const foundIndex = state.signatures.findIndex((s) => s.id === action.payload.id);
        if (foundIndex) {
          state.signatures[foundIndex] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateSignature.rejected, (state) => {
        state.loading = false;
      })
      //   Delete Signature
      .addCase(deleteSignature.pending, (state) => {
        state.loaders.deleting = true;
      })
      .addCase(deleteSignature.fulfilled, (state, action: PayloadAction<ISignatureResponse>) => {
        const foundIndex = state.signatures.findIndex((s) => s.id === action.payload.id);
        if (foundIndex) {
          state.signatures = state.signatures.splice(foundIndex, 1);
        }
        state.loaders.deleting = false;
      })
      .addCase(deleteSignature.rejected, (state) => {
        state.loaders.deleting = false;
      });
  },
});

const signatureReducer = signatureSlice.reducer;

export default signatureReducer;
