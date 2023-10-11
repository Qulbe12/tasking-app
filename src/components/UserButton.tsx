import { Avatar, Menu, NavLink } from "@mantine/core";
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
  const { avatar, email } = user?.user || {};

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Avatar className="cursor-pointer" src={avatar} radius="md" size="md" />
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{email}</Menu.Label>
        {!isUnsubscribed && (
          <Menu.Item
            onClick={() => navigate("/account/settings")}
            icon={<IconSettings size={14} />}
          >
            {t("accountSettings")}
          </Menu.Item>
        )}
        <Menu.Item
          onClick={() => dispatch(toggleTheme())}
          closeMenuOnClick={false}
          icon={mode === "dark" ? <IconSun size={14} /> : <IconMoon size={14} />}
        >
          {mode === "dark" ? t("lightMode") : t("darkMode")}
        </Menu.Item>

        <Menu position="right">
          <Menu.Target>
            <NavLink
              label={i18n.language === "en" ? "English" : "Français"}
              icon={<IconLanguage />}
            />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => changeLanguage("en")}>English</Menu.Item>
            <Menu.Item onClick={() => changeLanguage("fr")}>Français</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Menu.Divider />
        <Menu.Item onClick={() => dispatch(logout())} color="red" icon={<IconLogout size={14} />}>
          {t("logout")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserButton;
