import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { nylasAxios } from "../../config/nylasAxios";
import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { IErrorResponse } from "../../interfaces/IErrorResponse";

const { nylasApi } = api;
const { connect } = nylasApi;

export const connectNylas = createAsyncThunk(
  "nylas/connectNylas",
  async () => (await connect()).data,
);

export const fetchEmails = createAsyncThunk(
  "nylas/fetchEmails",
  async ({ offset, folder }: { offset: number; folder?: string }, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IEmailThreadResponse[]>("/threads", {
        params: {
          in: folder || "inbox",
        },
      });
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
