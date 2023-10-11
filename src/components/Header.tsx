import React from "react";
import { ActionIcon } from "@mantine/core";
import { IconBell } from "@tabler/icons";

import LanguageButton from "./LanguageButton";
import UserButton from "./UserButton";
import { useLocation } from "react-router-dom";
import SearchInput from "./SearchInput";

type HeaderProps = {
  isUnsubscribed?: boolean;
};

const Header: React.FC<HeaderProps> = ({ isUnsubscribed }) => {
  const location = useLocation();

  return (
    <div className="flex justify-end items-center h-full gap-4">
      {!isUnsubscribed && (
        <>
          {location.pathname !== "/account/settings" && <SearchInput />}

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
