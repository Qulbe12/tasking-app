import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { nylasAxios } from "../../config/nylasAxios";
import { IErrorResponse } from "../../interfaces/IErrorResponse";
import { IMessageResponse } from "../../interfaces/nylas/IMessageResponse";
import { ISendMessage } from "../../interfaces/nylas/ISendMessage";
import generateQueryString from "../../utils/generateQueryString";
import { IThreadExpandedResponse, IThreadResponse } from "../../interfaces/nylas/IThreadResponse";
import { ICalendar } from "../../interfaces/nylas/ICalendar";
import {
  ICalendarDeleteResponse,
  ICalendarResponse,
} from "../../interfaces/nylas/ICalendarResponse";
import { showNotification } from "@mantine/notifications";
import { IContactResponse } from "../../interfaces/nylas/IContactResponse";
import { IFolderResponse } from "../../interfaces/nylas/IFolderResponse";
import { setUpdatedThread } from "../slices/nylasSlice";

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

export type GetAllThreadsArgs = {
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
      showNotification({
        message: "Email Sent",
      });
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

export const getMoreThreads = createAsyncThunk(
  "nylas/getMoreThreads",
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
export const updateThread = createAsyncThunk(
  "nylas/updateThread",
  async (
    {
      starred,
      folder_id,
      id,
    }: {
      unread?: boolean;
      starred: boolean;
      label_ids?: [string];
      folder_id: string;
    } & { id: string | null | undefined },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await nylasAxios.put<IThreadResponse>(`/threads/${id}`, {
        starred: starred,
        folder_id: folder_id,
      });
      dispatch(setUpdatedThread(res.data));
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const createCalendar = createAsyncThunk(
  "nylas/createCalendar",
  async (calendar: ICalendar, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.post<ICalendarResponse>("/calendars", calendar);
      return res.data;
    } catch (e) {
      const error = e as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
export const getOneCalendar = createAsyncThunk(
  "nylas/getOneCalendar",
  async ({ calendarId }: { calendarId: string }, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<ICalendarResponse>(`/calendars/${calendarId}`);
      return res.data;
    } catch (e) {
      const error = e as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
export const getAllCalendars = createAsyncThunk(
  "nylas/getAllCalendars",
  async (arg, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<ICalendarResponse[]>("/calendars");
      return res.data;
    } catch (e) {
      const error = e as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
export const updateCalendar = createAsyncThunk(
  "nylas/updateCalendar",
  async (
    { calendarId, calendar }: { calendarId: string; calendar: ICalendar },
    { rejectWithValue },
  ) => {
    try {
      const res = await nylasAxios.put<ICalendarResponse>(`/calendars/${calendarId}`, calendar);
      return res.data;
    } catch (e) {
      const error = e as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
export const deleteCalendar = createAsyncThunk(
  "nylas/deleteCalendar",
  async ({ calendarId }: { calendarId: string }, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.delete<ICalendarDeleteResponse>(`/calendars/${calendarId}`);
      return res.data;
    } catch (e) {
      const error = e as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getCalendars = createAsyncThunk(
  "nylas/getCalendars",
  async (args, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<ICalendarResponse[]>("/calendars");

      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getContacts = createAsyncThunk(
  "nylas/getContacts",
  async (args, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IContactResponse[]>("/contacts");

      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);

export const getAllFolders = createAsyncThunk(
  "nylas/getAllFolders",
  async (args, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IFolderResponse[]>("/folders");

      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
export const getFolderById = createAsyncThunk(
  "nylas/getFolderById",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const res = await nylasAxios.get<IFolderResponse>(`/folders/${id}`);
      return res.data;
    } catch (err) {
      const error = err as unknown as IErrorResponse;
      return rejectWithValue(error.response?.data.message);
    }
  },
);
