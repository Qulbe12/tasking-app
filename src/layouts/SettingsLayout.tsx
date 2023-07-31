import { Container, Grid, NavLink } from "@mantine/core";
import { IconBuilding, IconCards, IconUser } from "@tabler/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const SettingsLayout = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const onLinkClick = (to: string) => {
    navigate(`/account/settings/${to}`);
  };

  return (
    <Container size="xl">
      <Grid>
        <Grid.Col span={3}>
          <NavLink icon={<IconUser />} label="Account Settings">
            <NavLink
              active={location.pathname === "/account/settings/profile"}
              label="Profile Management"
              onClick={() => {
                onLinkClick("profile");
              }}
            />
            <NavLink
              active={location.pathname === "/account/settings/security"}
              label="Security"
              onClick={() => {
                onLinkClick("security");
              }}
            />
          </NavLink>
          <NavLink icon={<IconCards />} label="Billing and Plans">
            <NavLink
              active={location.pathname === "/account/settings/payment-methods"}
              label="Payment Methods"
              onClick={() => {
                onLinkClick("payment-methods");
              }}
            />
          </NavLink>
          <NavLink icon={<IconBuilding />} label="Business Management">
            <NavLink
              active={location.pathname === "/account/settings/manage-seats"}
              label="Manage Seats"
              onClick={() => {
                onLinkClick("manage-seats");
              }}
            />
          </NavLink>
        </Grid.Col>
        <Grid.Col span={9}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default SettingsLayout;
