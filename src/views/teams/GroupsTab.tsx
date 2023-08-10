import { ActionIcon, Button, Group, Menu, Table } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons";
import { IGroup } from "hexa-sdk/dist/app.api";
import React, { useState } from "react";
import { deleteGroup } from "../../redux/api/groupsApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import CreateGroupModal from "./modals/CreateGroupModal";
import GroupModal from "./modals/GroupModal";
import { useTranslation } from "react-i18next";

const GroupsTab = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  const dispatch = useAppDispatch();

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
      <td className="w-1/12">
        <Menu withinPortal position="bottom-end" shadow="sm">
          <Menu.Target>
            <ActionIcon
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <IconDots size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              icon={<IconTrash size={14} />}
              color="red"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(deleteGroup(g.id));
              }}
            >
              {t("delete")}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </td>
    </tr>
  ));
  return (
    <div>
      <Group position="right">
        <Button onClick={() => setCreateOpen(true)}>{t("createGroup")}</Button>
      </Group>
      <Table verticalSpacing="md" fontSize="md" highlightOnHover>
        <thead>
          <tr>
            <th>{t("group")}</th>
            <th>{t("users")}</th>
            <th></th>
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
