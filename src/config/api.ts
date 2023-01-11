import { prepareSdk } from "hexa-sdk";
import { axiosPrivate } from "./axios";
const api = prepareSdk(axiosPrivate);

export default api;
