import { ActionIcon, Burger, Paper } from "@mantine/core";
import { useState } from "react";
import { Outlet } from "react-router-dom";

import { IconAdjustments, IconMenu2 } from "@tabler/icons";

import "./DashboardLayout.scss";

const DashboardLayout = () => {
  const [showSider, setShowSider] = useState(true);
  return (
    <div className={`dashboard_layout ${showSider && "show"}`}>
      <div className={`dashboard_layout-sidebar`}>
        <h2 className="title">HEXA</h2>

        <div className="menu">
          <ActionIcon>
            <IconAdjustments size={24} />
          </ActionIcon>
          <ActionIcon onClick={() => {}}>
            <IconMenu2 size={24} />
          </ActionIcon>
          <ActionIcon onClick={() => {}}>
            <IconMenu2 size={24} />
          </ActionIcon>
          <ActionIcon onClick={() => {}}>
            <IconMenu2 size={24} />
          </ActionIcon>
        </div>
        <div />
      </div>
      <Paper className="dashboard_layout-topnav">
        <Burger opened={showSider} onClick={() => setShowSider((s) => !s)} />
      </Paper>
      <Paper className="dashboard_layout-main">
        <Outlet />
      </Paper>
    </div>
  );
};

export default DashboardLayout;
