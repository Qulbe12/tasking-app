import { createAsyncThunk } from "@reduxjs/toolkit";
import { ICreateDocument, IDocumentQuery, IUpdateDocument } from "hexa-sdk/dist/app.api";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";

const { documentApi } = api;

const {
  addFiles,
  addUsers,
  create,
  get,
  getById,
  removeUser,
  update,
  addLinkedDocs,
  removeLinkedDocs,
} = documentApi;

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async (
    { boardId, document }: { boardId: string; document: ICreateDocument & any },
    { rejectWithValue },
  ) => {
    try {
      const res = await create(boardId, document);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getDocuments = createAsyncThunk(
  "documents/getDocuments",
  async ({ boardId, query }: { boardId: string; query: IDocumentQuery }, { rejectWithValue }) => {
    try {
      const res = await get(boardId, query);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async (
    { documentId, document }: { documentId: string; document: IUpdateDocument },
    { rejectWithValue },
  ) => {
    try {
      const res = await update(documentId, document);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const addDocumentFiles = createAsyncThunk(
  "documents/addDocumentFiles",
  async (
    { documentId, attachment }: { documentId: string; attachment: FileList },
    { rejectWithValue },
  ) => {
    try {
      const res = await addFiles(documentId, attachment);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const addDocumentUsers = createAsyncThunk(
  "documents/addDocumentUsers",
  async (
    {
      documentId,
      type,
      emails,
    }: {
      documentId: string;
      type: "ccUsers" | "assignedUsers";
      emails: any;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await addUsers(documentId, type, emails);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const getDocumentById = createAsyncThunk(
  "documents/getDocumentById",
  async ({ documentId }: { documentId: string }, { rejectWithValue }) => {
    try {
      const res = await getById(documentId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const removeDocumentUser = createAsyncThunk(
  "documents/removeUser",
  async (
    {
      documentId,
      type,
      email,
    }: {
      documentId: string;
      type: "ccUsers" | "assignedUsers";
      email: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await removeUser(documentId, type, email);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const addLinkedDocsAction = createAsyncThunk(
  "documents/addLinkedDoc",
  async (
    { documentId, documentsToLink }: { documentId: string; documentsToLink: string[] },
    { rejectWithValue },
  ) => {
    try {
      const res = await addLinkedDocs(documentId, documentsToLink);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);

export const removeLinkedDocsAction = createAsyncThunk(
  "documents/removeLinkedDoc",
  async (
    {
      documentId,
      documentsToUnlink,
    }: {
      documentId: string;
      documentsToUnlink: string[];
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await removeLinkedDocs(documentId, documentsToUnlink);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue);
    }
  },
);
