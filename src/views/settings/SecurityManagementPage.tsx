import { Button, Card, Paper, Stack, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import { showError } from "../../redux/commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { showNotification } from "@mantine/notifications";

const SecurityManagementPage = () => {
  const [loading, setLoading] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword) return;

    if (newPassword.length < 6) {
      return showError("Password cannot be shorter than 6 characters");
    }

    if (oldPassword === newPassword) {
      return showError("Password cannot be the same as the old password");
    }

    setLoading(true);

    try {
      const res = await axiosPrivate.patch("/users/change-password", {
        oldPassword,
        newPassword,
      });

      setOldPassword("");
      setNewPassword("");
      showNotification({
        message: res.data.message,
      });
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      showError(err.response.data.message);
    }
  };

  return (
    <Paper mt="md">
      <Card>
        <Title mb="md" order={4}>
          Update Password
        </Title>
        <Stack>
          <TextInput
            label="Old Password"
            withAsterisk
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextInput
            label="New Password"
            withAsterisk
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Button loading={loading} onClick={handleUpdatePassword}>
            Update
          </Button>
        </Stack>
      </Card>
    </Paper>
  );
};

export default SecurityManagementPage;
