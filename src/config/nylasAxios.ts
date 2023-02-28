import axios from "axios";

export const nylasAxios = axios.create({
  baseURL: "https://api.nylas.com",
  headers: {
    Accept: "application/json",
  },
});

nylasAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("nylasToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // console.log("request error", error);
    return Promise.reject(error);
  },
);
