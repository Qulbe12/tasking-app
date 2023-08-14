import { Tabs } from "@mantine/core";
import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { setBoardTab } from "../redux/slices/menuSlice";
import { useTranslation } from "react-i18next";

type NavTabsProps = {
  isVertical?: boolean;
};

const NavTabs = ({ isVertical }: NavTabsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Tabs
      orientation={isVertical ? "vertical" : "horizontal"}
      defaultValue="Work Items"
      value={location.pathname}
      onTabChange={(t) => dispatch(setBoardTab(t))}
    >
      <Tabs.List>
        <Tabs.Tab value="/board" onClick={() => navigate("/board")}>
          {t("workItems")}
        </Tabs.Tab>
        <Tabs.Tab value="/board/sheets" onClick={() => navigate("/board/sheets")}>
          {t("sheets")}
        </Tabs.Tab>
        <Tabs.Tab value="/board/analytics" onClick={() => navigate("/board/analytics")}>
          {t("analytics")}
        </Tabs.Tab>
        {activeBoard?.owner.email === user?.user.email && (
          <Tabs.Tab value="/board/teams" onClick={() => navigate("/board/teams")}>
            {t("teams")}
          </Tabs.Tab>
        )}
      </Tabs.List>
    </Tabs>
  );
};

export default NavTabs;
