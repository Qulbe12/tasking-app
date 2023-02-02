import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateGroup, IUpdateGroup } from "hexa-sdk/dist/group/group.dto";
import api from "../../config/api";

const { groupApi } = api;
const { addCcUsers, create, get, getById, remove, removeCcUser, update } = groupApi;

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (group: ICreateGroup) => (await create(group)).data,
);

export const getAllGroups = createAsyncThunk("groups/getAllGroups", async () => (await get()).data);

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
  async ({ id, email }: { id: string; email: string }) => (await removeCcUser(id, email)).data,
);
