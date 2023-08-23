import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  connectNylas,
  createCalendar,
  deleteCalendar,
  getAllCalendars,
  getAllMessages,
  getAllThreads,
  getOneCalendar,
  updateCalendar,
    sendMessage
} from "../api/nylasApi";
import { NylasConnectedPayload } from "hexa-sdk";
import { IThreadExpandedResponse, IThreadResponse } from "../../interfaces/nylas/IThreadResponse";
import {
  IMessageExpandedResponse,
  IMessageResponse,
} from "../../interfaces/nylas/IMessageResponse";
import {
  ICalendarDeleteResponse,
  ICalendarResponse,
} from "../../interfaces/nylas/ICalendarResponse";

export interface GroupsState {
  data: any;
  loading: number;
  messages: IMessageResponse[] | IMessageExpandedResponse[];
  threads: IThreadResponse[] | IThreadExpandedResponse[];
  calendars: ICalendarResponse[];
  calendar?: ICalendarResponse;
  deleteCalendarResponseMessage: ICalendarDeleteResponse;
  status: "conencted" | null;
  nylasToken?: NylasConnectedPayload;
  loaders: {
    connecting: boolean;

    gettingThreads: boolean;
    gettingMessages: boolean;
    creatingCalendar: boolean;
    gettingCalendars: boolean;
    gettingOneCalendar: boolean;
    updatingCalendars: boolean;
    deletingCalendars: boolean;
    sendingMessage: boolean;
  };
}

const initialState: GroupsState = {
  data: [],
  loading: 0,
  status: null,
  messages: [],
  threads: [],
  calendars: [],
  deleteCalendarResponseMessage: {
    job_status_id: "",
  },
  loaders: {
    connecting: false,
    gettingThreads: false,
    gettingMessages: false,
    creatingCalendar: false,
    gettingCalendars: false,
    updatingCalendars: false,
    deletingCalendars: false,
    gettingOneCalendar: false,
    sendingMessage: false,
  },
};

export const nylasSlice = createSlice({
  name: "nylas",
  initialState,
  reducers: {
    setNylasToken: (state, action: PayloadAction<NylasConnectedPayload | undefined>) => {
      state.nylasToken = action.payload;
      if (action.payload) {
        localStorage.setItem("nylasToken", action.payload?.access_token);
      }
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(connectNylas.pending, (state) => {
        state.loaders.connecting = true;
      })
      .addCase(connectNylas.fulfilled, (state, action) => {
        state.loaders.connecting = false;
        window.open(action.payload);
      })
      .addCase(connectNylas.rejected, (state) => {
        state.loaders.connecting = false;
      })

      // Get All Threads
      .addCase(getAllThreads.pending, (state) => {
        state.loaders.gettingThreads = true;
      })
      .addCase(getAllThreads.fulfilled, (state, action) => {
        state.threads = action.payload;
        state.loaders.gettingThreads = false;
      })
      .addCase(getAllThreads.rejected, (state) => {
        state.loaders.gettingThreads = false;
      })

      // Get All Messages
      .addCase(getAllMessages.pending, (state) => {
        state.loaders.gettingMessages = true;
      })
      .addCase(getAllMessages.fulfilled, (state, action) => {
        state.messages = action.payload;
        state.loaders.gettingMessages = false;
      })
      .addCase(getAllMessages.rejected, (state) => {
        state.loaders.gettingMessages = false;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loaders.sendingMessage = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        console.log(action.payload);

        state.loaders.sendingMessage = false;
      })
      .addCase(sendMessage.rejected, (state) => {
        state.loaders.sendingMessage = false;
      })
      // create calendar
      .addCase(createCalendar.pending, (state) => {
        state.loaders.creatingCalendar = true;
      })
      .addCase(
        createCalendar.fulfilled,
        (state, { payload: calendar }: PayloadAction<ICalendarResponse>) => {
          state.calendar = calendar;
          state.loaders.creatingCalendar = false;
        },
      )
      .addCase(createCalendar.rejected, (state) => {
        state.loaders.creatingCalendar = false;
      })
      // get one calendar
      .addCase(getOneCalendar.pending, (state) => {
        state.loaders.gettingOneCalendar = true;
      })
      .addCase(
        getOneCalendar.fulfilled,
        (state, { payload: calendar }: PayloadAction<ICalendarResponse>) => {
          state.calendar = calendar;
          state.loaders.gettingOneCalendar = false;
        },
      )
      .addCase(getOneCalendar.rejected, (state) => {
        state.loaders.gettingOneCalendar = false;
      })
      // get all calendars
      .addCase(getAllCalendars.pending, (state) => {
        state.loaders.gettingCalendars = true;
      })
      .addCase(
        getAllCalendars.fulfilled,
        (state, { payload: calendar }: PayloadAction<ICalendarResponse[]>) => {
          state.calendars = calendar;
          state.loaders.gettingCalendars = false;
        },
      )
      .addCase(getAllCalendars.rejected, (state) => {
        state.loaders.gettingCalendars = false;
      })
      // update calendar
      .addCase(updateCalendar.pending, (state) => {
        state.loaders.updatingCalendars = true;
      })
      .addCase(
        updateCalendar.fulfilled,
        (state, { payload: calendar }: PayloadAction<ICalendarResponse>) => {
          state.calendar = calendar;
          state.loaders.updatingCalendars = false;
        },
      )
      .addCase(updateCalendar.rejected, (state) => {
        state.loaders.updatingCalendars = false;
      })
      // delete calendar
      .addCase(deleteCalendar.pending, (state) => {
        state.loaders.deletingCalendars = true;
      })
      .addCase(
        deleteCalendar.fulfilled,
        (state, { payload: message }: PayloadAction<ICalendarDeleteResponse>) => {
          state.deleteCalendarResponseMessage = message;
          state.loaders.deletingCalendars = false;
        },
      )
      .addCase(deleteCalendar.rejected, (state) => {
        state.loaders.deletingCalendars = false;
      }),
});

const nylasReducer = nylasSlice.reducer;
export const { setNylasToken } = nylasSlice.actions;

export default nylasReducer;
