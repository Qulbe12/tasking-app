import { Avatar, Button, Menu, Text } from "@mantine/core";
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconArrowsLeftRight,
  IconTrash,
  IconUser,
  IconLogout,
  IconMoon,
  IconSun,
} from "@tabler/icons";
import React from "react";
import { logout } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { toggleTheme } from "../redux/themeSlice";

const image =
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80";

const UserButton = () => {
  const dispatch = useAppDispatch();

  const { mode } = useAppSelector((state) => state.theme);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar className="cursor-pointer" src={image} radius="xl" size="md" />
      </Menu.Target>

      <Menu.Dropdown>
        {/* <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item> */}

        <Menu.Item
          onClick={() => dispatch(toggleTheme())}
          closeMenuOnClick={false}
          icon={mode === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
        >
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item onClick={() => dispatch(logout())} color="red" icon={<IconLogout size={14} />}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserButton;
