import React, { useEffect } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Group,
  TextInput,
  Flex,
  ActionIcon,
  Text,
  Burger,
} from "@mantine/core";

import "./DashboardLayout.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { MainLinks } from "./MainLinks";
import UserButton from "../components/UserButton";
import { IconFilter } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { resetFilters, setSearch, toggleFilterOpen } from "../redux/slices/filterSlice";
import { useDisclosure } from "@mantine/hooks";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { search, filtersOpen } = useAppSelector((state) => state.filters);

  useEffect(() => {
    dispatch(setSearch(""));
    dispatch(resetFilters());
  }, [window.location.href]);

  const [opened, { toggle }] = useDisclosure(true);
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
          <Navbar display={opened ? "block" : "none"} width={{ base: 250 }} h="screen" p="xs">
            <Navbar.Section grow mt="xs">
              <MainLinks />
            </Navbar.Section>
            <Navbar.Section>
              <Flex>
                <Text className="fixed bottom-2 left-2">v0.6</Text>
              </Flex>
            </Navbar.Section>
          </Navbar>
        }
        header={
          <Header height={60}>
            <Group sx={{ height: "100%" }} px={20} position="apart">
              <Flex align={"center"} gap="lg">
                <div className="cursor-pointer" onClick={() => navigate("/")}>
                  HEXADESK
                </div>
                <Burger opened={opened} onClick={toggle} aria-label={"Toggle Sidenav"} />
              </Flex>
              <Flex gap="md" align="center" justify="space-between">
                <ActionIcon
                  color={filtersOpen ? "orange" : undefined}
                  onClick={() => dispatch(toggleFilterOpen())}
                >
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
            overflowY: "auto",
            height: "100%",
          },
        })}
      >
        <button onClick={toggle}>asd</button>
        <Outlet />
      </AppShell>
    </div>
  );
};

export default DashboardLayout;
