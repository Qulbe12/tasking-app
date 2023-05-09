import React from "react";
import { IconLayout, IconMail, IconNews } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text, Divider } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";

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

export function MainLinks() {
  const { t } = useTranslation();
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  const mainLinks: MainLinkProps[] = [
    { icon: <IconLayout size={16} />, color: "blue", label: t("boards"), to: "/workspaces/boards" },
    { icon: <IconMail size={16} />, color: "violet", label: "Email", to: "/board/emails" },
    { icon: <IconNews size={16} />, color: "pink", label: t("templates"), to: "/templates" },
  ];

  const links = mainLinks.map((link) => <MainLink {...link} key={link.label} />);

  return (
    <div>
      <Divider label={activeWorkspace?.name} />
      {links}
    </div>
  );
}
