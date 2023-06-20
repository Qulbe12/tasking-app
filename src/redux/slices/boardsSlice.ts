import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoard } from "hexa-sdk/dist/app.api";
import {
  addBoard,
  addBoardMembers,
  deleteBoard,
  getBoardById,
  getBoards,
  removeBoardMember,
  updateBoard,
} from "../api/boardsApi";
import { showError } from "../commonSliceFunctions";

export interface BoardsState {
  data: IBoard[];
  loading: boolean;
  error?: string;
  activeBoard?: IBoard | null;
  loaders: {
    gettingById: boolean | null;
    adding: string | null;
    updating: string | null;
    deleting: string | null;
    addingMembers: boolean;
    removingMember: boolean;
  };
}

const initialState: BoardsState = {
  loading: false,
  data: [],
  loaders: {
    gettingById: null,
    adding: null,
    updating: null,
    deleting: null,
    addingMembers: false,
    removingMember: false,
  },
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<IBoard | null>) => {
      state.activeBoard = action.payload;
    },
    updateSocketBoard: (state, action: PayloadAction<IBoard>) => {
      const index = state.data.findIndex((b) => b.id === action.payload.id);
      state.data[index] = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Add Board
    builder
      .addCase(addBoard.pending, (state) => {
        state.loaders.adding = "adding";
      })
      .addCase(addBoard.fulfilled, (state, action) => {
        state.data?.unshift(action.payload);
        state.loaders.adding = null;
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.loaders.adding = null;
        state.error = action.error.message;
        showError(action.error.message);
      })
      // Get All Boards
      .addCase(getBoards.pending, (state) => {
        state.loading = true;
        state.data = [];
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.loading = false;
        state.loaders.adding = null;
        state.error = action.error.message;
        showError(action.error.message);
      }) // Get Board By Id
      .addCase(getBoardById.pending, (state) => {
        state.loaders.gettingById = true;
        state.activeBoard = null;
      })
      .addCase(getBoardById.fulfilled, (state, action) => {
        state.activeBoard = action.payload;
        state.loaders.gettingById = false;
      })
      .addCase(getBoardById.rejected, (state, action) => {
        state.loaders.gettingById = false;
        state.error = action.error.message;
        showError(action.error.message);
      })
      // Update Board
      .addCase(updateBoard.pending, (state, action) => {
        state.loaders.updating = action.meta.arg.id;
      })
      .addCase(updateBoard.fulfilled, (state, action) => {
        state.loaders.updating = null;
        const index = state.data?.findIndex((b) => b.id === action.payload.id);
        state.data[index] = action.payload;
      })
      .addCase(updateBoard.rejected, (state, action) => {
        state.loaders.adding = null;
        state.error = action.error.message;
        showError(action.error.message);
      })
      // Delete Board
      .addCase(deleteBoard.pending, (state, action) => {
        state.loaders.deleting = action.meta.arg;
      })
      .addCase(deleteBoard.fulfilled, (state, action) => {
        state.loaders.deleting = null;
        const index = state.data?.findIndex((b) => b.id === action.payload.id);
        state.data.splice(index, 1);
      })
      .addCase(deleteBoard.rejected, (state, action) => {
        state.loaders.deleting = null;
        state.error = action.error.message;
        showError(action.error.message);
      })
      .addCase(addBoardMembers.pending, (state) => {
        state.loaders.addingMembers = true;
      })
      .addCase(addBoardMembers.fulfilled, (state, action) => {
        state.loaders.addingMembers = false;
        const foundIndex = state.data.findIndex((b) => b.id === action.payload.id);

        if (foundIndex) {
          state.data[foundIndex].members = action.payload.members;
        }
        state.activeBoard = action.payload;
      })
      .addCase(addBoardMembers.rejected, (state, action) => {
        state.loaders.addingMembers = false;
        state.error = action.error.message;
        showError(action.error.message);
      })
      .addCase(removeBoardMember.pending, (state) => {
        state.loaders.removingMember = true;
      })
      .addCase(removeBoardMember.fulfilled, (state, action) => {
        state.loaders.removingMember = false;
        const foundIndex = state.data.findIndex((b) => b.id === action.payload.id);

        if (foundIndex) {
          state.data[foundIndex].members = action.payload.members;
        }
        state.activeBoard = action.payload;
      })
      .addCase(removeBoardMember.rejected, (state, action) => {
        state.loaders.removingMember = false;
        state.error = action.error.message;
        showError(action.error.message);
      });
  },
});

export const { setActiveBoard, updateSocketBoard } = boardsSlice.actions;

const boardsReducer = boardsSlice.reducer;

export default boardsReducer;
