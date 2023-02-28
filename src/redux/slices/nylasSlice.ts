import { createSlice } from "@reduxjs/toolkit";
import { IEmailResponse } from "../../interfaces/IEmailResponse";
import { connectNylas, fetchEmails } from "../api/nylasApi";
import { showError } from "../commonSliceFunctions";

export interface GroupsState {
  data: any;
  loading: number;
  emails: IEmailResponse[];
  status: "conencted" | null;
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
  reducers: {},
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
        state.emails = action.payload;
      })
      .addCase(fetchEmails.rejected, (state, action) => {
        state.loaders.fetchingEmails = false;
        showError(action.error.message);
      }),
});

const nylasReducer = nylasSlice.reducer;

export default nylasReducer;
