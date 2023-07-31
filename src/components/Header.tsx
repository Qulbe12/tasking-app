import { ActionIcon, Input } from "@mantine/core";
import { IconBell, IconSearch } from "@tabler/icons";
import UserButton from "./UserButton";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearch } from "../redux/slices/filterSlice";
import { useTranslation } from "react-i18next";
import LanguageButton from "./LanguageButton";

type HeaderProps = {
  isUnsubscribed?: boolean;
};

const Header = ({ isUnsubscribed }: HeaderProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { search } = useAppSelector((state) => state.filters);

  return (
    <div className="flex justify-end items-center h-full gap-4">
      {!isUnsubscribed && (
        <>
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
        </>
      )}

      <LanguageButton />

      <UserButton isUnsubscribed={isUnsubscribed} />
    </div>
  );
};

export default Header;
