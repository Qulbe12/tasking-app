import { Button, Group, Modal, TransferList, TransferListData } from "@mantine/core";
import React, { useState } from "react";
import CommonModalProps from "../../modals/CommonModalProps";

const initialValues: TransferListData = [
  [{ value: "farhan@gmail.com", label: "farhan@gmail.com" }],
  [],
];

const GroupModal = ({ onClose, opened, title }: CommonModalProps) => {
  const [data, setData] = useState<TransferListData>(initialValues);

  return (
    <Modal size="auto" title={title} onClose={onClose} opened={opened}>
      <TransferList
        value={data}
        onChange={setData}
        searchPlaceholder="Search..."
        nothingFound="No Users Found"
        titles={["Users", "Group"]}
        breakpoint="sm"
      />

      <Group position="right" mt="md">
        <Button type="submit" onClick={onClose}>
          Update
        </Button>
      </Group>
    </Modal>
  );
};

export default GroupModal;
