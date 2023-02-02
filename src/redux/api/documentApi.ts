import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateDocument, IDocumentQuery, IUpdateDocument } from "hexa-sdk";
import api from "../../config/api";

const { documentApi } = api;

const { addFiles, addUsers, create, get, getById, remove, removeUser, update } = documentApi;

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async ({ boardId, document }: { boardId: string; document: ICreateDocument & any }) => {
    console.log("Create Document Action");

    const res = await create(boardId, document);
    console.log(res.data);
    return res.data;
  },
);

export const getDocuments = createAsyncThunk(
  "documents/getDocuments",
  async ({ boardId, query }: { boardId: string; query: IDocumentQuery }) =>
    (await get(boardId, query)).data,
);

export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async ({ documentId, document }: { documentId: string; document: IUpdateDocument }) =>
    (await update(documentId, document)).data,
);

export const addDocumentFiles = createAsyncThunk(
  "documents/addDocumentFiles",
  async ({ documentId, attachment }: { documentId: string; attachment: File }) =>
    (await addFiles(documentId, attachment)).data,
);

export const addDocumentUsers = createAsyncThunk(
  "documents/addDocumentUsers",
  async ({
    documentId,
    type,
    emails,
  }: {
    documentId: string;
    type: "ccUsers" | "assignedUsers";
    // TODO: Fix BE should be string[] and not never
    emails: any;
  }) => (await addUsers(documentId, type, emails)).data,
);

export const getDocumentById = createAsyncThunk(
  "documents/getDocumentById",
  async ({ documentId }: { documentId: string }) => (await getById(documentId)).data,
);

export const removeDocument = createAsyncThunk(
  "documents/removeDocument",
  async ({ documentId }: { documentId: string }) => (await remove(documentId)).data,
);

export const removeDocumentUser = createAsyncThunk(
  "documents/removeUser",
  async ({
    documentId,
    type,
    email,
  }: {
    documentId: string;
    type: "ccUsers" | "assignedUsers";
    email: string;
  }) => (await removeUser(documentId, type, email)).data,
);
