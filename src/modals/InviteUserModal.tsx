import { Button, Modal, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import CommonModalProps from "./CommonModalProps";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { inviteUserToBusiness } from "../redux/api/businessApi";

const InviteUserModal = ({ onClose, opened }: CommonModalProps) => {
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
    <Modal opened={opened} onClose={onClose} title={`Invite User to ${businessInfo?.name}`}>
      <Stack>
        <TextInput
          label="User Email"
          value={email}
          withAsterisk
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button loading={loaders.invitingUser} onClick={handleInvite}>
          Invite
        </Button>
      </Stack>
    </Modal>
  );
};

export default InviteUserModal;
