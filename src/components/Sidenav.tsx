import React from "react";

import { IconMenu } from "@tabler/icons";
import { NavLink } from "react-router-dom";
import "./Sidenav.scss";
import { ActionIcon, Paper } from "@mantine/core";

const ICON_SIZE = 20;

type SidenavProps = {
  visible: boolean;
  show: (val: boolean) => void;
};

function Sidenav({ visible, show }: SidenavProps) {
  return (
    <Paper>
      <div className="mobile-nav">
        <ActionIcon onClick={() => show(!visible)} variant="filled">
          <IconMenu size={16} />
        </ActionIcon>
      </div>
      <nav className={!visible ? "navbar" : ""}>
        <ActionIcon onClick={() => show(!visible)} variant="filled">
          <IconMenu size={16} />
        </ActionIcon>
        <div>
          <NavLink className="logo" to="/">
            {/* <img src={require("../assets/Images/logo.png")} alt="logo" /> */}
          </NavLink>
          <div className="links nav-top">
            <NavLink to="/dashboard" className="nav-link">
              <IconMenu size={ICON_SIZE} />
            </NavLink>
            <NavLink to="/analytics" className="nav-link">
              <IconMenu size={ICON_SIZE} />
            </NavLink>
            <NavLink to="/orders" className="nav-link">
              <IconMenu size={ICON_SIZE} />
            </NavLink>
          </div>
        </div>

        <div className="links">
          <NavLink to="/settings" className="nav-link">
            <IconMenu size={ICON_SIZE} />
          </NavLink>
          <NavLink to="/Sign-out" className="nav-link">
            <IconMenu size={ICON_SIZE} />
          </NavLink>
        </div>
      </nav>
    </Paper>
  );
}

export default Sidenav;
