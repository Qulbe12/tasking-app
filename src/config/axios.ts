import axios from "axios";
import { BASE_URL } from "../constants/URLS";


export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});
