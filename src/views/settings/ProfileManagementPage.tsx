import { Button, Card, Paper, Stack, TextInput, Title } from "@mantine/core";
import React, { useState } from "react";
import { showError } from "../../redux/commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateName } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

const ProfileManagementPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const handleNameUpdate = async () => {
    if (!name) return;

    setLoading(true);

    try {
      const res = await axiosPrivate.patch("/users/update-profile", {
        name,
      });

      dispatch(updateName(name));
      setName("");

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
          {t("updateUserInformation")}
        </Title>
        <Stack>
          <TextInput
            placeholder={user?.user.name}
            label={t("name")}
            withAsterisk
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button loading={loading} onClick={handleNameUpdate}>
            {t("update")}
          </Button>
        </Stack>
      </Card>
    </Paper>
  );
};

export default ProfileManagementPage;
