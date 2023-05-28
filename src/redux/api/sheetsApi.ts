import { createAsyncThunk } from "@reduxjs/toolkit";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { ISheetResponse } from "../../interfaces/sheets/ISheetResponse";

export const createSheet = createAsyncThunk(
  "sheets/createSheet",
  async (
    { boardId, sheet }: { boardId: string; sheet: FormData },
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
  async ({ id }: { id: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.patch<ISheetResponse>(`/sheets/${id}`);
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
