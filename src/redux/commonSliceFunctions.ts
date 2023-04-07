import { showNotification } from "@mantine/notifications";
import { IErrorResponse } from "../interfaces/IErrorResponse";

export interface PayloadError {
  error: Error;
}

export const showError = (err?: string) => {
  showNotification({
    title: "Error",
    message: err,
  });
};

export const centralizedErrorHandler = (error: unknown, rejectWithValue: any) => {
  const err = error as IErrorResponse;
  if (err.response) {
    const errorMessage = err.response.data.message;
    showError(errorMessage);
  } else if (err.request) {
    showError("No response received from server. Please try again later.");
  } else {
    showError(err.message);
  }
  return rejectWithValue(err.response?.data.message);
};
