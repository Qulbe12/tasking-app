import React from "react";
import { Avatar, Menu, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { IUser } from "../interfaces/account/IUserResponse";

type AvatarGroupProps = {
  users?: IUser[];
  ccUsers?: string[];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users, ccUsers }) => {
  const visibleUsers = users?.slice(0, 5);

  const renderMenuItem = (item: IUser | string) => (
    <Menu.Item
      icon={<IconTrash color="red" size={14} />}
      key={typeof item === "string" ? item : item.id}
    >
      {typeof item === "string" ? item : item.email}
    </Menu.Item>
  );

  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Menu trigger="click" position="top-start" shadow="md" width={200}>
        <Menu.Target>
          <Avatar.Group className="hover:cursor-pointer" spacing="sm">
            {visibleUsers?.map((u) => (
              <Tooltip key={u.id + "assUsersAvatars"} label={u.email} withArrow>
                <Avatar src={u.avatar} radius="xl" />
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
                      <div key={u.id + "extra users"}>{u.email}</div>
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
    </Tooltip.Group>
  );
};

export default AvatarGroup;
