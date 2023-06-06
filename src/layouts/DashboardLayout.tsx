import { useEffect } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Group,
  TextInput,
  Flex,
  ActionIcon,
  Burger,
  Title,
  Tabs,
  Menu,
} from "@mantine/core";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { MainLinks } from "./MainLinks";
import UserButton from "../components/UserButton";
import { IconFilter, IconLanguage } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { resetFilters, setSearch, toggleFilterOpen } from "../redux/slices/filterSlice";
import { useDisclosure } from "@mantine/hooks";
import { setBoardTab } from "../redux/slices/menuSlice";
import { useTranslation } from "react-i18next";

const DashboardLayout = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { search, filtersOpen } = useAppSelector((state) => state.filters);
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { boardTab } = useAppSelector((state) => state.menus);
  const { user } = useAppSelector((state) => state.auth);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    dispatch(setSearch(""));
    dispatch(resetFilters());
  }, [window.location.href]);

  const [opened, { toggle }] = useDisclosure(false);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        opened ? (
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 200 }}>
            <MainLinks />
          </Navbar>
        ) : undefined
      }
      header={
        <Header height={{ base: 50, md: 60 }} p="md">
          <Group px={20} position="apart">
            {/* LEFT SIDE */}
            <Flex align={"center"} gap="lg">
              <Burger opened={opened} onClick={toggle} aria-label={"Toggle Sidenav"} size="sm" />
              <div className="cursor-pointer" onClick={() => navigate("/")}>
                HEXADESK
              </div>

              <Title order={4}>{activeBoard?.title}</Title>
            </Flex>

            {/* Center */}
            {location.pathname === "/board" && (
              <Tabs
                defaultValue="Work Items"
                value={boardTab}
                onTabChange={(t) => dispatch(setBoardTab(t))}
              >
                <Tabs.List>
                  <Tabs.Tab value="Work Items">{t("workItems")}</Tabs.Tab>
                  <Tabs.Tab value="Sheets">{t("sheets")}</Tabs.Tab>
                  <Tabs.Tab value="Analytics">{t("analytics")}</Tabs.Tab>
                  {activeBoard?.owner.email === user?.user.email && (
                    <Tabs.Tab value="Teams">{t("teams")}</Tabs.Tab>
                  )}
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
                placeholder={`${t("search")}`}
                variant="filled"
                value={search}
                onChange={(e) => {
                  dispatch(setSearch(e.target.value));
                }}
              />
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
