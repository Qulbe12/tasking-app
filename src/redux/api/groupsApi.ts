import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateGroup, IUpdateGroup } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

const { groupApi } = api;
const { create, get, getById, remove, update, addCcUsers, removeCcUsers } = groupApi;

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async ({ boardId, group }: { boardId: string; group: ICreateGroup }, { rejectWithValue }) => {
    try {
      const res = await create(boardId, group);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getAllGroups = createAsyncThunk(
  "groups/getAllGroups",
  async (boardId: string, { rejectWithValue }) => {
    try {
      const res = await get(boardId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getGroupById = createAsyncThunk(
  "groups/getGroupById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await getById(id);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await remove(id);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const updateGroup = createAsyncThunk(
  "groups/updateGroup",
  async ({ id, group }: { id: string; group: IUpdateGroup }, { rejectWithValue }) => {
    try {
      const res = await update(id, group);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const addUsersToGroup = createAsyncThunk(
  "groups/addUsersToGroup",
  async ({ id, emails }: { id: string; emails: string[] }, { rejectWithValue }) => {
    try {
      const res = await addCcUsers(id, emails);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const removeUsersFromGroup = createAsyncThunk(
  "groups/removeUsersFromGroup",
  async ({ id, emails }: { id: string; emails: string[] }, { rejectWithValue }) => {
    try {
      const res = await removeCcUsers(id, emails);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);
