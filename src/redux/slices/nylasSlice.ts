import { createSlice } from "@reduxjs/toolkit";
import { connectNylas } from "../api/nylasApi";

export interface GroupsState {
  data: any;
  loading: number;
  status: "conencted" | null;
  loaders: {
    connecting: boolean;
  };
}

const initialState: GroupsState = {
  data: [],
  loading: 0,
  status: null,
  loaders: {
    connecting: false,
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
      }),
});

const nylasReducer = nylasSlice.reducer;

export default nylasReducer;
