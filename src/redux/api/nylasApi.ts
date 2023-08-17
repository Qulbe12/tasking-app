import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { nylasAxios } from "../../config/nylasAxios";
import { IErrorResponse } from "../../interfaces/IErrorResponse";
import { IMessageResponse } from "../../interfaces/nylas/IMessageResponse";
import { ISendMessage } from "../../interfaces/nylas/ISendMessage";
import generateQueryString from "../../utils/generateQueryString";
import { IThreadExpandedResponse, IThreadResponse } from "../../interfaces/nylas/IThreadResponse";

const { nylasApi } = api;
const { connect } = nylasApi;

type BaseArgs = {
  view?: "ids" | "count" | "expanded";
  limit?: number;
  offset?: number;
  subject?: string;
  // Return emails that have been sent or received from this comma-separated list of email addresses. For example- mail1@mail.com,mail2@mail.com. A maximum of 25 emails may be specified
  any_email?: string;
  to?: string;
  from?: string;
  cc?: string;
  bcc?: string;
  // name, display name or id
  in?: string;
  not_in?: string;
  unread?: boolean;
  starred?: boolean;
  filename?: string;
};

type GetAllMessagesArgs = {
  thread_id?: string;
  received_before?: number;
  received_after?: number;
  has_attachment?: boolean;
} & BaseArgs;

type GetAllThreadsArgs = {
  last_message_before?: string;
  last_message_after?: string;
  started_before?: string;
  started_after?: string;
  last_updated_before?: string;
  last_updated_after?: string;
  last_updated_timestamp?: string;
} & BaseArgs;

export const connectNylas = createAsyncThunk(
  "nylas/connectNylas",
  async () => (await connect()).data,
);

export const getAllMessages = createAsyncThunk(
  "nylas/getAllMessages",
  async (args: GetAllMessagesArgs, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IMessageResponse[]>(`/messages${generateQueryString(args)}`);
      console.log(res.data);

      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getMessageById = createAsyncThunk(
  "nylas/getMessageById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IMessageResponse>(`/messages/${id}`);
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const sendMessage = createAsyncThunk(
  "nylas/sendMessage",
  async (message: ISendMessage, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.post<IMessageResponse>("/send", message);
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getAllThreads = createAsyncThunk(
  "nylas/getAllThreads",
  async (args: GetAllThreadsArgs, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IThreadResponse[] | IThreadExpandedResponse[]>(
        `/threads${generateQueryString(args)}`,
      );
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getThreadById = createAsyncThunk(
  "nylas/getMessageById",
  async ({ id, view }: { id: string; view: "id" | "count" | "expanded" }, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IMessageResponse>(
        `/threads/${id}${generateQueryString({ view })}`,
      );
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
