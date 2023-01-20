import { createAsyncThunk } from "@reduxjs/toolkit";
import { IDocumentQuery, IUpdateDocument } from "hexa-sdk";
import api from "../../config/api";

const { documentApi } = api;

const { addFiles, addUsers, create, get, getById, remove, removeUser, update } = documentApi;

export const getDocument = createAsyncThunk(
  "documents/get",
  async ({ boardId, query }: { boardId: string; query: IDocumentQuery }) =>
    (await get(boardId, query)).data,
);

export const updateDocument = createAsyncThunk(
  "documents/update",
  async ({ documentId, document }: { documentId: string; document: IUpdateDocument }) =>
    (await update(documentId, document)).data,
);
