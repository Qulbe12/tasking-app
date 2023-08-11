import { Avatar, Menu, Tooltip } from "@mantine/core";
import { IconLogout, IconMoon, IconSettings, IconSun } from "@tabler/icons";
import React from "react";
import { logout } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { toggleTheme } from "../redux/slices/themeSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type UserButtonProps = {
  isUnsubscribed?: boolean;
};

const UserButton = ({ isUnsubscribed }: UserButtonProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  const { mode } = useAppSelector((state) => state.theme);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Tooltip label={user?.user.name}>
          <Avatar className="cursor-pointer" src={user?.user.avatar} radius="md" size="md" />
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{user?.user.email}</Menu.Label>
        {/* <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item> */}

        <Menu.Item
          onClick={() => dispatch(toggleTheme())}
          closeMenuOnClick={false}
          icon={mode === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
        >
          {mode === "dark" ? t("lightMode") : t("darkMode")}
        </Menu.Item>
        {!isUnsubscribed && (
          <Menu.Item
            onClick={() => navigate("/account/settings")}
            icon={<IconSettings size={14} />}
          >
            {t("accountSettings")}
          </Menu.Item>
        )}

        <Menu.Divider />

        <Menu.Item onClick={() => dispatch(logout())} color="red" icon={<IconLogout size={14} />}>
          {t("logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserButton;
