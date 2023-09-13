import { Paper } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

import "./DashboardLayout.scss";

const HomeLayout = () => {
  return (
    <div className={"p-4 w-screen"}>
      <div>
        <Header />
      </div>

      <Paper p={0} m={0}>
        <Outlet />
      </Paper>
    </div>
  );
};

export default HomeLayout;
