import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateField, ICreateTemplate, IUpdateTemplate } from "hexa-sdk";
import api from "../../config/api";

const { templateApi } = api;
const { addField, create, get, getById, remove, removeField, update } = templateApi;

export const addTemplate = createAsyncThunk(
  "templates/addTemplate",
  async (template: ICreateTemplate) => (await create(template)).data,
);

export const getAllTemplates = createAsyncThunk(
  "templates/getAllTemplates",
  async () => (await get()).data,
);

export const getTemplateById = createAsyncThunk(
  "templates/getTemplateById",
  async (id: string) => (await getById(id)).data,
);

export const updateTemplate = createAsyncThunk(
  "templates/updateTemplate",
  async (data: { templateId: string; template: IUpdateTemplate }) =>
    (await update(data.templateId, data.template)).data,
);

export const deleteTemplate = createAsyncThunk(
  "templates/deleteTemplate",
  async (id: string) => (await remove(id)).data,
);

export const addTemplateField = createAsyncThunk(
  "templates/addTemplateField",
  async (data: { templateId: string; field: ICreateField }) =>
    (await addField(data.templateId, data.field)).data,
);

export const removeTemplateField = createAsyncThunk(
  "templates/removeTemplateField",
  async (data: { templateId: string; fieldId: string }) =>
    (await removeField(data.templateId, data.fieldId)).data,
);
