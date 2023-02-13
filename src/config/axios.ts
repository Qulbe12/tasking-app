import axios from "axios";
import { BASE_URL } from "../constants/URLS";

const token = localStorage.getItem("token");

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    // "Content-Type": "multipart/form-data",
    Authorization: token ? `Bearer ${localStorage.getItem("token")}` : undefined,
  },
});
