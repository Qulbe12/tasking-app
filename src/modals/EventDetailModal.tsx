import { Badge, Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import React from "react";
import CommonModalProps from "./CommonModalProps";
import { ICalendarEvent } from "../interfaces/nylas/ICalendarEvents";
import { IconClock, IconLocation } from "@tabler/icons";
import dayjs from "dayjs";

type EventDetailModalProps = {
  event?: ICalendarEvent;
} & CommonModalProps;

const EventDetailModal = ({ title, opened, onClose, event }: EventDetailModalProps) => {
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <Stack>
        <Title order={3} weight="normal">
          {event?.resource.title} {event?.resource.busy && <Badge>Busy</Badge>}
        </Title>

        {event && <div dangerouslySetInnerHTML={{ __html: event.resource.description }} />}
        <Group>
          <IconClock size={"1em"} />
          <Text>
            {dayjs(event?.start).format("MMMM DD YYYY")} -{" "}
            {dayjs(event?.end).format("MMMM DD YYYY")}
          </Text>
        </Group>
        <Group>
          <IconLocation size={"1em"} />
          {event?.resource.location}
        </Group>

        <Group position="right" mt="md">
          <Button onClick={onClose}>Close</Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EventDetailModal;
