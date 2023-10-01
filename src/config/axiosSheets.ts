import axios from "axios";
import { SHEETS_URL } from "../constants/URLS";

export const axiosSheets = axios.create({
  baseURL: SHEETS_URL,

  headers: {
    Accept: "multipart/form-data",
    "Content-Type": "multipart/form-data",
  },
});

axiosSheets.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
