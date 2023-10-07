import { Button, Flex, Modal, Text } from "@mantine/core";
import React from "react";
import CommonModalProps from "./CommonModalProps";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Text my="md" size="lg">
        {body}
      </Text>
      <Flex gap="md" justify="flex-end">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button loading={loading} color={type === "delete" ? "red" : undefined} onClick={onOk}>
          {t("confirm")}
        </Button>
      </Flex>
    </Modal>
  );
};

export default ConfirmationModal;
