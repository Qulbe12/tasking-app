import { createAsyncThunk } from "@reduxjs/toolkit";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { ISheetResponse } from "../../interfaces/sheets/ISheetResponse";
import { ISheetCreate } from "../../interfaces/sheets/ISheetCreate";
import ISheetCreateVersion from "../../interfaces/sheets/ISheetCreateVersion";
import { ISheetUpdate } from "../../interfaces/sheets/ISheetUpdate";

export const createSheet = createAsyncThunk(
  "sheets/createSheet",
  async (
    { boardId, sheet }: { boardId: string; sheet: ISheetCreate },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post<ISheetResponse>(`/boards/${boardId}/sheets`, sheet);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const createSheetVersion = createAsyncThunk(
  "sheets/createSheetVersion",
  async (
    { sheetId, sheet }: { sheetId: string; sheet: ISheetCreateVersion },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post<ISheetResponse>(`/sheets/${sheetId}/version`, sheet);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getSheets = createAsyncThunk(
  "sheets/getSheets",
  async ({ boardId }: { boardId: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<ISheetResponse[]>(`/boards/${boardId}/sheets`);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getSheetById = createAsyncThunk(
  "sheets/getSheetById",
  async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<ISheetResponse>(`/sheets/${id}`);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateSheet = createAsyncThunk(
  "sheets/updateSheet",
  async ({ id, data }: { id: string; data: ISheetUpdate }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.patch<ISheetResponse>(`/sheets/${id}`, data);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const deleteSheet = createAsyncThunk(
  "sheets/deleteSheet",
  async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.delete<ISheetResponse>(`/sheets/${id}`);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const addFilesToSheet = createAsyncThunk(
  "sheets/addFilesToSheet",
  async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.post<ISheetResponse>(`/sheets/${id}/files`);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const addUsersToFile = createAsyncThunk(
  "sheets/addUsersToFile",
  async (
    { id, type }: { id: string; type: "ccUsers" | "assignedUsers" },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post(`/sheets/${id}/users/${type}`);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateSheetTags = createAsyncThunk(
  "sheets/updateSheetTags",
  async (
    {
      sheetId,
      code,
      version,
      newTags,
    }: { sheetId: string; code: string; version: number; newTags: string[] },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.patch(
        `/sheets/${sheetId}/records/${code}/tags/version/${version}`,
        newTags,
      );

      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

// /sheets/{id}/records/{code}/tags/version/{version}
