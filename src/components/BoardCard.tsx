import { ActionIcon, Card, Group, Menu, Text, Title } from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BoardResponse } from "../interfaces/board.interface";
import { setActiveBoard } from "../redux/boardsSlice";
import { useAppDispatch } from "../redux/store";

type BoardCardProps = {
  board: BoardResponse;
};

const BoardCard = ({ board }: BoardCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      <Card.Section inheritPadding py="xs">
        <Group position="apart">
          <Title order={5}>{board.title}</Title>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconEdit size={14} />}>Edit</Menu.Item>
              <Menu.Item icon={<IconTrash size={14} />} color="red">
                Delete
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
