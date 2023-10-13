import { ActionIcon, Card, Group, LoadingOverlay, Menu, Title } from "@mantine/core";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";

const ICON_SIZE = 14;

type WorkspaceCardProps = {
  workspace: IWorkspace;
  onEditClick: () => void;
  onDeleteClick: () => void;
  onClick: () => void;
};

const WorkspaceCard = ({ workspace, onEditClick, onDeleteClick, onClick }: WorkspaceCardProps) => {
  const { t } = useTranslation();
  const { loaders } = useAppSelector((state) => state.workspaces);
  const { deleting, updating } = loaders;
  const { id, name } = workspace;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick();
  };

  return (
    <Card onClick={onClick} shadow="sm" withBorder className="hover:cursor-pointer h-full">
      <LoadingOverlay visible={deleting === id || updating === id} />
      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Title order={5}>{name}</Title>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDotsVertical size={ICON_SIZE} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={handleEditClick} icon={<IconEdit size={ICON_SIZE} />}>
                {t("edit")}
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size={ICON_SIZE} />}
                color="red"
                onClick={handleDeleteClick}
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
