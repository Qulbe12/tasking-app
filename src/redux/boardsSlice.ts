import { axiosPrivate } from "./../config/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BOARD_ROUTE } from "../constants/URLS";
import { showNotification } from "@mantine/notifications";
import { BoardCreate, BoardResponse, BoardResponseDetailed } from "../interfaces/board.interface";

export const addBoard = createAsyncThunk("boards/add", async (board: BoardCreate) => {
  const res = await axiosPrivate.post<BoardResponse>(BOARD_ROUTE, board);
  return res.data;
});

export const getBoards = createAsyncThunk("boards/get", async () => {
  const res = await axiosPrivate.get<BoardResponse[]>(BOARD_ROUTE);

  return res.data;
});

export const getBoardById = createAsyncThunk("boards/getById", async (id: string) => {
  const res = await axiosPrivate.get<BoardResponseDetailed>(`${BOARD_ROUTE}/${id}`);

  return res.data;
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
        state.data?.unshift(action.payload);
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
