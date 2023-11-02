import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  addBoard,
  addBoardMembers,
  deleteBoard,
  getAllSharedBoards,
  getBoardById,
  getBoards,
  removeBoardMember,
  updateBoard,
} from "../api/boardsApi";
import { showError } from "../commonSliceFunctions";
import IBoardResponse from "../../interfaces/boards/IBoardResponse";

export interface BoardsState {
  data: IBoardResponse[];
  loading: boolean;
  error?: string;
  activeBoard?: IBoardResponse | null;
  sharedBoards: IBoardResponse[];
  loaders: {
    gettingById: boolean | null;
    adding: string | null;
    updating: string | null;
    deleting: string | null;
    addingMembers: boolean;
    removingMember: boolean;
    gettingSharedBoards: boolean;
  };
}

const initialState: BoardsState = {
  loading: false,
  data: [],
  sharedBoards: [],
  loaders: {
    gettingById: null,
    adding: null,
    updating: null,
    deleting: null,
    addingMembers: false,
    removingMember: false,
    gettingSharedBoards: false,
  },
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setActiveBoard: (state, action: PayloadAction<IBoardResponse | null>) => {
      state.activeBoard = action.payload;
    },
    updateSocketBoard: (state, action: PayloadAction<IBoardResponse>) => {
      const index = state.data.findIndex((b) => b.id === action.payload.id);
      state.data[index] = action.payload;
    },
    resetBoardLoaders: (state) => {
      state.loaders.adding = null;
      state.loaders.gettingById = null;
      state.loaders.updating = null;
      state.loaders.deleting = null;
      state.loaders.addingMembers = false;
      state.loaders.removingMember = false;
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
        state.activeBoard = action.payload;
      })
      .addCase(removeBoardMember.rejected, (state, action) => {
        state.loaders.removingMember = false;
        state.error = action.error.message;
        showError(action.error.message);
      })
      // get all shared boards
      .addCase(getAllSharedBoards.pending, (state) => {
        state.loaders.gettingSharedBoards = true;
      })
      .addCase(
        getAllSharedBoards.fulfilled,
        (state, { payload }: PayloadAction<IBoardResponse[]>) => {
          state.loaders.gettingSharedBoards = false;
          state.sharedBoards = payload;
        },
      )
      .addCase(getAllSharedBoards.rejected, (state, action) => {
        state.loaders.gettingSharedBoards = false;
        state.error = action.error.message;
        showError(action.error.message);
      });
  },
});

export const { setActiveBoard, updateSocketBoard, resetBoardLoaders } = boardsSlice.actions;

const boardsReducer = boardsSlice.reducer;

export default boardsReducer;
