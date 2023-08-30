import { Button, Group, Modal, Stack, Switch, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import React, { useEffect } from "react";
import CommonModalProps from "./CommonModalProps";
import { IEventCreate } from "../interfaces/nylas/IEventCreate";
import { useAppDispatch } from "../redux/store";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import dayjs from "dayjs";
import { createEvent } from "../redux/api/nylasApi";

type AddEventCalendar = {
  calendarId: string;
} & CommonModalProps;

const AddEventCalendar = ({ title, opened, onClose, calendarId }: AddEventCalendar) => {
  const validationSchema: any = yup.object().shape({
    title: yup.string().required("Please enter title of the event"),
    calendar_id: yup.string(),
    location: yup.string().required("Please enter the location"),
    description: yup.string().required("Please enter the description"),
    busy: yup.boolean(),
    time: yup.date().required("Please select time for event"),
    timezone: yup.string(),
  });
  const form = useForm({
    initialValues: {
      title: "",
      calendar_id: "",
      description: "",
      location: "",
      busy: false,
      time: 0,
      timezone: "",
    },
    validate: yupResolver(validationSchema),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    form.values.calendar_id = calendarId;
  }, [calendarId]);

  useEffect(() => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    form.values.timezone = timeZone;
  }, []);
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (values.calendar_id != "") {
            const format = "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ";
            const date = dayjs(values.time, { format });
            const seconds = date.unix();
            const createEventDetail: IEventCreate = {
              title: values.title,
              calendar_id: values.calendar_id,
              description: values.description,
              location: values.location,
              busy: values.busy,
              when: {
                time: seconds,
                timezone: values.timezone,
              },
            };
            await dispatch(createEvent(createEventDetail));
            onClose();
          }
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Event title" {...form.getInputProps("title")} />
          <TextInput withAsterisk label="Description" {...form.getInputProps("description")} />
          <TextInput withAsterisk label="Location" {...form.getInputProps("location")} />
          <TimeInput withAsterisk label="Time" {...form.getInputProps("time")} maw={400} />
          <Switch label="Busy" checked={form.values.busy} {...form.getInputProps("busy")} />
          <Group position="right" mt="md">
            <Button type="submit">Add Event</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddEventCalendar;
