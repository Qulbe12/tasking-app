import React from "react";
import { IconChevronDown, IconLayout, IconMail, IconNews } from "@tabler/icons";
import { ThemeIcon, UnstyledButton, Group, Text, Menu, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";
import { setActiveWorkspace } from "../redux/slices/workspacesSlice";

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
  const dispatch = useAppDispatch();
  const { activeWorkspace, data: workspaces } = useAppSelector((state) => state.workspaces);

  const mainLinks: MainLinkProps[] = [
    { icon: <IconLayout size={16} />, color: "blue", label: t("boards"), to: "/workspaces/boards" },
    { icon: <IconMail size={16} />, color: "violet", label: "Email", to: "/board/emails" },
    { icon: <IconNews size={16} />, color: "pink", label: t("templates"), to: "/templates" },
  ];

  const links = mainLinks.map((link) => <MainLink {...link} key={link.label} />);

  return (
    <div>
      <Menu shadow="md" width={200}>
        <Menu.Target>
          {/* <Divider className="cursor-pointer" label={activeWorkspace?.name} /> */}
          <Flex justify="space-between" align="center" className="cursor-pointer">
            <Text size="sm">{activeWorkspace?.name}</Text>
            <IconChevronDown size={14} />
          </Flex>
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
                  dispatch(setActiveWorkspace(foundWorkspace));
                }}
              >
                {w.name}
              </Menu.Item>
            );
          })}
        </Menu.Dropdown>
      </Menu>
      <div className="mb-4" />
      {links}
    </div>
  );
}
