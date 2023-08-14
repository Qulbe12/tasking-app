import React, { useMemo } from "react";
import { IconArtboard, IconLayout, IconMail, IconNews } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Tooltip, MediaQuery, Text, Box } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../redux/store";
import UserButton from "../components/UserButton";
import NavBreadcrumbs from "./NavBreadcrumbs";
import NavTabs from "./NavTabs";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
}

function MainLink({ icon, color, label, to }: MainLinkProps) {
  const navigate = useNavigate();

  return (
    <Tooltip label={label}>
      <UnstyledButton
        sx={(theme) => ({
          display: "block",
          width: "100%",
          padding: theme.spacing.xs,
          borderRadius: theme.radius.sm,
          color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
          "&:hover": {
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[0],
          },
        })}
        onClick={() => navigate(to)}
      >
        <Group>
          <ThemeIcon color={color} variant="light" size="xl">
            {icon}
          </ThemeIcon>

          <MediaQuery largerThan="lg" styles={{ display: "none" }}>
            <Text size="sm">{label}</Text>
          </MediaQuery>
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}

export function MainLinks() {
  const { t } = useTranslation();
  const { activeBoard } = useAppSelector((state) => state.boards);

  const mainLinks: MainLinkProps[] = useMemo(() => {
    const links = [
      { icon: <IconArtboard size={16} />, color: "blue", label: t("workspaces"), to: "/" },

      { icon: <IconMail size={16} />, color: "violet", label: t("email"), to: "/board/emails" },
      { icon: <IconNews size={16} />, color: "pink", label: t("templates"), to: "/templates" },
    ];

    if (activeBoard) {
      links.splice(1, 0, {
        icon: <IconLayout size={16} />,
        color: "blue",
        label: activeBoard ? t("board") : t("boards"),
        to: "/board",
      });
    }
    return links;
  }, [activeBoard]);

  const links = mainLinks.map((link) => <MainLink {...link} key={link.label} />);

  const isBoardsPage = useMemo(() => {
    return location.pathname.split("/")[1] === "board";
  }, [location.pathname]);

  const isSettingsPage = useMemo(() => {
    return location.pathname.includes("/account/settings");
  }, [location.pathname]);

  return (
    <div className="flex flex-col  justify-between h-full">
      <div>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Box my="md">
            <NavBreadcrumbs />
          </Box>
        </MediaQuery>

        {(isBoardsPage || isSettingsPage) && (
          <MediaQuery largerThan="lg" styles={{ display: "none" }}>
            <Box my="md">
              <NavTabs />
            </Box>
          </MediaQuery>
        )}
        {links}
      </div>
      <UserButton />
    </div>
  );
}
