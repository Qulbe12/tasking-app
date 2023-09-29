import { Container, Grid, NavLink } from "@mantine/core";
import { IconBuilding, IconCards, IconUser } from "@tabler/icons";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const SettingsLayout = () => {
  const { t } = useTranslation();
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
          <NavLink icon={<IconUser />} label={t("accountSettings")} opened>
            <NavLink
              active={location.pathname === "/account/settings/profile"}
              label={t("profileManagement")}
              onClick={() => {
                onLinkClick("profile");
              }}
            />
            <NavLink
              active={location.pathname === "/account/settings/security"}
              label={t("security")}
              onClick={() => {
                onLinkClick("security");
              }}
            />
          </NavLink>
          {isOwner && (
            <NavLink icon={<IconCards />} label={t("billingAndPlans")} opened>
              <NavLink
                active={location.pathname === "/account/settings/payment-methods"}
                label={t("paymentMethods")}
                onClick={() => {
                  onLinkClick("payment-methods");
                }}
              />
            </NavLink>
          )}
          {isOwner && (
            <NavLink icon={<IconBuilding />} label={t("businessManagement")} opened>
              <NavLink
                active={location.pathname === "/account/settings/manage-seats"}
                label={t("manageSeats")}
                onClick={() => {
                  onLinkClick("manage-seats");
                }}
              />
              <NavLink
                active={location.pathname === "/account/settings/business-profile"}
                label={t("businessProfile")}
                onClick={() => {
                  onLinkClick("business-profile");
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
