import { ActionIcon, Menu } from "@mantine/core";
import { IconLanguage } from "@tabler/icons";
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageButton = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return (
    <div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          <ActionIcon>
            <IconLanguage size={48} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item onClick={() => changeLanguage("en")}>English</Menu.Item>
          <Menu.Item onClick={() => changeLanguage("fr")}>Français</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
};

export default LanguageButton;
