import { Button, Modal, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import CommonModalProps from "./CommonModalProps";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { inviteUserToBusiness } from "../redux/api/businessApi";
import { useTranslation } from "react-i18next";

const InviteUserModal = ({ onClose, opened }: CommonModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { businessInfo, loaders } = useAppSelector((state) => state.business);

  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    if (!email) return;
    await dispatch(inviteUserToBusiness(email));
    setEmail("");
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={`${t("inviteUserTo")} ${businessInfo?.name}`}>
      <Stack>
        <TextInput
          label={t("userEmail")}
          value={email}
          withAsterisk
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button loading={loaders.invitingUser} onClick={handleInvite}>
          {t("invite")}
        </Button>
      </Stack>
    </Modal>
  );
};

export default InviteUserModal;
