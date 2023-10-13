import React, { useMemo } from "react";
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
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons";
import { useAppSelector } from "../redux/store";
import { t } from "i18next";
import IBoardResponse from "../interfaces/boards/IBoardResponse";

type BoardCardProps = {
  board: IBoardResponse;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick: () => void;
};

const BoardCard: React.FC<BoardCardProps> = ({ board, onEditClick, onDeleteClick, onClick }) => {
  const { loaders } = useAppSelector((state) => state.boards);
  const theme = useMantineTheme();

  const isDeleting = useMemo(() => {
    return loaders.deleting === board.id;
  }, [board, loaders]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditClick?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteClick?.();
  };

  return (
    <Card
      onClick={onClick}
      shadow="sm"
      withBorder
      className="hover:cursor-pointer h-full"
      w="30%"
      h="100px"
      sx={{
        [theme.fn.smallerThan("md")]: {
          width: "49%",
        },
        [theme.fn.smallerThan("sm")]: {
          width: "100%",
        },
      }}
    >
      <LoadingOverlay visible={isDeleting} />

      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Title order={5}>{board.title}</Title>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon
                sx={{
                  [theme.breakpoints.xs]: {
                    size: 20,
                  },
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <IconDotsVertical size={14} />
              </ActionIcon>
            </Menu.Target>

            {onEditClick && onDeleteClick && (
              <Menu.Dropdown>
                <Menu.Item onClick={handleEditClick} icon={<IconEdit size={14} />}>
                  {t("edit")}
                </Menu.Item>
                <Menu.Item icon={<IconTrash size={14} />} color="red" onClick={handleDeleteClick}>
                  {t("delete")}
                </Menu.Item>
              </Menu.Dropdown>
            )}
          </Menu>
        </Group>
      </Card.Section>

      <Text lineClamp={1}>{board.description}</Text>
    </Card>
  );
};

export default BoardCard;
