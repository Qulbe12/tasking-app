import React, { useState } from "react";
import { Avatar, Menu, Text, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { IUser } from "../interfaces/account/IUserResponse";
import ConfirmationModal from "../modals/ConfirmationModal";

type AvatarGroupProps = {
  users?: string[];
  ccUsers?: string[];
  onRemoveClick?: (ccUsers?: string) => void;
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, ccUsers, onRemoveClick }) => {
  const visibleUsers = users?.slice(0, 5);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");

  const renderMenuItem = (item: IUser | string) => (
    <Menu.Item
      onClick={() => {
        setOpen(true);
        setUser(typeof item === "string" ? item : "");
      }}
      icon={<IconTrash color="red" size={14} />}
      key={typeof item === "string" ? item : item.id}
    >
      {typeof item === "string" ? item : item.email}
    </Menu.Item>
  );

  if ((users && users?.length <= 0) || (ccUsers && ccUsers?.length <= 0)) {
    return <Text size="sm">No Users Added</Text>;
  }

  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Menu trigger="click" position="top-start" shadow="md" width={200}>
        <Menu.Target>
          <Avatar.Group className="hover:cursor-pointer" spacing="sm">
            {visibleUsers?.map((u, i) => (
              <Tooltip key={u + i + "assUsersAvatars"} label={u} withArrow>
                <Avatar src={u} radius="xl" />
              </Tooltip>
            ))}
            {ccUsers?.map((u) => (
              <Tooltip key={u} label={u} withArrow>
                <Avatar radius="xl" />
              </Tooltip>
            ))}
            {users?.length && users.length > 5 && (
              <Tooltip
                withArrow
                label={
                  <>
                    {users.slice(5).map((u) => (
                      <div key={u + "extra users"}>{u}</div>
                    ))}
                  </>
                }
              >
                <Avatar radius="xl">{users.length - 5}</Avatar>
              </Tooltip>
            )}
          </Avatar.Group>
        </Menu.Target>
        <Menu.Dropdown className="w-fit">
          {users?.map(renderMenuItem)}
          {ccUsers?.map(renderMenuItem)}
        </Menu.Dropdown>
      </Menu>
      <ConfirmationModal
        type="delete"
        title={`${user}`}
        body="Are you sure you want to remove this user?"
        opened={open}
        onClose={() => {
          setOpen(false);
        }}
        onOk={() => {
          if (onRemoveClick) {
            onRemoveClick(user);
            setOpen(false);
          }
        }}
      />
    </Tooltip.Group>
  );
};

export default AvatarGroup;
