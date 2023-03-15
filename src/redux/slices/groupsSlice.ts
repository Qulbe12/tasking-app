import { createSlice } from "@reduxjs/toolkit";
import { IGroup } from "hexa-sdk/dist/app.api";
import { createGroup } from "../api/groupsApi";
import { showError } from "../commonSliceFunctions";

// TODO: handle errors
export interface GroupsState {
  data: IGroup[];
  loading: number;
  error?: string;
  ccUsers?: any;
  loaders: {
    adding: boolean;
  };
}

const initialState: GroupsState = {
  loading: 0,
  data: [],
  loaders: {
    adding: false,
  },
};

export const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(createGroup.pending, (state) => {
        state.loaders.adding = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
        state.loaders.adding = false;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loaders.adding = false;
        console.log(action.error.message);
        showError("Something went wrong");
      }),
});

const groupsReducer = groupsSlice.reducer;

export default groupsReducer;
