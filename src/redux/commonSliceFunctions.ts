import { showNotification } from "@mantine/notifications";

export interface PayloadError {
  error: Error;
}

export const showError = (err?: string) => {
  showNotification({
    title: "Error",
    message: err,
  });
};
