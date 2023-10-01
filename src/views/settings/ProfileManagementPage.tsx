import { Button, Card, Paper, Stack, TextInput, Title } from "@mantine/core";
import React, { useCallback, useState } from "react";
import { showError } from "../../redux/commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { updateName } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import AvatarSelect from "../../components/AvatarSelect";
import { FileWithPath } from "file-selector";
import { updateUserAvatar } from "../../redux/api/authApi";

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
    } catch (err: any) {
      showError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = useCallback(async (files: FileWithPath[]) => {
    dispatch(updateUserAvatar(files[0]));
  }, []);

  return (
    <Paper mt="md">
      <Card>
        <Title mb="md" order={4}>
          {t("updateUserInformation")}
        </Title>
        <Stack>
          <AvatarSelect handleAvatarChange={handleAvatarChange} image={user?.user.avatar} />
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
