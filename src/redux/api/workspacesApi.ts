import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateWorkspace, IUpdateWorkspace } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { IWorkspaceResponse } from "../../interfaces/workspaces/IWorkspaceResponse";

const { workspaceAPi } = api;
const { create, remove, update } = workspaceAPi;

export const createWorkspace = createAsyncThunk(
  "workspaces/createWorkspace",
  async (workspace: ICreateWorkspace, { rejectWithValue, dispatch }) => {
    try {
      const res = await create(workspace);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getAllWorkSpaces = createAsyncThunk(
  "workspaces/getAllWorkSpaces",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<IWorkspaceResponse[]>("/workspaces");
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const removeWorkspace = createAsyncThunk(
  "workspaces/removeWorkspace",
  async (workSpaceId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await remove(workSpaceId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateWorkspace = createAsyncThunk(
  "workspaces/updateWorkspace",
  async (
    { workSpaceId, workspace }: { workSpaceId: string; workspace: IUpdateWorkspace },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await update(workSpaceId, workspace);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
