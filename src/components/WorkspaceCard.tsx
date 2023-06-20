import { ActionIcon, Card, Group, LoadingOverlay, Menu, Title } from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";

type WorkspaceCardProps = {
  workspace: IWorkspace;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onClick: () => void;
};

const WorkspaceCard = ({ workspace, onEditClick, onDeleteClick, onClick }: WorkspaceCardProps) => {
  const { t } = useTranslation();

  const { loaders } = useAppSelector((state) => state.workspaces);

  return (
    <Card onClick={onClick} shadow="sm" withBorder className="hover:cursor-pointer h-full">
      <LoadingOverlay
        visible={loaders.deleting === workspace.id || loaders.updating === workspace.id}
      />
      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Title order={5}>{workspace.name}</Title>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }}
                icon={<IconEdit size={14} />}
              >
                {t("edit")}
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size={14} />}
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
              >
                {t("delete")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default WorkspaceCard;
