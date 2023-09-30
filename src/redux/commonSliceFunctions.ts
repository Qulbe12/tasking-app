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
    message: err ?? "",
    color: "red",
  });
};

export const centralizedErrorHandler = (error: unknown, rejectWithValue: any, dispatch: any) => {
  const err = error as Partial<IErrorResponse>;
  const errMessage = err.response?.data.message ?? "";

  if (err.response?.status === 401) {
    showError(t("unauthorized") ?? "");
    dispatch(logout());
    return rejectWithValue(errMessage);
  }

  const errors: string[] = [];

  if (err.response?.data.errors) {
    for (const k in err.response.data.errors) {
      errors.push(err.response.data.errors[k] ?? "");
    }
  }

  if (errors.length === 0) {
    showError(errMessage);
  } else {
    errors.forEach(showError);
  }

  return rejectWithValue(errMessage);
};
