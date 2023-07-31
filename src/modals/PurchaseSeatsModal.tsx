import React, { useState } from "react";
import CommonModalProps from "./CommonModalProps";
import {
  Badge,
  Button,
  Divider,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { purchaseSeats } from "../redux/api/businessApi";

const PurchaseSeatsModal = ({ onClose, opened }: CommonModalProps) => {
  const dispatch = useAppDispatch();

  const { businessInfo, loading } = useAppSelector((state) => state.business);

  const [seats, setSeats] = useState(3);

  const handleSubmit = async () => {
    await dispatch(purchaseSeats(seats));
    setSeats(3);
    onClose();
  };

  return (
    <Modal
      title={`Purchase Seats for ${businessInfo?.name}`}
      opened={opened}
      onClose={() => {
        onClose();
      }}
    >
      <Stack>
        <NumberInput
          size="lg"
          withAsterisk
          value={seats}
          onChange={(e) => {
            if (e) {
              setSeats(e);
            }
          }}
          label="Number of seats to purchase"
          min={3}
        />

        <Title order={4}>Purchase Summary</Title>

        <Divider my="md" />
        <Group position="apart">
          <Text>Seat Cost</Text>
          <Text>$5.00/seat</Text>
        </Group>
        <Group position="apart">
          <Text>Seats</Text>
          <Text>{seats}</Text>
        </Group>
        <Group position="apart">
          <Text>Total</Text>
          <Text>${seats * 5}.00</Text>
        </Group>
        <Group position="apart">
          <Text>Billed Now</Text>
          <Group>
            <Badge size="lg" radius="sm">
              USD
            </Badge>
            <Text size="xl">${seats * 5}.00</Text>
          </Group>
        </Group>
        <Divider my="md" />

        <Button loading={loading} onClick={handleSubmit} w="100%">
          Purchase
        </Button>
      </Stack>
    </Modal>
  );
};

export default PurchaseSeatsModal;
