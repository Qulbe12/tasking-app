import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateWorkspace, IUpdateWorkspace } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

const { workspaceAPi } = api;
const { create, get, remove, update } = workspaceAPi;

export const createWorkspace = createAsyncThunk(
  "workspaces/createWorkspace",
  async (workspace: ICreateWorkspace, { rejectWithValue }) => {
    try {
      const res = await create(workspace);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getAllWorkSpaces = createAsyncThunk(
  "workspaces/getAllWorkSpaces",
  async (_, { rejectWithValue }) => {
    try {
      const res = await get();
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const removeWorkspace = createAsyncThunk(
  "workspaces/removeWorkspace",
  async (workSpaceId: string, { rejectWithValue }) => {
    try {
      const res = await remove(workSpaceId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const updateWorkspace = createAsyncThunk(
  "workspaces/updateWorkspace",
  async (
    { workSpaceId, workspace }: { workSpaceId: string; workspace: IUpdateWorkspace },
    { rejectWithValue },
  ) => {
    try {
      const res = await update(workSpaceId, workspace);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);
