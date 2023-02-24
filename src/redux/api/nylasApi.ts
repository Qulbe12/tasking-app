import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/api";

const { nylasApi } = api;
const { connect } = nylasApi;

export const connectNylas = createAsyncThunk(
  "nylas/connectNylas",
  async () => (await connect()).data,
);
