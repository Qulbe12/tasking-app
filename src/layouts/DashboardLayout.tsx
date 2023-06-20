import { useEffect, useMemo } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Group,
  TextInput,
  Flex,
  ActionIcon,
  Burger,
  Tabs,
  Menu,
  Breadcrumbs,
  Anchor,
  Modal,
  Center,
  Progress,
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
import useChangeWorkspace from "../hooks/useChangeWorkspace";
import useChangeBoard from "../hooks/useChangeBoard";

const DashboardLayout = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { handleWorkspaceChange, loadingText, loadingValue } = useChangeWorkspace();
  const {
    handleBoardChange,
    loadingText: boardLoadingText,
    loadingValue: boardLoadingValue,
  } = useChangeBoard();

  const location = useLocation();
  const { search, filtersOpen } = useAppSelector((state) => state.filters);
  const { activeWorkspace, data: workspaces } = useAppSelector((state) => state.workspaces);
  const { activeBoard, data: boards } = useAppSelector((state) => state.boards);
  const { user } = useAppSelector((state) => state.auth);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    dispatch(setSearch(""));
    dispatch(resetFilters());
  }, [window.location.href]);

  const [opened, { toggle }] = useDisclosure(false);

  const isBoardsPage = useMemo(() => {
    return location.pathname.split("/")[1] === "board";
  }, [location.pathname]);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        opened ? (
          <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 95, lg: 95 }}>
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

              <Breadcrumbs ml="xl" separator="→">
                <Anchor href="/"></Anchor>
                {activeWorkspace && (
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <Anchor>{activeWorkspace.name}</Anchor>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Workspaces</Menu.Label>
                      {workspaces.map((w) => {
                        return (
                          <Menu.Item
                            key={w.id}
                            onClick={() => {
                              const foundWorkspace = workspaces.find((ws) => ws.id === w.id);
                              if (!foundWorkspace) return;
                              handleWorkspaceChange(foundWorkspace);
                            }}
                          >
                            {w.name}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Dropdown>
                  </Menu>
                )}

                {activeBoard && (
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <Anchor>{activeBoard.title}</Anchor>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Boards</Menu.Label>
                      {boards.map((b) => {
                        return (
                          <Menu.Item
                            key={b.id}
                            onClick={() => {
                              const foundBoard = boards.find((board) => board.id === b.id);
                              if (!foundBoard) return;
                              handleBoardChange(foundBoard);
                            }}
                          >
                            {b.title}
                          </Menu.Item>
                        );
                      })}
                    </Menu.Dropdown>
                  </Menu>
                )}
              </Breadcrumbs>
            </Flex>

            {/* Center */}
            {isBoardsPage && (
              <Tabs
                defaultValue="Work Items"
                value={location.pathname}
                onTabChange={(t) => dispatch(setBoardTab(t))}
              >
                <Tabs.List>
                  <Tabs.Tab value="/board" onClick={() => navigate("/board")}>
                    {t("workItems")}
                  </Tabs.Tab>
                  <Tabs.Tab value="/board/sheets" onClick={() => navigate("/board/sheets")}>
                    {t("sheets")}
                  </Tabs.Tab>
                  <Tabs.Tab value="/board/analytics" onClick={() => navigate("/board/analytics")}>
                    {t("analytics")}
                  </Tabs.Tab>
                  {activeBoard?.owner.email === user?.user.email && (
                    <Tabs.Tab value="/board/teams" onClick={() => navigate("/board/teams")}>
                      {t("teams")}
                    </Tabs.Tab>
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

      <Modal
        opacity={0.8}
        opened={!!loadingText}
        onClose={() => {
          //
        }}
        withCloseButton={false}
        fullScreen
        transition="fade"
        transitionDuration={100}
      >
        <Center maw={900} h={"50vh"} mx="auto">
          <div className="w-full">
            <Progress value={loadingValue} animate />
            {loadingText || "Loading..."}
          </div>
        </Center>
      </Modal>

      <Modal
        opacity={0.8}
        opened={!!boardLoadingText}
        onClose={() => {
          //
        }}
        withCloseButton={false}
        fullScreen
        transition="fade"
        transitionDuration={100}
      >
        <Center maw={900} h={"50vh"} mx="auto">
          <div className="w-full">
            <Progress value={boardLoadingValue} animate />
            {boardLoadingText || "Loading..."}
          </div>
        </Center>
      </Modal>
    </AppShell>
  );
};

export default DashboardLayout;
