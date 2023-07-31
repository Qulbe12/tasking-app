import { Button, Flex, Modal, Stack, Text } from "@mantine/core";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { acceptInvitation } from "../../redux/api/authApi";

const InvitationDetailsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { invitationId, token, businessName, ownerName } = useParams();

  const { loading } = useAppSelector((state) => state.auth);

  const handleAccept = async () => {
    if (!invitationId || !token) return;
    await dispatch(acceptInvitation({ invitationId, token }));
    navigate("/");
  };

  return (
    <div>
      <Modal
        title="You have been invited"
        centered
        opened
        onClose={() => {
          //
        }}
      >
        <Stack>
          <Text>
            You have been invite to join {businessName} by {ownerName}
          </Text>
          <Flex gap="md">
            <Button loading={loading} onClick={handleAccept} w="100%">
              Accept
            </Button>
          </Flex>
        </Stack>
      </Modal>
    </div>
  );
};

export default InvitationDetailsPage;
