import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { showNotification } from "@mantine/notifications";
import { IBoard } from "hexa-sdk";
import { addBoard, getBoards, updateBoard } from "../api/boardsApi";

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
  extraReducers: {
    // Add Board
    [addBoard.pending.type]: (state) => {
      state.loaders.adding = "adding";
    },
    [addBoard.fulfilled.type]: (state, action) => {
      state.data?.unshift(action.payload);
      state.loaders.adding = null;
    },
    [addBoard.rejected.type]: (state, action) => {
      state.loaders.adding = null;
      state.error = action.error.message;
      showNotification({
        title: "Error",
        message: action.error.message,
      });
    },
    // Get All Boards
    [getBoards.pending.type]: (state) => {
      state.loading += 1;
    },
    [getBoards.fulfilled.type]: (state, action) => {
      state.data = action.payload;
      state.loading -= 1;
    },
    [getBoards.rejected.type]: (state, action) => {
      state.loading -= 1;
      state.error = action.error.message;
      showNotification({
        title: "Error",
        message: action.error.message,
      });
    },
    // Update Board
    [updateBoard.pending.type]: (state, action) => {
      console.log(action);
      state.loaders.updating = action.meta.arg.id;
    },
    [updateBoard.fulfilled.type]: (state, action: PayloadAction<IBoard>) => {
      state.loaders.updating = null;
      const index = state.data?.findIndex((b) => b.id === action.payload.id);
      state.data[index] = action.payload;
    },
    [updateBoard.rejected.type]: (state, action) => {
      state.loaders.updating = null;
      showNotification({
        title: "Error",
        message: action.error.message,
      });
    },
  },
});

export const { setActiveBoard } = boardsSlice.actions;

const boardsReducer = boardsSlice.reducer;

export default boardsReducer;
