import { Paper } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

import "./DashboardLayout.scss";

const HomeLayout = () => {
  return (
    <div className={"dashboard_layout p-4"}>
      <div className="dashboard_layout-topnav">
        <Header />
      </div>

      <Paper className="dashboard_layout-main">
        <Outlet />
      </Paper>
    </div>
  );
};

export default HomeLayout;
