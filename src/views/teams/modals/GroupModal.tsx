import { Button, Group, Modal, TransferList, TransferListData } from "@mantine/core";
import { IGroup } from "hexa-sdk/dist/app.api";

import React, { useEffect, useState } from "react";
import CommonModalProps from "../../../modals/CommonModalProps";
import { useTranslation } from "react-i18next";
import _ from "lodash";

const initialValues: TransferListData = [
  [{ value: "farhan@gmail.com", label: "farhan@gmail.com" }],
  [],
];

const GroupModal = ({ onClose, opened, group }: CommonModalProps & { group?: IGroup }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<TransferListData>(initialValues);

  useEffect(() => {
    if (!group) return;
    setData([[], group.ccUsers.map((u) => ({ value: u, label: u }))]);
  }, [group]);

  return (
    <Modal
      size="auto"
      title={`${t("manage")} ${group?.name} ${_.toLower(t("users") || "")}`}
      onClose={onClose}
      opened={opened}
    >
      <TransferList
        value={data}
        onChange={setData}
        searchPlaceholder={t("search") + "..."}
        nothingFound={t("noUsersFound")}
        titles={[t("users"), t("group")]}
        breakpoint="sm"
      />

      <Group position="right" mt="md">
        <Button onClick={onClose}>{t("update")}</Button>
      </Group>
    </Modal>
  );
};

export default GroupModal;
