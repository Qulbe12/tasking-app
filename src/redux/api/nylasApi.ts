import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";
import { nylasAxios } from "../../config/nylasAxios";

const { nylasApi } = api;
const { connect } = nylasApi;

export const connectNylas = createAsyncThunk(
  "nylas/connectNylas",
  async () => (await connect()).data,
);

export const fetchEmails = createAsyncThunk("nylas/fetchEmails", async () => {
  return await (
    await nylasAxios.get("/messages?limit=5")
  ).data;
});
