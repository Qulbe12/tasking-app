import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateGroup, IUpdateGroup } from "hexa-sdk/dist/app.api";
import api from "../../config/api";

const { groupApi } = api;
const { create, get, getById, remove, update, addCcUsers, removeCcUsers } = groupApi;

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async ({ boardId, group }: { boardId: string; group: ICreateGroup }) =>
    (await create(boardId, group)).data,
);

export const getAllGroups = createAsyncThunk(
  "groups/getAllGroups",
  async (boardId: string) => (await get(boardId)).data,
);

export const getGroupById = createAsyncThunk(
  "groups/getGroupById",
  async (id: string) => (await getById(id)).data,
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id: string) => (await remove(id)).data,
);

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ id, group }: { id: string; group: IUpdateGroup }) => (await update(id, group)).data,
);

export const addUsersToGroup = createAsyncThunk(
  "groups/addUsersToGroup",
  async ({ id, emails }: { id: string; emails: string[] }) => (await addCcUsers(id, emails)).data,
);

export const removeUsersFromGroup = createAsyncThunk(
  "groups/removeUsersFromGroup",
  async ({ id, emails }: { id: string; emails: string[] }) =>
    (await removeCcUsers(id, emails)).data,
);
