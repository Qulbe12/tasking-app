import { ActionIcon, Avatar, Button, Menu, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons";
import { IUser } from "hexa-sdk";
import React from "react";

type AvatarGroupProps = {
  users?: IUser[];
  ccUsers?: string[];
};

const AvatarGroup = ({ users, ccUsers }: AvatarGroupProps) => {
  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <Menu trigger="click" position="top-start" shadow="md" width={200}>
        <Menu.Target>
          <Avatar.Group className="hover:cursor-pointer" spacing="sm">
            {users?.map((u) => {
              return (
                <Tooltip key={u.id} label={u.email} withArrow>
                  <Avatar src={u.avatar} radius="xl" />
                </Tooltip>
              );
            })}

            {ccUsers?.map((u) => {
              return (
                <Tooltip key={u} label={u} withArrow>
                  <Avatar radius="xl" />
                </Tooltip>
              );
            })}

            {/* <Tooltip
          withArrow
          label={
            <>
              <div>John Outcast</div>
              <div>Levi Capitan</div>
            </>
          }
        >
          <Avatar radius="xl">+2</Avatar>
        </Tooltip> */}
          </Avatar.Group>
        </Menu.Target>

        <Menu.Dropdown className="w-fit">
          {/* <Menu.Item icon={<IconTrash size={14} />}>Settings</Menu.Item> */}
          {users?.map((u) => {
            return (
              <Menu.Item icon={<IconTrash color="red" size={14} />} key={u.id}>
                {u.email}
              </Menu.Item>
            );
          })}
          {ccUsers?.map((u) => {
            return (
              <Menu.Item icon={<IconTrash color="red" size={14} />} key={u}>
                {u}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
    </Tooltip.Group>
  );
};

export default AvatarGroup;
