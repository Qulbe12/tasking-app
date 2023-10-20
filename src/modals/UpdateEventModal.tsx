import { Button, Group, Modal, Stack, Switch, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import CommonModalProps from "./CommonModalProps";
import { IEventCreate } from "../interfaces/nylas/IEventCreate";
import { useAppDispatch, useAppSelector } from "../redux/store";
import * as yup from "yup";
import dayjs from "dayjs";
import { deleteEvent, updateEvent } from "../redux/api/nylasApi";
import { IconEdit, IconTrash } from "@tabler/icons";
import { ICalendarEvent } from "../interfaces/nylas/ICalendarEvents";

type UpdateEventModalProps = {
  calendarId: string;
  event?: ICalendarEvent;
  selectedDate?: Date;
} & CommonModalProps;

const UpdateEventModal = ({
  title,
  opened,
  onClose,
  calendarId,
  event,
  selectedDate,
}: UpdateEventModalProps) => {
  const dispatch = useAppDispatch();
  const { loaders } = useAppSelector((state) => state.nylas);

  const validationSchema = yup.object().shape({
    title: yup.string().required("Please enter title of the event"),
    calendar_id: yup.string(),
    location: yup.string().required("Please enter the location"),
    description: yup.string().required("Please enter the description"),
    busy: yup.boolean(),
  });

  const [form, setForm] = useState<IEventCreate>({
    busy: false,
    calendar_id: "",
    description: "",
    location: "",
    title: "",
    when: {
      end_time: new Date().getTime(),
      start_time: new Date().getTime(),
    },
  });

  useEffect(() => {
    if (!event) return;
    setForm({
      title: event.title,
      calendar_id: calendarId,
      description: event.resource.description,
      location: event.resource.location,
      busy: event.resource.busy,
      when: {
        start_time: event.start.getTime() / 1000,
        end_time: event.end.getTime() / 1000,
      },
    });
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    validationSchema.validate(form);

    if (!event) return;
    if (!form) return;

    const updateEventDetail: IEventCreate = {
      title: form.title,
      calendar_id: calendarId,
      description: form.description,
      location: form.location,
      busy: form.busy,
      when: {
        start_time: form.when?.start_time ?? 0,
        end_time: form.when?.end_time ?? 0,
      },
    };

    await dispatch(updateEvent({ id: event.resource.id, data: updateEventDetail })).finally(() => {
      setForm({
        busy: false,
        calendar_id: "",
        description: "",
        location: "",
        title: "",
        when: {
          end_time: new Date().getTime() / 1000,
          start_time: new Date().getTime() / 1000,
        },
      });
      onClose();
    });
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            withAsterisk
            label="Event title"
            value={form.title ?? ""}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextInput
            withAsterisk
            label="Description"
            value={form.description ?? ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextInput
            withAsterisk
            label="Location"
            value={form.location ?? ""}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <DatePicker
            defaultValue={event?.start || selectedDate || new Date()}
            label="Start date"
            onChange={(e) => {
              if (!e) return;
              const startDateWithoutDatePrefix = e.toString().replace("Date ", "");
              const parsedStartDate = dayjs(startDateWithoutDatePrefix);
              console.log(parsedStartDate);
            }}
          />
          <DatePicker
            defaultValue={event?.start || selectedDate || new Date()}
            label="End date"
            onChange={(e) => {
              if (!e) return;
              const endDateWithoutDatePrefix = e.toString().replace("Date ", "");
              const parsedEndDate = dayjs(endDateWithoutDatePrefix);
              console.log(parsedEndDate);
            }}
          />
          <Switch
            label="Busy"
            checked={form.busy}
            onChange={(e) => setForm({ ...form, busy: e.target.checked })}
          />
          <Group position="right" mt="md">
            <Button
              type="button"
              loading={!!loaders.updatingEvent}
              leftIcon={<IconTrash />}
              color="red"
              onClick={async () => {
                if (!event) return;
                await dispatch(deleteEvent(event.resource.id));

                onClose();
              }}
            >
              Delete Event
            </Button>
            <Button type="submit" leftIcon={<IconEdit />} loading={!!loaders.updatingEvent}>
              Update Event
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateEventModal;
