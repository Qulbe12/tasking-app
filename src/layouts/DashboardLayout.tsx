import { ActionIcon, Burger, Paper, Title } from "@mantine/core";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  IconChartBar,
  IconHome,
  IconLayout,
  IconMail,
  IconSettings,
  IconUserPlus,
} from "@tabler/icons";

import "./DashboardLayout.scss";
import Header from "../components/Header";
import { useAppSelector } from "../redux/store";

const DashboardLayout = () => {
  const [showSider, setShowSider] = useState(true);
  const activeBoard = useAppSelector((state) => state.boards.activeBoard);
  const navigate = useNavigate();

  return (
    <div className={`dashboard_layout ${showSider && "show"}`}>
      <div className={"dashboard_layout-sidebar"}>
        <h3 className="title cursor-pointer" onClick={() => navigate("/")}>
          HEXA
        </h3>

        <div className="menu">
          <ActionIcon onClick={() => navigate("/board")}>
            <IconLayout size={72} />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              //
            }}
          >
            <IconChartBar size={72} />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              //
            }}
          >
            <IconMail size={72} />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              //
            }}
          >
            <IconUserPlus size={72} />
          </ActionIcon>
          <ActionIcon
            onClick={() => {
              //
            }}
          >
            <IconSettings size={72} />
          </ActionIcon>
        </div>
        <div />
      </div>
      <Paper className="dashboard_layout-topnav">
        <div className=" flex flex-row items-center p-4 justify-between ">
          <div className="flex flex-row items-center ">
            <Burger size={24} opened={showSider} onClick={() => setShowSider((s) => !s)} />
            <Title className="pl-4" order={2}>
              {activeBoard?.title}
            </Title>
          </div>
          <Header />
        </div>
      </Paper>
      <Paper className="dashboard_layout-main">
        <Outlet />
      </Paper>
    </div>
  );
};

export default DashboardLayout;
