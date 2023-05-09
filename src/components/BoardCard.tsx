import { ActionIcon, Card, Group, LoadingOverlay, Menu, Text, Title } from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import { IBoard } from "hexa-sdk/dist/app.api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { setActiveBoard } from "../redux/slices/boardsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { t } from "i18next";

type BoardCardProps = {
  board: IBoard;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

const BoardCard = ({ board, onEditClick, onDeleteClick }: BoardCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loaders } = useAppSelector((state) => state.boards);

  return (
    <Card
      onClick={() => {
        dispatch(setActiveBoard(board));
        navigate("/board");
      }}
      shadow="sm"
      withBorder
      className="hover:cursor-pointer h-full"
    >
      <LoadingOverlay visible={loaders.deleting === board.id} />
      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Title order={5}>{board.title}</Title>
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

      <Text>{board.description}</Text>
    </Card>
  );
};

export default BoardCard;
