import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Menu,
  Paper,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IconDotsVertical, IconPlus, IconTrash } from "@tabler/icons";
import ConfirmationModal from "../../modals/ConfirmationModal";
import { deleteSignature, getSignatures } from "../../redux/api/signatureApi";
import SignatureModal from "../../modals/SignatureModal";

const SignatureManagement = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    signatures,
    loaders: { deleting },
  } = useAppSelector((state) => state.signatures);

  const [selectedSignature, setSelectedSignature] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  useEffect(() => {
    dispatch(getSignatures());
  }, []);

  return (
    <Paper mt="md">
      <Card>
        <Group align="center" position="apart" mb="md">
          <Title order={4}>{t("manageSignatures")}</Title>
          <Button onClick={() => setShowSignatureModal(true)} leftIcon={<IconPlus size="1em" />}>
            {t("addSignature")}
          </Button>
        </Group>
        <Grid>
          {signatures.length <= 0 && (
            <Text>
              {t("noSignatureAdded")},{" "}
              <Anchor onClick={() => setShowSignatureModal(true)} component="button">
                {t("addSignature")}.
              </Anchor>
            </Text>
          )}
          {signatures.map((s) => {
            return (
              <Grid.Col key={s.id} span={4}>
                <Card
                  h="100%"
                  withBorder
                  className="hover:cursor-pointer hover:-translate-y-1"
                  onClick={() => setSelectedSignature(s.id)}
                  bg={selectedSignature === s.id ? "indigo" : undefined}
                  pos="relative"
                >
                  {selectedSignature === s.id && (
                    <Menu>
                      <Menu.Target>
                        <ActionIcon pos="absolute" right={16} top={16}>
                          <IconDotsVertical size="1em" />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          icon={<IconTrash size="1em" />}
                          onClick={() => setShowConfirmModal(true)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  )}
                  <div dangerouslySetInnerHTML={{ __html: s.value }} />
                  <Divider my="md" />
                  <Box>
                    <Text>{s.name}</Text>
                  </Box>
                </Card>
              </Grid.Col>
            );
          })}
        </Grid>
      </Card>

      <SignatureModal onClose={() => setShowSignatureModal(false)} opened={showSignatureModal} />
      <ConfirmationModal
        loading={deleting}
        onClose={() => setShowConfirmModal(false)}
        onOk={() => {
          if (!selectedSignature) return;
          dispatch(deleteSignature(selectedSignature));
        }}
        opened={showConfirmModal}
        type="delete"
        title={t("areYouSure?")}
        body="Are you sure?"
      />
    </Paper>
  );
};

export default SignatureManagement;
