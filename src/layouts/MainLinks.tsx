import React from "react";
import { IconLayout, IconChartBar, IconMail, IconUserPlus, IconNews } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { useNavigate } from "react-router-dom";

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

const data: MainLinkProps[] = [
  { icon: <IconLayout size={16} />, color: "blue", label: "Boards", to: "/board" },
  { icon: <IconChartBar size={16} />, color: "teal", label: "Analytics", to: "/board/analytics" },
  { icon: <IconMail size={16} />, color: "violet", label: "Email", to: "/board/emails" },
  { icon: <IconUserPlus size={16} />, color: "grape", label: "Members", to: "/board/teams" },
  { icon: <IconNews size={16} />, color: "pink", label: "Templates", to: "/templates" },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
