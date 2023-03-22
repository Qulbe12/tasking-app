import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { nylasAxios } from "../../config/nylasAxios";
import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";

const { nylasApi } = api;
const { connect } = nylasApi;

export const connectNylas = createAsyncThunk(
  "nylas/connectNylas",
  async () => (await connect()).data,
);

export const fetchEmails = createAsyncThunk(
  "nylas/fetchEmails",
  async ({ offset }: { offset: number }, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IEmailThreadResponse[]>("/threads");
      return res.data;
    } catch (err: any) {
      const errMsg = err.response.data.message;
      return rejectWithValue(errMsg);
    }
  },
);
