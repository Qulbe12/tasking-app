import axios from "axios";
import { SHEETS_URL } from "../constants/URLS";

export const axiosSheets = axios.create({
  baseURL: SHEETS_URL,
  headers: {
    Accept: "application/json",
  },
});
