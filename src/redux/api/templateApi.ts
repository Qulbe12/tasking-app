import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateField, ICreateTemplate, ITemplate, IUpdateTemplate } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { IUpdateField } from "../../interfaces/templates/IUpdateTemplatesFields";

const { templateApi } = api;
const { addField, create, get, remove, removeField, update } = templateApi;

export const addTemplate = createAsyncThunk(
  "templates/addTemplate",
  async (
    { workspaceId, template }: { template: ICreateTemplate; workspaceId: string },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await create(workspaceId, template);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getAllTemplates = createAsyncThunk(
  "templates/getAllTemplates",
  async (workspaceId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await get(workspaceId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateTemplate = createAsyncThunk(
  "templates/updateTemplate",
  async (
    data: { templateId: string; template: IUpdateTemplate },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await update(data.templateId, data.template);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const deleteTemplate = createAsyncThunk(
  "templates/deleteTemplate",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await remove(id);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const addTemplateField = createAsyncThunk(
  "templates/addTemplateField",
  async (data: { templateId: string; field: ICreateField }, { rejectWithValue, dispatch }) => {
    try {
      const res = await addField(data.templateId, data.field);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const removeTemplateField = createAsyncThunk(
  "templates/removeTemplateField",
  async (data: { templateId: string; fieldId: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await removeField(data.templateId, data.fieldId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateTemplateFields = createAsyncThunk(
  "templates/updateTemplateFields",
  async (
    data: { fieldId: string; field: string; updatedField: IUpdateField },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.patch<ITemplate>(
        `templates/${data.fieldId}/fields/${data.field}`,
        data.updatedField,
      );
      console.log(res.data);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
export const deleteTemplateFields = createAsyncThunk(
  "templates/deleteTemplateFields",
  async (data: { fieldId: string; field: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.delete<ITemplate>(
        `templates/${data.fieldId}/fields/${data.field}`,
      );
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
