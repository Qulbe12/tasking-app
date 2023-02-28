import { Button, Group, Table } from "@mantine/core";
import { IGroup } from "hexa-sdk/dist/app.api";
import React, { useState } from "react";
import { useAppSelector } from "../../redux/store";
import CreateGroupModal from "./modals/CreateGroupModal";
import GroupModal from "./modals/GroupModal";

const GroupsTab = () => {
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const { data } = useAppSelector((state) => state.groups);

  const [selectedGroup, setSelectedGroup] = useState<IGroup>();

  const rows = data.map((g) => (
    <tr
      onClick={() => {
        setSelectedGroup(g);
        setOpen((o) => !o);
      }}
      className="hover:cursor-pointer"
      key={g.id}
    >
      <td>{g.name}</td>
      <td>{g.ccUsers.length}</td>
    </tr>
  ));
  return (
    <div>
      <Group position="right">
        <Button onClick={() => setCreateOpen(true)}>Create Group</Button>
      </Group>
      <Table verticalSpacing="md" fontSize="md" highlightOnHover>
        <thead>
          <tr>
            <th>Group</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>

      <GroupModal
        group={selectedGroup}
        onClose={() => {
          setOpen((o) => !o);
        }}
        opened={open}
        title="Manage Users"
      />
      <CreateGroupModal opened={createOpen} onClose={() => setCreateOpen((o) => !o)} />
    </div>
  );
};

export default GroupsTab;
