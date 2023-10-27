import { Anchor, Breadcrumbs, Menu, Tooltip } from "@mantine/core";
import React from "react";
import { useTranslation } from "react-i18next";
import useChangeBoard from "../hooks/useChangeBoard";
import { useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";

const NavBreadcrumbs = () => {
  const { t } = useTranslation();
  const { handleBoardChange } = useChangeBoard();
  const navigate = useNavigate();

  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { activeBoard } = useAppSelector((state) => state.boards);

  return (
    <Breadcrumbs ml="xl" separator="→">
      {activeWorkspace && (
        <Tooltip label={t("workspace")}>
          <Anchor
            size="xl"
            variant="text"
            onClick={() => {
              navigate("/");
            }}
          >
            {activeWorkspace.name}
          </Anchor>
        </Tooltip>
      )}

      {activeBoard && (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Tooltip label={t("board")}>
              <Anchor variant="text">{activeBoard.title}</Anchor>
            </Tooltip>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t("boards")}</Menu.Label>
            {activeWorkspace?.boards.map((b) => {
              return (
                <Menu.Item
                  key={b.id}
                  onClick={() => {
                    handleBoardChange(b.id);
                  }}
                >
                  {b.title}
                </Menu.Item>
              );
            })}
          </Menu.Dropdown>
        </Menu>
      )}
    </Breadcrumbs>
  );
};

export default NavBreadcrumbs;
