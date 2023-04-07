import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateBoard, IUpdateBoard } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

const { boardApi } = api;
const { create, get, getById, update, remove, addMembers, removeMember } = boardApi;

export const addBoard = createAsyncThunk(
  "boards/add",
  async (
    { workspaceId, board }: { board: ICreateBoard; workspaceId: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await create(workspaceId, board);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getBoards = createAsyncThunk(
  "boards/get",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const res = await get(workspaceId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getBoardById = createAsyncThunk(
  "boards/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getById(id);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async (data: { id: string; board: IUpdateBoard }, { rejectWithValue }) => {
    try {
      const res = await update(data.id, data.board);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await remove(id);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const addBoardMembers = createAsyncThunk(
  "boards/addBoardMembers",
  async ({ boardId, emails }: { boardId: string; emails: string[] }, { rejectWithValue }) => {
    try {
      const res = await addMembers(boardId, emails);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const removeBoardMember = createAsyncThunk(
  "boards/removeBoardMember",
  async ({ boardId, email }: { boardId: string; email: string }, { rejectWithValue }) => {
    try {
      const res = await removeMember(boardId, email);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);
