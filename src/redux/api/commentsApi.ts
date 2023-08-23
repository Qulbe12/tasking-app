import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate } from "../../config/axios";
import { centralizedErrorHandler } from "../commonSliceFunctions";
import { ICommentCreate, ICommentResponse } from "../../interfaces/IComments";

export const createComment = createAsyncThunk(
  "comments/createComment",
  async (
    { documentId, comment }: { documentId: string; comment: ICommentCreate },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const res = await axiosPrivate.post<ICommentResponse>(`/documents/${documentId}/comments`, {
        body: comment.body,
      });
      return res.data;
    } catch (err: any) {
      centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);

export const getDocumentComments = createAsyncThunk(
  "comments/getDocumentComments",
  async ({ documentId }: { documentId: string }, { rejectWithValue, dispatch }) => {
    try {
      const res = await axiosPrivate.get<ICommentResponse[]>(`/documents/${documentId}/comments`);
      return res.data;
    } catch (err: any) {
      return centralizedErrorHandler(err, rejectWithValue, dispatch);
    }
  },
);
