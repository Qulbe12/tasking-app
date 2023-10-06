import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  connectNylas,
  createCalendar,
  createContact,
  createEvent,
  deleteCalendar,
  deleteContact,
  deleteEvent,
  getAllCalendars,
  getAllFolders,
  getAllMessages,
  getAllThreads,
  getContacts,
  getEventById,
  getEvents,
  getFolderById,
  getMoreThreads,
  getOneCalendar,
  sendMessage,
  updateCalendar,
  updateContact,
  updateEvent,
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
import { IContactRemapped, IContactResponse } from "../../interfaces/nylas/IContactResponse";
import { IFolderResponse } from "../../interfaces/nylas/IFolderResponse";
import { IEventResponse } from "../../interfaces/nylas/IEventResponse";
import { Event } from "react-big-calendar";
import _ from "lodash";
import { IContact } from "../../interfaces/nylas/IContact";

export interface GroupsState {
  data: any;
  loading: number;
  messages: IMessageResponse[] | IMessageExpandedResponse[];
  threads: IThreadExpandedResponse[];
  thread?: IThreadResponse;
  calendars: ICalendarResponse[];
  calendar?: ICalendarResponse;
  folders: IFolderResponse[];
  folder?: IFolderResponse;
  folderTitle: string;
  folderId: string;
  deleteCalendarResponseMessage: ICalendarDeleteResponse;
  events: IEventResponse[];
  calendarEvents: Event[];
  event?: IEventResponse;
  status: "conencted" | null;
  nylasToken?: NylasConnectedPayload;
  nylasContacts: IContact[];
  contacts: IContactRemapped[];
  targetedContact: IContact | null;
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
    gettingEvents: boolean;
    creatingEvent: boolean;
    gettingContacts: boolean;
    creatingContact: boolean;
    deletingContact: boolean;
    updatingContact: boolean;
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
  events: [],
  calendarEvents: [],
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
    gettingEvents: false,
    creatingEvent: false,
    gettingContacts: false,
    creatingContact: false,
    deletingContact: false,
    updatingContact: false,
    updatingThread: false,
    gettingFolder: false,
  },
  nylasContacts: [],
  targetedContact: null,
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
      if (index !== -1) {
        state.threads[index] = { ...state.threads[index], ...action.payload };
      }
    },
    setNylasContacts(state, action: PayloadAction<IContact[]>) {
      state.nylasContacts = action.payload;
    },
    setTargetedContact(state, action: PayloadAction<IContact | null>) {
      state.targetedContact = action.payload;
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
      // get all events
      .addCase(getEvents.pending, (state) => {
        state.loaders.gettingEvents = true;
      })
      .addCase(
        getEvents.fulfilled,
        (state, { payload: events }: PayloadAction<IEventResponse[]>) => {
          state.events = events;
          state.calendarEvents = events.map((e) => {
            const unixStartTimestamp = parseInt(e?.when?.start_time?.toString() || "0", 10);
            const startDate = new Date(unixStartTimestamp * 1000);
            const unixEndTimestamp = parseInt(e?.when?.end_time?.toString(), 10);
            const endDate = new Date(unixEndTimestamp * 1000);
            const event: Event = {
              start: startDate,
              end: endDate,
              title: e.title,
            };
            return event;
          });
          state.loaders.gettingEvents = false;
        },
      )
      .addCase(getEvents.rejected, (state) => {
        state.loaders.gettingEvents = false;
      })
      // get one event
      .addCase(getEventById.pending, (state) => {
        state.loaders.gettingEvents = true;
      })
      .addCase(
        getEventById.fulfilled,
        (state, { payload: event }: PayloadAction<IEventResponse>) => {
          state.event = event;
          state.loaders.gettingEvents = false;
        },
      )
      .addCase(getEventById.rejected, (state) => {
        state.loaders.gettingEvents = false;
      })
      // create event
      .addCase(createEvent.pending, (state) => {
        state.loaders.creatingEvent = true;
      })
      .addCase(
        createEvent.fulfilled,
        (state, { payload: event }: PayloadAction<IEventResponse>) => {
          state.events.push(event);
          state.loaders.creatingEvent = false;
        },
      )
      .addCase(createEvent.rejected, (state) => {
        state.loaders.creatingEvent = false;
      })
      // update calendar
      .addCase(updateEvent.pending, (state) => {
        state.loaders.gettingEvents = true;
      })
      .addCase(
        updateEvent.fulfilled,
        (state, { payload: event }: PayloadAction<IEventResponse>) => {
          state.event = event;
          state.loaders.gettingEvents = false;
        },
      )
      .addCase(updateEvent.rejected, (state) => {
        state.loaders.gettingEvents = false;
      })
      // delete calendar
      .addCase(deleteEvent.pending, (state) => {
        state.loaders.gettingEvents = true;
      })
      .addCase(deleteEvent.fulfilled, (state) => {
        state.loaders.gettingEvents = false;
      })
      .addCase(deleteEvent.rejected, (state) => {
        state.loaders.gettingEvents = false;
      })
      // Get All Contacts
      .addCase(getContacts.pending, (state) => {
        state.loaders.gettingContacts = true;
      })
      .addCase(getContacts.fulfilled, (state, action: PayloadAction<IContactResponse[]>) => {
        const contacts = action.payload.filter((c) => c.given_name != null);
        state.contacts = contacts.map((c) => {
          return {
            id: c.id,
            email: c.emails[0].email,
            name: _.startCase(`${c.given_name} ${c.surname}`),
          };
        });
        state.loaders.gettingContacts = false;
        state.nylasContacts = action.payload as IContact[];
      })
      .addCase(getContacts.rejected, (state) => {
        state.loaders.gettingContacts = false;
      })
      // create contact
      .addCase(createContact.pending, (state) => {
        state.loaders.creatingContact = true;
      })
      .addCase(createContact.fulfilled, (state, action: PayloadAction<IContact>) => {
        const contact = action.payload;
        const mappedContact: IContactRemapped = {
          id: contact.id,
          email: contact.emails[0].email,
          name: _.startCase(`${contact.given_name} ${contact.surname}`),
        };
        state.contacts.push(mappedContact);
        state.loaders.creatingContact = false;
        state.nylasContacts.push(action.payload);
      })
      .addCase(createContact.rejected, (state) => {
        state.loaders.creatingContact = false;
      })
      // update contact
      .addCase(updateContact.pending, (state) => {
        state.loaders.updatingContact = true;
      })
      .addCase(updateContact.fulfilled, (state, action: PayloadAction<IContact>) => {
        const contact = action.payload;
        const mappedContact: IContactRemapped = {
          id: contact.id,
          email: contact.emails[0].email,
          name: _.startCase(`${contact.given_name} ${contact.surname}`),
        };

        state.contacts = state.contacts.map((existing) =>
          existing.id === contact.id ? mappedContact : existing,
        );
        state.loaders.updatingContact = false;
        state.nylasContacts = state.nylasContacts.map((existing) =>
          existing.id === contact.id ? contact : existing,
        );
      })
      .addCase(updateContact.rejected, (state) => {
        state.loaders.updatingContact = false;
      })
      // delete contact
      .addCase(deleteContact.pending, (state) => {
        state.loaders.deletingContact = true;
      })
      .addCase(deleteContact.fulfilled, (state, action: PayloadAction<string>) => {
        state.loaders.deletingContact = false;
        state.nylasContacts = state.nylasContacts.filter((x) => x.id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state) => {
        state.loaders.deletingContact = false;
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
export const { setTargetedContact, setNylasToken, setFolderId, setUpdatedThread } =
  nylasSlice.actions;

export default nylasReducer;
