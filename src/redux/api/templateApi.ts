import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateField, ICreateTemplate, IUpdateTemplate } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

const { templateApi } = api;
const { addField, create, get, remove, removeField, update } = templateApi;

export const addTemplate = createAsyncThunk(
  "templates/addTemplate",
  async (
    { workspaceId, template }: { template: ICreateTemplate; workspaceId: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await create(workspaceId, template);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getAllTemplates = createAsyncThunk(
  "templates/getAllTemplates",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const res = await get(workspaceId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const updateTemplate = createAsyncThunk(
  "templates/updateTemplate",
  async (data: { templateId: string; template: IUpdateTemplate }, { rejectWithValue }) => {
    try {
      const res = await update(data.templateId, data.template);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const deleteTemplate = createAsyncThunk(
  "templates/deleteTemplate",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await remove(id);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const addTemplateField = createAsyncThunk(
  "templates/addTemplateField",
  async (data: { templateId: string; field: ICreateField }, { rejectWithValue }) => {
    try {
      const res = await addField(data.templateId, data.field);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const removeTemplateField = createAsyncThunk(
  "templates/removeTemplateField",
  async (data: { templateId: string; fieldId: string }, { rejectWithValue }) => {
    try {
      const res = await removeField(data.templateId, data.fieldId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);
