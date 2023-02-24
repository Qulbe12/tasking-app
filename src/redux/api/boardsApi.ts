import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateBoard, IUpdateBoard } from "hexa-sdk";
import api from "../../config/api";

const { boardApi } = api;
const { create, get, getById, update, remove, addMembers, removeMember } = boardApi;

export const addBoard = createAsyncThunk(
  "boards/add",
  async ({ workspaceId, board }: { board: ICreateBoard; workspaceId: string }) =>
    (await create(workspaceId, board)).data,
);

export const getBoards = createAsyncThunk(
  "boards/get",
  async (workspaceId: string) => await (await get(workspaceId)).data,
);

export const getBoardById = createAsyncThunk(
  "boards/getById",
  async (id: string) => (await getById(id)).data,
);

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async (data: { id: string; board: IUpdateBoard }) => (await update(data.id, data.board)).data,
);

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async (id: string) => (await remove(id)).data,
);

export const addBoardMembers = createAsyncThunk(
  "boards/addBoardMembers",
  async ({ boardId, emails }: { boardId: string; emails: string[] }) =>
    (await addMembers(boardId, emails)).data,
);

export const removeBoardMember = createAsyncThunk(
  "boards/removeBoardMember",
  async ({ boardId, email }: { boardId: string; email: string }) =>
    (await removeMember(boardId, email)).data,
);
