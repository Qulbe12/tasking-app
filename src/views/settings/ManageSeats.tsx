import { Avatar, Button, Card, Group, Paper, Skeleton, Table, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getBusinessInfo } from "../../redux/api/businessApi";
import { useDisclosure } from "@mantine/hooks";
import PurchaseSeatsModal from "../../modals/PurchaseSeatsModal";
import InviteUserModal from "../../modals/InviteUserModal";
import { useTranslation } from "react-i18next";

const ManageSeats = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { businessInfo, loading } = useAppSelector((state) => state.business);

  useEffect(() => {
    dispatch(getBusinessInfo());
  }, []);

  const [showPurchaseModal, { toggle: togglePurchaseModal }] = useDisclosure(false);
  const [showInviteModal, { toggle: toggleInviteModal }] = useDisclosure(false);

  return (
    <Paper mt="md">
      {loading ? (
        <Skeleton h={200} />
      ) : (
        <Card>
          <Group align="center" position="apart">
            <Title mb="md" order={4}>
              {t("manageSeats")}
            </Title>
            <Button size="xs" leftIcon={<IconPlus size={12} />} onClick={togglePurchaseModal}>
              {t("purchaseSeats")}
            </Button>
          </Group>

          <Group>
            <Text>
              <b>{businessInfo?.availableSeats}</b> {t("seatsAvailable")}
            </Text>
          </Group>

          <Table striped my="md">
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("email")}</th>
                <th>{t("role")}</th>
              </tr>
            </thead>
            <tbody>
              {businessInfo?.seats.map((s) => {
                return (
                  <tr key={s.id}>
                    <td>
                      <Group>
                        <Avatar size="xs" src={s.user.avatar} /> {s.user.name}
                      </Group>
                    </td>
                    <td>{s.user.email}</td>
                    <td>{s.user.role}</td>
                  </tr>
                );
              })}

              <tr>
                <td colSpan={4}>
                  <Button w="100%" onClick={toggleInviteModal}>
                    {t("inviteUsers")}
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card>
      )}

      <Card mt="md">
        <Title order={4}>{t("invitedUsers")}</Title>
        <Table>
          <thead>
            <tr>
              <th>{t("email")}</th>
            </tr>
          </thead>
          <tbody>
            {businessInfo?.invitedUsers.map((iu) => {
              return (
                <tr key={iu}>
                  <td>{iu}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>

      <PurchaseSeatsModal opened={showPurchaseModal} onClose={togglePurchaseModal} />
      <InviteUserModal opened={showInviteModal} onClose={toggleInviteModal} />
    </Paper>
  );
};

export default ManageSeats;
