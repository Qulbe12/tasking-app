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
  TextInput,
  useMantineTheme,
} from "@mantine/core";

import { Outlet, useLocation } from "react-router-dom";
import { MainLinks } from "./MainLinks";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { resetFilters, setSearch } from "../redux/slices/filterSlice";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import useChangeWorkspace from "../hooks/useChangeWorkspace";
import useChangeBoard from "../hooks/useChangeBoard";
import NavBreadcrumbs from "./NavBreadcrumbs";
import NavTabs from "./NavTabs";

const DashboardLayout = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { loadingText, loadingValue } = useChangeWorkspace();
  const { loadingText: boardLoadingText, loadingValue: boardLoadingValue } = useChangeBoard();

  const location = useLocation();
  const { search } = useAppSelector((state) => state.filters);

  useEffect(() => {
    dispatch(setSearch(""));
    dispatch(resetFilters());
  }, [window.location.href]);

  const [opened, { toggle }] = useDisclosure(false);
  const theme = useMantineTheme();

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
              {/* <ActionIcon
                color={filtersOpen ? "orange" : undefined}
                onClick={() => dispatch(toggleFilterOpen())}
              >
                <IconFilter size={24} />
              </ActionIcon> */}
              <TextInput
                sx={{
                  [theme.fn.smallerThan("md")]: {
                    width: "300px",
                  },
                  [theme.fn.smallerThan("sm")]: {
                    width: "150px",
                  },
                }}
                w="400px"
                placeholder={`${t("search")}`}
                variant="filled"
                value={search}
                onChange={(e) => {
                  dispatch(setSearch(e.target.value));
                }}
              />
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
