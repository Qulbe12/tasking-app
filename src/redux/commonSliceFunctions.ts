import { showNotification } from "@mantine/notifications";
import { IErrorResponse } from "../interfaces/IErrorResponse";
import { logout } from "./slices/authSlice";
import i18n from "../i18n/i18n";

const { t } = i18n;

export interface PayloadError {
  error: Error;
}

export const showError = (err?: string) => {
  showNotification({
    title: t("error"),
    message: err,
    color: "red",
  });
};

export const centralizedErrorHandler = (error: unknown, rejectWithValue: any, dispatch: any) => {
  const err = error as IErrorResponse;
  const errMessage = err.response?.data.message;

  if (err.response?.status === 401) {
    showError(t("unauthorized") ?? "");
    dispatch(logout());
    return rejectWithValue(errMessage);
  }

  if (err.response) {
    const errorMessage = err.response.data.message;
    showError(errorMessage);
  } else if (err.request) {
    showError(t("noResponse") ?? "");
  } else {
    showError(err.message);
  }
  return rejectWithValue(errMessage);
};
