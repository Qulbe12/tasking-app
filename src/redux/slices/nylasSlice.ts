import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { connectNylas, fetchEmails } from "../api/nylasApi";
import { showError } from "../commonSliceFunctions";
import { NylasConnectedPayload } from "hexa-sdk";

export interface GroupsState {
  data: any;
  loading: number;
  emails: IEmailThreadResponse[];
  status: "conencted" | null;
  nylasToken?: NylasConnectedPayload;
  loaders: {
    connecting: boolean;
    fetchingEmails: boolean;
  };
}

const initialState: GroupsState = {
  data: [],
  loading: 0,
  status: null,
  emails: [],
  loaders: {
    connecting: false,
    fetchingEmails: false,
  },
};

export const nylasSlice = createSlice({
  name: "nylas",
  initialState,
  reducers: {
    setNylasToken: (state, action: PayloadAction<NylasConnectedPayload | undefined>) => {
      console.log("NYLAS PAYLOAD IN ACTION: " + action.payload);
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
        console.log(action.payload);
        state.loaders.connecting = false;
        window.open(action.payload);
      })
      .addCase(connectNylas.rejected, (state, action) => {
        console.log(action.error);
        state.loaders.connecting = false;
      })
      .addCase(fetchEmails.pending, (state) => {
        state.loaders.fetchingEmails = true;
      })
      .addCase(fetchEmails.fulfilled, (state, action) => {
        state.loaders.fetchingEmails = false;
        const filteredTrashEmails = action.payload.filter(
          (e: any) => e.folders[0].name !== "permanent_trash",
        );
        state.emails = filteredTrashEmails;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loaders.fetchingEmails = false;
        showError(action.payload as string);
      }),
});

const nylasReducer = nylasSlice.reducer;
export const { setNylasToken } = nylasSlice.actions;

export default nylasReducer;
