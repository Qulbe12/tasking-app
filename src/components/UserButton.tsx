import { Avatar, Menu, NavLink, Tooltip } from "@mantine/core";
import { IconLanguage, IconLogout, IconMoon, IconSettings, IconSun } from "@tabler/icons";
import React from "react";
import { logout } from "../redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { toggleTheme } from "../redux/slices/themeSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type UserButtonProps = {
  isUnsubscribed?: boolean;
};

const UserButton: React.FC<UserButtonProps> = ({ isUnsubscribed }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const { user } = useAppSelector((state) => state.auth);
  const { mode } = useAppSelector((state) => state.theme);
  const { name, avatar, email } = user?.user || {};

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Tooltip label={name}>
          <Avatar className="cursor-pointer" src={avatar} radius="md" size="md" />
        </Tooltip>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{email}</Menu.Label>

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
        <Menu.Item style={{ padding: "0" }} closeMenuOnClick={false}>
          <NavLink icon={<IconLanguage />}>
            <NavLink onClick={() => changeLanguage("en")} label="English" />
            <NavLink onClick={() => changeLanguage("fr")} label="Français" />
          </NavLink>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={() => dispatch(logout())} color="red" icon={<IconLogout size={14} />}>
          {t("logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserButton;
