import { ActionIcon, Input } from "@mantine/core";
import { IconBell, IconColumns, IconMail, IconSearch } from "@tabler/icons";
import { useNavigate } from "react-router-dom";
import UserButton from "./UserButton";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearch } from "../redux/slices/filterSlice";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { search } = useAppSelector((state) => state.filters);

  return (
    <div className="flex justify-end items-center h-full gap-4">
      <Input
        icon={<IconSearch />}
        placeholder="Search..."
        variant="filled"
        w="400px"
        value={search}
        onChange={(e) => {
          dispatch(setSearch(e.target.value));
        }}
      />
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
