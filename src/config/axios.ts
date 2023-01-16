import axios from "axios";
import { BASE_URL } from "../constants/URLS";

const token = localStorage.getItem("token");

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
});

axiosPrivate.interceptors.request.use((config: any) => {
  if (config.headers) {
    config.headers["Accept"] = "application/json";
    config.headers["Authorization"] = token ? `Bearer ${localStorage.getItem("token")}` : undefined;
  }
  return config;
});
