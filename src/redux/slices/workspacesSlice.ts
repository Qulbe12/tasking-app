import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import {
  createWorkspace,
  getAllWorkSpaces,
  removeWorkspace,
  updateWorkspace,
} from "../api/workspacesApi";

export interface WorkspacesState {
  data: IWorkspace[];
  loading: number;
  error?: string;
  activeWorkspace?: IWorkspace;
  loaders: {
    adding: string | null;
    updating: string | null;
    deleting: string | null;
  };
}

const initialState: WorkspacesState = {
  loading: 0,
  data: [],
  loaders: {
    adding: null,
    updating: null,
    deleting: null,
  },
};

export const workspacesSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    setActiveWorkspace: (state, action: PayloadAction<IWorkspace>) => {
      state.activeWorkspace = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get all workspaces
      .addCase(getAllWorkSpaces.pending, (state) => {
        state.loading += 1;
        state.data = [];
      })
      .addCase(getAllWorkSpaces.fulfilled, (state, action) => {
        state.loading -= 1;
        state.data = action.payload;
      })
      .addCase(getAllWorkSpaces.rejected, (state) => {
        state.loading -= 1;
      })
      // Create Workspace
      .addCase(createWorkspace.pending, (state) => {
        state.loaders.adding = "adding";
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loaders.adding = null;
        state.data.push(action.payload);
      })
      .addCase(createWorkspace.rejected, (state) => {
        state.loaders.adding = null;
      })
      // Delete Workspace
      .addCase(removeWorkspace.pending, (state, action) => {
        state.loaders.deleting = action.meta.arg;
      })
      .addCase(removeWorkspace.fulfilled, (state, action) => {
        state.loaders.deleting = null;
        const foundIndex = state.data.findIndex((w) => w.id === action.payload.id);
        state.data.splice(foundIndex, 1);
      })
      .addCase(removeWorkspace.rejected, (state) => {
        state.loaders.deleting = null;
      })
      //
      .addCase(updateWorkspace.pending, (state, action) => {
        state.loaders.updating = action.meta.arg.workSpaceId;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.loaders.updating = null;
        const foundIndex = state.data.findIndex((w) => w.id === action.payload.id);
        state.data[foundIndex] = action.payload;
      })
      .addCase(updateWorkspace.rejected, (state) => {
        state.loaders.updating = null;
      });
  },
});

const workspacesReducer = workspacesSlice.reducer;

export const { setActiveWorkspace } = workspacesSlice.actions;

export default workspacesReducer;
