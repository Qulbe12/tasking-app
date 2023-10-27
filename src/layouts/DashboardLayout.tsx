import { useEffect, useMemo } from "react";
import {
  AppShell,
  Box,
  Burger,
  Center,
  Flex,
  Group,
  Header,
  MediaQuery,
  Modal,
  Navbar,
  Progress,
} from "@mantine/core";

import { Outlet, useLocation } from "react-router-dom";
import { MainLinks } from "./MainLinks";
import { useAppDispatch } from "../redux/store";
import { resetFilters, setSearch } from "../redux/slices/filterSlice";
import { useDisclosure } from "@mantine/hooks";
import useChangeWorkspace from "../hooks/useChangeWorkspace";
import useChangeBoard from "../hooks/useChangeBoard";
import NavBreadcrumbs from "./NavBreadcrumbs";
import NavTabs from "./NavTabs";
import SearchInput from "../components/SearchInput";
import FilterMenu from "../components/FilterMenu";

const DashboardLayout = () => {
  const dispatch = useAppDispatch();

  const { loadingText, loadingValue } = useChangeWorkspace();
  const { loadingText: boardLoadingText, loadingValue: boardLoadingValue } = useChangeBoard();

  const location = useLocation();

  useEffect(() => {
    dispatch(setSearch(""));
    dispatch(resetFilters());
  }, [window.location.href]);

  const [opened, { toggle }] = useDisclosure(false);

  const isBoardsPage = useMemo(() => {
    return location.pathname.split("/")[1] === "board";
  }, [location.pathname]);

  const isSettingsPage = useMemo(() => {
    return location.pathname.includes("/account/settings");
  }, [location.pathname]);

  return (
    <AppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      padding={0}
      style={{ height: "90vh" }}
      navbar={
        opened ? (
          <Navbar p="md" hiddenBreakpoint="lg" hidden={!opened} width={{ lg: 95, sm: "30%" }}>
            <MainLinks />
          </Navbar>
        ) : undefined
      }
      header={
        <Header height={{ base: 60 }} p="md">
          <Group px={20} position="apart">
            {/* LEFT SIDE */}
            <Flex align={"center"} gap="lg">
              <Burger opened={opened} onClick={toggle} aria-label={"Toggle Sidenav"} size="sm" />

              <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                <Box>
                  <NavBreadcrumbs />
                </Box>
              </MediaQuery>
            </Flex>

            {/* Center */}
            {(isBoardsPage || isSettingsPage) && (
              <MediaQuery smallerThan="lg" styles={{ display: "none" }}>
                <Box>
                  <NavTabs />
                </Box>
              </MediaQuery>
            )}

            {/* RIGHT SIDE */}
            <Flex gap="md" align="center" justify="space-between">
              <FilterMenu />

              <SearchInput />
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
