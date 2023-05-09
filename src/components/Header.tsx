import { ActionIcon, Input, Menu } from "@mantine/core";
import { IconBell, IconLanguage, IconSearch } from "@tabler/icons";
import UserButton from "./UserButton";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearch } from "../redux/slices/filterSlice";
import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const { search } = useAppSelector((state) => state.filters);

  return (
    <div className="flex justify-end items-center h-full gap-4">
      <Input
        icon={<IconSearch />}
        placeholder={`${t("search")}...`}
        variant="filled"
        w="400px"
        value={search}
        onChange={(e) => {
          dispatch(setSearch(e.target.value));
        }}
      />

      <ActionIcon>
        <IconBell size={48} />
      </ActionIcon>
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
      <UserButton />
    </div>
  );
};

export default Header;
