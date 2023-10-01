import { createAsyncThunk } from "@reduxjs/toolkit";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { ISignatureCreate } from "../../interfaces/signatures/ISignatureCreate";
import { ISignatureResponse } from "../../interfaces/signatures/ISignatureResponse";

export const createSignature = createAsyncThunk(
  "signatures/createSignature",
  async (signature: ISignatureCreate, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.post<ISignatureResponse>("/signatures", signature);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getSignatures = createAsyncThunk(
  "signatures/getSignatures",
  async (bool, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<ISignatureResponse[]>("/signatures");
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateSignature = createAsyncThunk(
  "signatures/updateSignature",
  async (signature: ISignatureCreate, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.patch<ISignatureResponse>("/signatures", signature);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const deleteSignature = createAsyncThunk(
  "signatures/deleteSignature",
  async (id: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.delete<ISignatureResponse>(`/signatures/${id}`);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
