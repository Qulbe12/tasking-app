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
  Title,
  Tabs,
} from "@mantine/core";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MainLinks } from "./MainLinks";
import UserButton from "../components/UserButton";
import { IconFilter } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { resetFilters, setSearch, toggleFilterOpen } from "../redux/slices/filterSlice";
import { useDisclosure } from "@mantine/hooks";
import { setBoardTab } from "../redux/slices/menuSlice";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { search, filtersOpen } = useAppSelector((state) => state.filters);
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { boardTab } = useAppSelector((state) => state.menus);

  useEffect(() => {
    dispatch(setSearch(""));
    dispatch(resetFilters());
  }, [window.location.href]);

  const [opened, { toggle }] = useDisclosure(true);

  return (
    <AppShell
      padding="md"
      fixed={true}
      navbar={
        opened ? (
          <Navbar display={opened ? "block" : "none"} width={{ base: 250 }} h="screen" p="xs">
            <Navbar.Section grow mt="xs">
              <MainLinks />
            </Navbar.Section>
            <Navbar.Section>
              <Flex>
                <Text className="fixed bottom-2 left-2">v0.81</Text>
              </Flex>
            </Navbar.Section>
          </Navbar>
        ) : undefined
      }
      header={
        <Header height={60}>
          <Group sx={{ height: "100%" }} px={20} position="apart">
            {/* LEFT SIDE */}
            <Flex align={"center"} gap="lg">
              <div className="cursor-pointer" onClick={() => navigate("/")}>
                HEXADESK
              </div>
              <Burger opened={opened} onClick={toggle} aria-label={"Toggle Sidenav"} size="sm" />
              <Title order={4}>{activeBoard?.title}</Title>
            </Flex>

            {/* Center */}
            {location.pathname === "/board" && (
              <Tabs value={boardTab} onTabChange={(t) => dispatch(setBoardTab(t))}>
                <Tabs.List>
                  <Tabs.Tab value="Work Items">Work Items</Tabs.Tab>
                  <Tabs.Tab value="Sheets">Sheets</Tabs.Tab>
                  <Tabs.Tab value="Analytics">Analytics</Tabs.Tab>
                  <Tabs.Tab value="Teams">Teams</Tabs.Tab>
                </Tabs.List>
              </Tabs>
            )}

            {/* RIGHT SIDE */}
            <Flex gap="md" align="center" justify="space-between">
              <ActionIcon
                color={filtersOpen ? "orange" : undefined}
                onClick={() => dispatch(toggleFilterOpen())}
              >
                <IconFilter size={24} />
              </ActionIcon>
              <TextInput
                w="400px"
                placeholder="Search"
                variant="filled"
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
    >
      <Outlet />
    </AppShell>
  );
};

export default DashboardLayout;
