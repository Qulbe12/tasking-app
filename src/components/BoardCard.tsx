import {
  ActionIcon,
  Card,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import { IBoard } from "hexa-sdk/dist/app.api";
import { useAppSelector } from "../redux/store";
import { t } from "i18next";
import { IEntityBoard } from "../interfaces/IEntityBoard";
import { IWorkspaceResponse } from "../interfaces/workspaces/IWorkspaceResponse";

type BoardCardProps = {
  board: IBoard | IEntityBoard;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick: () => void;
  workspace?: IWorkspaceResponse;
};

const BoardCard = ({ board, onEditClick, onDeleteClick, onClick, workspace }: BoardCardProps) => {
  const { loaders } = useAppSelector((state) => state.boards);
  const theme = useMantineTheme();

  return (
    <Card onClick={onClick} shadow="sm" withBorder className="hover:cursor-pointer h-full" w="100%">
      <LoadingOverlay visible={loaders.deleting === board.id} />
      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Title order={5}>{board.title}</Title>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon
                sx={{
                  [theme.fn.smallerThan("sm")]: {
                    size: 20,
                  },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <IconDots size={14} />
              </ActionIcon>
            </Menu.Target>

            {onEditClick && onDeleteClick && (
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
            )}
          </Menu>
        </Group>
      </Card.Section>

      <Text>{workspace?.name || board.description}</Text>
    </Card>
  );
};

export default BoardCard;
