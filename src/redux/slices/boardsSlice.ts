import { createSlice } from "@reduxjs/toolkit";
import { IBoard } from "hexa-sdk";
import { addBoard, deleteBoard, getBoards, updateBoard } from "../api/boardsApi";
import { showError } from "../commonSliceFunctions";

export interface BoardsState {
  data: IBoard[];
  loading: number;
  error?: string;
  activeBoard?: IBoard;
  loaders: {
    adding: string | null;
    updating: string | null;
    deleting: string | null;
  };
}

const initialState: BoardsState = {
  loading: 0,
  data: [],
  loaders: {
    adding: null,
    updating: null,
    deleting: null,
  },
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoard: (state, action) => {
      state.activeBoard = action.payload;
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
        state.loading += 1;
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading -= 1;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.loading -= 1;
        state.loaders.adding = null;
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
      });
  },
});

export const { setActiveBoard } = boardsSlice.actions;

const boardsReducer = boardsSlice.reducer;

export default boardsReducer;
