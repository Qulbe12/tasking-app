import {
  Badge,
  Button,
  Card,
  Center,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getAllPaymentMethods, setDefaultMethod } from "../../redux/api/stripeApi";
import { IconPlus } from "@tabler/icons";
import PaymentInformationForm from "../../components/PaymentInformationForm";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";

const PaymentMethodsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    paymentMethods,
    loaders: { gettingPaymentMethods, settingDefaultMethod },
  } = useAppSelector((state) => state.stripe);

  useEffect(() => {
    dispatch(getAllPaymentMethods());
  }, []);

  const [showCardForm, { toggle: toggleCardForm }] = useDisclosure(false);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleDefaultPaymentMethodClick = async () => {
    if (selectedCard) {
      await dispatch(setDefaultMethod(selectedCard));
      setSelectedCard(null);
    }
  };

  return (
    <Paper mt="md">
      <Card>
        <Title mb="md" order={4}>
          {t("paymentMethods")}
        </Title>

        <SimpleGrid cols={3}>
          {!gettingPaymentMethods &&
            paymentMethods.map((p) => {
              return (
                <Paper
                  withBorder
                  bg={selectedCard === p.id ? "indigo" : undefined}
                  key={p.id}
                  p="md"
                  className="cursor-pointer"
                  onClick={() => setSelectedCard(p.id)}
                >
                  <Stack>
                    <Group position={p.default ? "apart" : "right"}>
                      {p.default && <Badge>{t("default")}</Badge>}
                      <Badge radius="sm" size="xl">
                        {p.card.brand}
                      </Badge>
                    </Group>
                    <Group>
                      <Text size="xl">**** **** **** {p.card.last4}</Text>
                    </Group>
                    <Group position="right">
                      <Text size="xs">Exp:</Text>
                      <Text>
                        {p.card.exp_month}/{p.card.exp_year}
                      </Text>
                    </Group>
                  </Stack>
                </Paper>
              );
            })}

          {!gettingPaymentMethods && (
            <Paper
              h="147px"
              className="cursor-pointer active:translate-y-1 hover:-translate-y-1"
              onClick={toggleCardForm}
            >
              <Center h="100%">
                <IconPlus />
              </Center>
            </Paper>
          )}

          {gettingPaymentMethods && (
            <>
              <Skeleton h="147px" />
              <Skeleton h="147px" />
              <Skeleton h="147px" />
            </>
          )}
        </SimpleGrid>

        {selectedCard && (
          <Group mt="md" position="right">
            <Button variant="subtle" onClick={() => setSelectedCard(null)}>
              {t("cancel")}
            </Button>
            <Button loading={settingDefaultMethod} onClick={handleDefaultPaymentMethodClick}>
              {t("setAsDefaultPaymentMethod")}
            </Button>
          </Group>
        )}
      </Card>

      <Modal title={t("addNewCard")} opened={showCardForm} onClose={toggleCardForm}>
        <PaymentInformationForm afterComplete={toggleCardForm} />
      </Modal>
    </Paper>
  );
};

export default PaymentMethodsPage;
