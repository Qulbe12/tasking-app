import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITemplate } from "hexa-sdk";
import {
  addTemplate,
  addTemplateField,
  deleteTemplate,
  getAllTemplates,
  getTemplateById,
  removeTemplateField,
  updateTemplate,
} from "../api/templateApi";
import { PayloadError, showError } from "../commonSliceFunctions";

export interface TemplatesState {
  data: ITemplate[];
  loading: number;
  error?: string;
}

const initialState: TemplatesState = {
  loading: 0,
  data: [],
};

export const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {},
  extraReducers: {
    // Add Template
    [addTemplate.pending.type]: (state) => {
      state.loading += 1;
    },
    [addTemplate.fulfilled.type]: (state, action: PayloadAction<ITemplate>) => {
      state.data?.push(action.payload);
      state.loading -= 1;
    },
    [addTemplate.rejected.type]: (state, action: PayloadError) => {
      state.loading -= 1;
      showError(action.error.message);
    },
    // Get all templates
    [getAllTemplates.pending.type]: (state) => {
      state.loading += 1;
    },
    [getAllTemplates.fulfilled.type]: (state, action: PayloadAction<ITemplate[]>) => {
      state.loading -= 1;
      state.data = action.payload;
    },
    [getAllTemplates.rejected.type]: (state, action: PayloadError) => {
      state.loading -= 1;
      showError(action.error.message);
    },
    // Get Template By Id
    [getTemplateById.pending.type]: (state) => {
      state.loading += 1;
    },
    [getTemplateById.fulfilled.type]: (state) => {
      state.loading -= 1;
    },
    [getTemplateById.rejected.type]: (state) => {
      state.loading -= 1;
    },
    // Update Template
    [updateTemplate.pending.type]: (state) => {
      state.loading += 1;
    },
    [updateTemplate.fulfilled.type]: (state, action: PayloadAction<ITemplate>) => {
      console.log(action.payload.id);
      const index = state.data?.findIndex((t) => t.id === action.payload.id);
      state.data[index] = action.payload;
      state.loading -= 1;
    },
    [updateTemplate.rejected.type]: (state) => {
      state.loading -= 1;
    },
    // Delete Template
    [deleteTemplate.pending.type]: (state) => {
      state.loading += 1;
    },
    [deleteTemplate.fulfilled.type]: (state) => {
      state.loading -= 1;
    },
    [deleteTemplate.rejected.type]: (state) => {
      state.loading -= 1;
    },
    // Add Template Field
    [addTemplateField.pending.type]: (state) => {
      state.loading += 1;
    },
    [addTemplateField.fulfilled.type]: (state) => {
      state.loading -= 1;
    },
    [addTemplateField.rejected.type]: (state) => {
      state.loading -= 1;
    },
    // Remove Template Field
    [removeTemplateField.pending.type]: (state) => {
      state.loading += 1;
    },
    [removeTemplateField.fulfilled.type]: (state) => {
      state.loading -= 1;
    },
    [removeTemplateField.rejected.type]: (state) => {
      state.loading -= 1;
    },
  },
});

const templatesReducer = templateSlice.reducer;

export default templatesReducer;
