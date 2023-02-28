import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateWorkspace, IUpdateWorkspace } from "hexa-sdk/dist/app.api";
import api from "../../config/api";

const { workspaceAPi } = api;
const { create, get, remove, update } = workspaceAPi;

export const createWorkspace = createAsyncThunk(
  "workspaces/createWorkspace",
  async (workspace: ICreateWorkspace) => (await create(workspace)).data,
);

export const getAllWorkSpaces = createAsyncThunk(
  "workspaces/getAllWorkSpaces",
  async () => (await get()).data,
);

export const removeWorkspace = createAsyncThunk(
  "workspaces/removeWorkspace",
  async (workSpaceId: string) => (await remove(workSpaceId)).data,
);

export const updateWorkspace = createAsyncThunk(
  "workspaces/updateWorkspace",
  async ({ workSpaceId, workspace }: { workSpaceId: string; workspace: IUpdateWorkspace }) =>
    (await update(workSpaceId, workspace)).data,
);
