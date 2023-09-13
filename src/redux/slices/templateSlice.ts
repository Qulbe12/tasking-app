import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ITemplate } from "hexa-sdk/dist/app.api";
import {
  addTemplate,
  addTemplateField,
  deleteTemplate,
  deleteTemplateFields,
  getAllTemplates,
  removeTemplateField,
  updateTemplate,
  updateTemplateFields,
} from "../api/templateApi";
import { showError } from "../commonSliceFunctions";
import { IUpdateFieldResponse } from "../../interfaces/templates/IUpdateTemplatesFields";

export interface TemplatesState {
  data: ITemplate[];
  updatedField?: IUpdateFieldResponse;
  loading: number;
  loaders: {
    updatingField: boolean;
    deletingField: boolean;
  };
  error?: string;
}

const initialState: TemplatesState = {
  loading: 0,
  loaders: {
    updatingField: false,
    deletingField: false,
  },
  data: [],
};

export const templateSlice = createSlice({
  name: "templates",
  initialState,
  reducers: {
    setTemplates: (state, action: PayloadAction<ITemplate[]>) => {
      state.data = action.payload;
    },
  },
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
        state.data = [];
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
      })
      // update template fields
      .addCase(updateTemplateFields.pending, (state) => {
        state.loading++;
      })
      .addCase(
        updateTemplateFields.fulfilled,
        (state, { payload }: PayloadAction<IUpdateFieldResponse>) => {
          state.loading--;
          state.updatedField = payload;
        },
      )
      .addCase(updateTemplateFields.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      })
      // delete templates field
      .addCase(deleteTemplateFields.pending, (state) => {
        state.loading++;
      })
      .addCase(
        deleteTemplateFields.fulfilled,
        (state, { payload }: PayloadAction<IUpdateFieldResponse>) => {
          state.loading--;
          state.updatedField = payload;
        },
      )
      .addCase(deleteTemplateFields.rejected, (state, action) => {
        state.loading--;
        showError(action.error.message);
      });
  },
});

const templatesReducer = templateSlice.reducer;
export const { setTemplates } = templateSlice.actions;

export default templatesReducer;
