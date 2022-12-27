import { axiosPrivate } from "./../config/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BOARD_ROUTE } from "../constants/URLS";
import { showNotification } from "@mantine/notifications";
import { BoardCreate, BoardResponse } from "../interfaces/board.interface";

export const addBoard = createAsyncThunk("boards/add", async (board: BoardCreate) => {
  const res = await axiosPrivate.post<{ savedBoard: BoardResponse }>(BOARD_ROUTE, board);
  return res.data;
});

export const getBoards = createAsyncThunk("boards/get", async () => {
  const res = await axiosPrivate.get(BOARD_ROUTE);
  console.log(res.data.myBoards);

  return res.data.myBoards;
});

export interface BoardsState {
  data?: BoardResponse[];
  loading: number;
  error?: string;
  activeBoard?: BoardResponse;
}

const initialState: BoardsState = {
  loading: 0,
  data: [],
};

export const boardsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveBoard: (state, action) => {
      state.activeBoard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBoard.pending, (state) => {
        state.loading += 1;
      })
      .addCase(addBoard.fulfilled, (state, action) => {
        state.data?.unshift(action.payload.savedBoard);
        state.loading -= 1;
      })
      .addCase(addBoard.rejected, (state, action) => {
        state.loading -= 1;
        state.error = action.error.message;

        showNotification({
          title: "Error",
          message: action.error.message,
        });
      })
      .addCase(getBoards.pending, (state) => {
        state.loading += 1;
      })
      .addCase(getBoards.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading -= 1;
      })
      .addCase(getBoards.rejected, (state, action) => {
        state.loading -= 1;
        state.error = action.error.message;

        showNotification({
          title: "Error",
          message: action.error.message,
        });
      });
  },
});

export const { setActiveBoard } = boardsSlice.actions;

const boardsReducer = boardsSlice.reducer;

export default boardsReducer;
