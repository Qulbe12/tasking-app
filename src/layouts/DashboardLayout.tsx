import { ActionIcon, Burger, Container, Flex, Paper } from "@mantine/core";
import React, { ReactElement, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidenav from "../components/Sidenav";
import { IconMenu2 } from "@tabler/icons";

import "./DashboardLayout.scss";

const DashboardLayout = () => {
  const [showSider, setShowSider] = useState(true);
  return (
    <div className={`dashboard_layout ${showSider && "show"}`}>
      <div className={`dashboard_layout-sidebar`}>
        <h2>HEXA</h2>
        <div>
          <ActionIcon>
            <IconMenu2 size={24} />
          </ActionIcon>
          <ActionIcon>
            <IconMenu2 size={24} />
          </ActionIcon>
          <ActionIcon>
            <IconMenu2 size={24} />
          </ActionIcon>
        </div>
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
