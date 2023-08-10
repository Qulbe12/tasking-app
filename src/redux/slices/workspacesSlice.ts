import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createWorkspace,
  getAllWorkSpaces,
  removeWorkspace,
  updateWorkspace,
} from "../api/workspacesApi";
import { IWorkspaceResponse } from "../../interfaces/workspaces/IWorkspaceResponse";
import { IEntityBoard } from "../../interfaces/IEntityBoard";

export interface WorkspacesState {
  data: IWorkspaceResponse[];
  loading: boolean;
  error?: string;
  activeWorkspace?: IWorkspaceResponse;
  loaders: {
    adding: string | null;
    updating: string | null;
    deleting: string | null;
  };
}

const initialState: WorkspacesState = {
  loading: false,
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
    setActiveWorkspace: (state, action: PayloadAction<IWorkspaceResponse>) => {
      state.activeWorkspace = action.payload;
    },
    removeBoardFromWorkspace: (state, action) => {
      let workspaceIndex = 0;

      state.data.map((w, wi) => {
        w.boards.map((b) => {
          if (b.id === action.payload) {
            workspaceIndex = wi;
          }
        });
      });

      state.data[workspaceIndex] = {
        ...state.data[workspaceIndex],
        boards: state.data[workspaceIndex].boards.filter((b) => b.id !== action.payload),
      };
    },
    updateBoardFromWorkspace: (state, action) => {
      let workspaceIndex = 0;
      let boardIndex = 0;

      state.data.map((w, wi) => {
        w.boards.map((b, bi) => {
          if (b.id === action.payload.id) {
            workspaceIndex = wi;
            boardIndex = bi;
          }
        });
      });

      state.data[workspaceIndex].boards[boardIndex] = action.payload;
    },
    addBoardToWorkspace: (
      state,
      action: PayloadAction<{ workspaceId: string; board: IEntityBoard }>,
    ) => {
      const foundIndex = state.data.findIndex((w) => w.id === action.payload.workspaceId);

      if (foundIndex < 0) return;

      state.data[foundIndex].boards.push(action.payload.board);
    },
  },

  extraReducers: (builder) => {
    builder
      // Get all workspaces
      .addCase(getAllWorkSpaces.pending, (state) => {
        state.loading = true;
        state.data = [];
      })
      .addCase(getAllWorkSpaces.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getAllWorkSpaces.rejected, (state) => {
        state.loading = false;
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

export const {
  setActiveWorkspace,
  addBoardToWorkspace,
  removeBoardFromWorkspace,
  updateBoardFromWorkspace,
} = workspacesSlice.actions;

export default workspacesReducer;
