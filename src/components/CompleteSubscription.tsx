import {
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Header from "./Header";
import IPlansResponse from "../interfaces/stripe/IPlansResponse";
import { axiosPrivate } from "../config/axios";
import { showError } from "../redux/commonSliceFunctions";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { getAllPaymentMethods } from "../redux/api/stripeApi";

import PaymentInformationForm from "./PaymentInformationForm";
import { subscribeToPlan } from "../redux/api/authApi";

const CompleteSubscription = () => {
  const dispatch = useAppDispatch();
  const [plans, setPlans] = useState<IPlansResponse[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);

  const { paymentMethods } = useAppSelector((state) => state.stripe);
  const { loading: subscribing } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const getPlans = async () => {
      try {
        setPlansLoading(true);
        const res = await axiosPrivate.get<IPlansResponse[]>("/stripe/plans");
        setPlans(res.data);
        setPlansLoading(false);
      } catch (err) {
        setPlansLoading(false);
        showError("Something went wrong please refresh the page and try again");
      }
    };

    dispatch(getAllPaymentMethods());
    getPlans();
  }, []);

  const handleSubscriptionClick = () => {
    dispatch(subscribeToPlan(plans[0].id));
  };

  return (
    <div>
      <Paper p="md">
        <Header isUnsubscribed />
      </Paper>
      {plans.length > 0 && (
        <Container size="sm">
          <Title mb="md" order={2}>
            Subscribe to Hexadesk
          </Title>
          <SimpleGrid cols={2}>
            {plansLoading ? (
              <Skeleton height={95} />
            ) : (
              <Card className="cursor-pointer" withBorder bg="indigo">
                <Stack spacing="sm">
                  <Text fw={700}>Billed Monthly</Text>
                  <Text size="md">${plans[0].amount * 3}/month</Text>
                </Stack>
              </Card>
            )}
          </SimpleGrid>

          <Title mb="md" order={2} my="md">
            Payment Details
          </Title>

          <Grid>
            {paymentMethods.map((p) => {
              return (
                <Grid.Col span={4} key={p.id}>
                  <Card className="cursor-pointer" bg="indigo">
                    <Text size="lg">**** **** **** {p.card.last4}</Text>
                    <Text size="sm">
                      Exp: {p.card.exp_month}/{p.card.exp_year}
                    </Text>
                  </Card>
                </Grid.Col>
              );
            })}
          </Grid>

          {paymentMethods.length <= 0 && <PaymentInformationForm />}

          {paymentMethods.length > 0 && (
            <>
              <Title mb="md" order={2} my="md">
                Summary
              </Title>
              <Divider my="md" />
              <Group position="apart">
                <Text>Seats</Text>
                <Text>3</Text>
              </Group>
              <Group position="apart">
                <Text>Amount</Text>
                <Text>${plans[0].amount}.00/seat</Text>
              </Group>
              <Group position="apart">
                <Text>Subtotal</Text>
                <Text>${plans[0].amount * 3}.00</Text>
              </Group>
              <Group position="apart">
                <Text>Billed Now</Text>
                <Group>
                  <Badge size="lg" radius="sm">
                    USD
                  </Badge>
                  <Text size="xl">${plans[0].amount * 3}.00</Text>
                </Group>
              </Group>
              <Divider my="md" />

              <Group position="right">
                <Button loading={subscribing} onClick={handleSubscriptionClick}>
                  Subscribe
                </Button>
              </Group>
            </>
          )}
        </Container>
      )}
    </div>
  );
};

export default CompleteSubscription;
