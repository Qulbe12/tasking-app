import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { IUpdateDocument } from "../../interfaces/IUpdateDocument";
import { IDocumentQuery, IDocumentResponse } from "../../interfaces/documents/IDocumentResponse";
import generateQueryString from "../../utils/generateQueryString";

const { documentApi } = api;

const { addUsers, getById } = documentApi;

export const createDocument = createAsyncThunk(
  "documents/createDocument",
  async (
    { boardId, document }: { boardId: string; document: FormData },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post(`/boards/${boardId}/documents/`, document);

      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getDocuments = createAsyncThunk(
  "documents/getDocuments",
  async (
    { boardId, query }: { boardId: string; query: IDocumentQuery },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.get(
        `/boards/${boardId}/documents${generateQueryString(query)}`,
      );
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const updateDocument = createAsyncThunk(
  "documents/updateDocument",
  async (
    { documentId, document }: { documentId: string; document: IUpdateDocument },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.patch<IDocumentResponse>(`/documents/${documentId}`, document);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const addDocumentFiles = createAsyncThunk(
  "documents/addDocumentFiles",
  async (
    { documentId, attachment }: { documentId: string; attachment: FormData },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post<IDocumentResponse>(
        `/documents/${documentId}/files`,
        attachment,
      );
      return res.data;
    } catch (err) {
      centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const removeDocumentFiles = createAsyncThunk(
  "documents/removeDocumentFiles",
  async (
    { documentId, attachments }: { documentId: string; attachments: string[] },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.delete(`/documents/${documentId}/files`, {
        data: attachments,
      });
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
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
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await addUsers(documentId, type, emails);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
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
      email: string[];
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.delete<IDocumentResponse>(
        `/documents/${documentId}/users/${type}`,
        {
          data: email,
        },
      );
      console.log(res.data);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getDocumentById = createAsyncThunk(
  "documents/getDocumentById",
  async ({ documentId }: { documentId: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await getById(documentId);
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const addLinkedDocsAction = createAsyncThunk(
  "documents/addLinkedDoc",
  async (
    { documentId, documentsToLink }: { documentId: string; documentsToLink: string[] },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post(`/documents/${documentId}/linked-docs`, {
        docIds: documentsToLink,
      });

      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
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
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.delete(`/documents/${documentId}/linked-docs`, {
        data: {
          docIds: documentsToUnlink,
        },
      });
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const archiveDocument = createAsyncThunk(
  "documents/archiveDocument",
  async (documentId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.patch(`/documents/${documentId}/archive`, {
        notifyUsers: {
          ccUsers: {
            notify: true,
            exclude: [],
          },
          assignedUsers: {
            notify: true,
            exclude: [],
          },
        },
      });
      return res.data;
    } catch (err) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
