import { ActionIcon, Card, Group, LoadingOverlay, Menu, Title } from "@mantine/core";
import { IconDots, IconEdit, IconTrash } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import React from "react";
import { useNavigate } from "react-router-dom";
import { setActiveWorkspace } from "../redux/slices/workspacesSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

type WorkspaceCardProps = {
  workspace: IWorkspace;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

const WorkspaceCard = ({ workspace, onEditClick, onDeleteClick }: WorkspaceCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loaders } = useAppSelector((state) => state.workspaces);

  return (
    <Card
      onClick={() => {
        dispatch(setActiveWorkspace(workspace));
        navigate("/workspaces/boards");
      }}
      shadow="sm"
      withBorder
      className="hover:cursor-pointer h-full"
    >
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
                Edit
              </Menu.Item>
              <Menu.Item
                icon={<IconTrash size={14} />}
                color="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick();
                }}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
    </Card>
  );
};

export default WorkspaceCard;
