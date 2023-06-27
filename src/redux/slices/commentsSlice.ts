import { createSlice } from "@reduxjs/toolkit";
import { ICommentResponse } from "../../interfaces/IComments";
import { createComment, getDocumentComments } from "../api/commentsApi";

interface CommentsState {
  comments: ICommentResponse[];
  loading: boolean;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (action.payload) {
          state.comments.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createComment.rejected, (state) => {
        state.loading = false;
      })
      .addCase(getDocumentComments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDocumentComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(getDocumentComments.rejected, (state) => {
        state.loading = false;
      });
  },
});

const commentsReducer = commentsSlice.reducer;

export default commentsReducer;
