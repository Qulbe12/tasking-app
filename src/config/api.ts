import { prepareSdk } from "hexa-sdk/dist/app.api";
import { axiosPrivate } from "./axios";

const api = prepareSdk(axiosPrivate);

export default api;
