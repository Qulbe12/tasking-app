import { Button, Group, Modal, TransferList, TransferListData } from "@mantine/core";
import { IGroup } from "hexa-sdk/dist/group/group.dto";
import React, { useEffect, useState } from "react";
import CommonModalProps from "../../../modals/CommonModalProps";

const initialValues: TransferListData = [
  [{ value: "farhan@gmail.com", label: "farhan@gmail.com" }],
  [],
];

const GroupModal = ({ onClose, opened, group }: CommonModalProps & { group?: IGroup }) => {
  const [data, setData] = useState<TransferListData>(initialValues);

  useEffect(() => {
    if (!group) return;
    setData([[], group.ccUsers.map((u) => ({ value: u, label: u }))]);
  }, [group]);

  return (
    <Modal size="auto" title={`Manage ${group?.name} users`} onClose={onClose} opened={opened}>
      <TransferList
        value={data}
        onChange={setData}
        searchPlaceholder="Search..."
        nothingFound="No Users Found"
        titles={["Users", "Group"]}
        breakpoint="sm"
      />

      <Group position="right" mt="md">
        <Button onClick={onClose}>Update</Button>
      </Group>
    </Modal>
  );
};

export default GroupModal;
