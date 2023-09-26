import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  connectNylas,
  createCalendar,
  deleteCalendar,
  getAllCalendars,
  getAllFolders,
  getAllMessages,
  getAllThreads,
  getContacts,
  getFolderById,
  getMoreThreads,
  getOneCalendar,
  sendMessage,
  updateCalendar,
  updateThread,
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
import { IContactResponse } from "../../interfaces/nylas/IContactResponse";
import { IFolderResponse } from "../../interfaces/nylas/IFolderResponse";

export interface GroupsState {
  data: any;
  loading: number;
  messages: IMessageResponse[] | IMessageExpandedResponse[];
  threads: IThreadResponse[] | IThreadExpandedResponse[];
  thread?: IThreadResponse;
  calendars: ICalendarResponse[];
  calendar?: ICalendarResponse;
  folders: IFolderResponse[];
  folder?: IFolderResponse;
  folderTitle: string;
  folderId: string;
  deleteCalendarResponseMessage: ICalendarDeleteResponse;
  status: "conencted" | null;
  nylasToken?: NylasConnectedPayload;
  contacts: IContactResponse[];
  loaders: {
    connecting: boolean;
    gettingThreads: boolean;
    gettingMoreThreads: boolean;
    gettingMessages: boolean;
    creatingCalendar: boolean;
    gettingCalendars: boolean;
    gettingOneCalendar: boolean;
    updatingCalendars: boolean;
    deletingCalendars: boolean;
    sendingMessage: boolean;
    updatingThread: boolean;
    gettingFolder: boolean;
  };
}

const initialState: GroupsState = {
  data: [],
  loading: 0,
  status: null,
  messages: [],
  contacts: [],
  threads: [],
  calendars: [],
  folders: [],
  folderId: "",
  folderTitle: "",
  deleteCalendarResponseMessage: {
    job_status_id: "",
  },
  loaders: {
    connecting: false,
    gettingThreads: false,
    gettingMoreThreads: false,
    gettingMessages: false,
    creatingCalendar: false,
    gettingCalendars: false,
    updatingCalendars: false,
    deletingCalendars: false,
    gettingOneCalendar: false,
    sendingMessage: false,
    updatingThread: false,
    gettingFolder: false,
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
    setFolderId: (state, action) => {
      state.folderId = action.payload;
    },
    setUpdatedThread: (state, action: PayloadAction<IThreadResponse>) => {
      const index = state.threads.findIndex((obj) => obj.id === action.payload.id);
      console.log("set updated thread", action.payload);
      if (index !== -1) {
        // Update the object with the specified id using spread syntax
        state.threads[index] = { ...state.threads[index], ...action.payload };
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

      // Get More Threads
      .addCase(getMoreThreads.pending, (state) => {
        state.loaders.gettingMoreThreads = true;
      })
      .addCase(getMoreThreads.fulfilled, (state, action) => {
        state.threads = [...state.threads, ...action.payload];
        state.loaders.gettingMoreThreads = false;
      })
      .addCase(getMoreThreads.rejected, (state) => {
        state.loaders.gettingMoreThreads = false;
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
      .addCase(sendMessage.fulfilled, (state) => {
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
      })

      // Get All Contacts
      .addCase(getContacts.pending, (state) => {
        state.loaders.gettingThreads = true;
      })
      .addCase(getContacts.fulfilled, (state, action: PayloadAction<IContactResponse[]>) => {
        state.contacts = action.payload.filter((c) => c.given_name != null);
        state.loaders.gettingThreads = false;
      })
      .addCase(getContacts.rejected, (state) => {
        state.loaders.gettingThreads = false;
      })
      // Get All Folders
      .addCase(getAllFolders.pending, (state) => {
        state.loaders.gettingThreads = true;
      })
      .addCase(getAllFolders.fulfilled, (state, action: PayloadAction<IFolderResponse[]>) => {
        state.folders = action.payload;
        state.loaders.gettingThreads = false;
      })
      .addCase(getAllFolders.rejected, (state) => {
        state.loaders.gettingThreads = false;
      })
      // get one folder
      .addCase(getFolderById.pending, (state) => {
        state.loaders.gettingFolder = true;
      })
      .addCase(getFolderById.fulfilled, (state, action: PayloadAction<IFolderResponse>) => {
        state.folder = action.payload;
        if (action.payload?.display_name.includes("/")) {
          const parts = action.payload?.display_name.split("/");
          state.folderTitle = parts[parts.length - 1];
        } else {
          state.folderTitle = action.payload.display_name;
        }
        state.loaders.gettingFolder = false;
      })
      .addCase(getFolderById.rejected, (state) => {
        state.loaders.gettingFolder = false;
      })
      // update threads
      .addCase(updateThread.pending, (state) => {
        state.loaders.updatingThread = true;
      })
      .addCase(updateThread.fulfilled, (state, action: PayloadAction<IThreadResponse>) => {
        state.thread = action.payload;
        state.loaders.updatingThread = false;
      })
      .addCase(updateThread.rejected, (state) => {
        state.loaders.updatingThread = false;
      }),
});

const nylasReducer = nylasSlice.reducer;
export const { setNylasToken, setFolderId, setUpdatedThread } = nylasSlice.actions;

export default nylasReducer;
