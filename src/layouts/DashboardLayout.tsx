import React from "react";
import { AppShell, Navbar, Header, Group, TextInput, Flex, ActionIcon } from "@mantine/core";

import "./DashboardLayout.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { MainLinks } from "./MainLinks";
import UserButton from "../components/UserButton";
import { IconFilter } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setSearch, toggleFilterOpen } from "../redux/slices/filterSlice";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { search } = useAppSelector((state) => state.filters);

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <AppShell
        padding="md"
        fixed={false}
        navbar={
          <Navbar width={{ base: 250 }} h="screen" p="xs">
            <Navbar.Section grow mt="xs">
              <MainLinks />
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={60}>
            <Group sx={{ height: "100%" }} px={20} position="apart">
              <div className="cursor-pointer" onClick={() => navigate("/")}>
                HEXADESK
              </div>
              <Flex gap="md" align="center">
                <ActionIcon onClick={() => dispatch(toggleFilterOpen())}>
                  <IconFilter size={24} />
                </ActionIcon>
                <TextInput
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    dispatch(setSearch(e.target.value));
                  }}
                />
                <UserButton />
              </Flex>
            </Group>
          </Header>
        }
        styles={() => ({
          main: {
            overflow: "scroll",
            height: "100%",
          },
        })}
      >
        <Outlet />
      </AppShell>
    </div>
  );
};

export default DashboardLayout;
