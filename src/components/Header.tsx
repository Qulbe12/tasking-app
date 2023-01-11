import { ActionIcon, Input } from "@mantine/core";
import { IconBell, IconColumns, IconMail, IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import UserButton from "./UserButton";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end items-center h-full gap-4">
      <Input icon={<IconSearch />} placeholder="Search..." />
      <ActionIcon>
        <IconMail size={48} />
      </ActionIcon>
      <ActionIcon>
        <IconBell size={48} />
      </ActionIcon>
      <ActionIcon onClick={() => navigate("/templates")}>
        <IconColumns size={48} />
      </ActionIcon>
      <UserButton />
    </div>
  );
};

export default Header;
