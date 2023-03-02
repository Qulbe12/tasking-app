import React from "react";
import { IconLayout, IconChartBar, IconMail, IconUserPlus, IconNews } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text, Divider } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  to: string;
}

function MainLink({ icon, color, label, to }: MainLinkProps) {
  const navigate = useNavigate();
  return (
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
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const mainLinks: MainLinkProps[] = [
  { icon: <IconLayout size={16} />, color: "blue", label: "Boards", to: "/workspaces/boards" },
  { icon: <IconMail size={16} />, color: "violet", label: "Email", to: "/board/emails" },
  { icon: <IconNews size={16} />, color: "pink", label: "Templates", to: "/templates" },
];

const subLinks: MainLinkProps[] = [
  { icon: <IconLayout size={16} />, color: "blue", label: "Documents", to: "/board" },
  { icon: <IconUserPlus size={16} />, color: "grape", label: "Members", to: "/board/teams" },
  { icon: <IconChartBar size={16} />, color: "teal", label: "Analytics", to: "/board/analytics" },
];

export function MainLinks() {
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  const links = mainLinks.map((link) => <MainLink {...link} key={link.label} />);
  const sLinks = subLinks.map((link) => <MainLink {...link} key={link.label} />);
  return (
    <div>
      <Divider label={activeWorkspace?.name} />
      {links}
      {activeBoard && (
        <>
          <Divider label={activeBoard.title} mt="md" />
          {sLinks}
        </>
      )}
    </div>
  );
}
