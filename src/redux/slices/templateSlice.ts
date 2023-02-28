import { createSlice } from "@reduxjs/toolkit";
import { ITemplate } from "hexa-sdk/dist/app.api";
import {
  addTemplate,
  addTemplateField,
  deleteTemplate,
  getAllTemplates,
  removeTemplateField,
  updateTemplate,
} from "../api/templateApi";
import { showError } from "../commonSliceFunctions";

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
  extraReducers: (builder) => {
    builder
      // Add Template
      .addCase(addTemplate.pending, (state) => {
        state.loading++;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        state.data?.push(action.payload);
        state.loading--;
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      })
      // Get All Templates
      .addCase(getAllTemplates.pending, (state) => {
        state.loading++;
      })
      .addCase(getAllTemplates.fulfilled, (state, action) => {
        state.loading--;
        state.data = action.payload;
      })
      .addCase(getAllTemplates.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      })
      // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.loading++;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const index = state.data?.findIndex((t) => t.id === action.payload.id);
        state.data[index] = action.payload;
        state.loading--;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      })
      // Delete Template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading++;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        const index = state.data.findIndex((t) => t.id === action.payload.id);
        state.data.splice(index, 1);
        state.loading--;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      })
      // Add Template Field
      .addCase(addTemplateField.pending, (state) => {
        state.loading++;
      })
      .addCase(addTemplateField.fulfilled, (state, action) => {
        const index = state.data?.findIndex((t) => t.id === action.payload.id);
        state.data[index] = action.payload;
        state.loading--;
      })
      .addCase(addTemplateField.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      })
      // Remove Template Field
      .addCase(removeTemplateField.pending, (state) => {
        state.loading++;
      })
      .addCase(removeTemplateField.fulfilled, (state, action) => {
        const index = state.data?.findIndex((t) => t.id === action.payload.id);
        state.data[index] = action.payload;
        state.loading--;
      })
      .addCase(removeTemplateField.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      });
  },
});

const templatesReducer = templateSlice.reducer;

export default templatesReducer;
