import { Button, Flex, Modal, Text } from "@mantine/core";
import React from "react";
import CommonModalProps from "./CommonModalProps";

type ConfirmationModalProps = {
  onOk: () => void;
  type: "delete" | "archive";
  loading?: boolean;
  body?: string;
};

const ConfirmationModal = ({
  title,
  onClose,
  opened,
  type,
  body,
  loading,
  onOk,
}: CommonModalProps & ConfirmationModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Text my="md" size="lg">
        {body}
      </Text>
      <Flex gap="md" justify="flex-end">
        <Button variant="outline">Cancel</Button>
        <Button
          loading={loading}
          variant="filled"
          color={type === "delete" ? "red" : undefined}
          onClick={onOk}
        >
          Confirm
        </Button>
      </Flex>
    </Modal>
  );
};

export default ConfirmationModal;
