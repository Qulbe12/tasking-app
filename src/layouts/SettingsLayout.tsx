import { Container, Grid, NavLink } from "@mantine/core";
import { IconBuilding, IconCards, IconUser } from "@tabler/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { useMemo } from "react";

const SettingsLayout = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const { user } = useAppSelector((state) => state.auth);

  const isOwner = useMemo(() => {
    return user?.user.business.isOwner;
  }, [user]);

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
          {isOwner && (
            <NavLink icon={<IconCards />} label="Billing and Plans">
              <NavLink
                active={location.pathname === "/account/settings/payment-methods"}
                label="Payment Methods"
                onClick={() => {
                  onLinkClick("payment-methods");
                }}
              />
            </NavLink>
          )}
          {isOwner && (
            <NavLink icon={<IconBuilding />} label="Business Management">
              <NavLink
                active={location.pathname === "/account/settings/manage-seats"}
                label="Manage Seats"
                onClick={() => {
                  onLinkClick("manage-seats");
                }}
              />
            </NavLink>
          )}
        </Grid.Col>
        <Grid.Col span={9}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default SettingsLayout;
