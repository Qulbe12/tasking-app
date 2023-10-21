import { Button, Flex, Group, Modal, Stack, Switch, TextInput } from "@mantine/core";
import { DatePicker, TimeInput } from "@mantine/dates";
import React, { useCallback, useEffect } from "react";
import CommonModalProps from "./CommonModalProps";
import { IEventCreate } from "../interfaces/nylas/IEventCreate";
import { useAppDispatch, useAppSelector } from "../redux/store";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { createEvent } from "../redux/api/nylasApi";

type AddEventCalendar = {
  calendarId: string;
  selectedDate?: Date;
} & CommonModalProps;

const AddEventCalendar = ({
  title,
  opened,
  onClose,
  calendarId,
  selectedDate,
}: AddEventCalendar) => {
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.nylas);

  const validationSchema: any = yup.object().shape({
    title: yup.string().required("Please enter title of the event"),
    calendar_id: yup.string(),
    location: yup.string().required("Please enter the location"),
    description: yup.string().required("Please enter the description"),
    busy: yup.boolean(),
    startDate: yup.date().required("Please select start date for event"),
    endDate: yup.date().required("Please select end date for event"),
  });

  const form = useForm({
    initialValues: {
      title: "",
      calendar_id: "",
      description: "",
      location: "",
      busy: false,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
    },
    validate: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (!selectedDate) return;
    const newStartDate = new Date(selectedDate);
    const newEndDate = new Date(new Date(newStartDate).setHours(newStartDate.getHours() + 3));

    form.setValues({
      ...form.values,
      calendar_id: calendarId,
      startDate: newStartDate,
      endDate: newEndDate,
    });
  }, [calendarId, selectedDate]);

  const handleFormSubmit = useCallback(
    (values: typeof form.values) => {
      if (values.calendar_id != "") {
        let newStartDate = new Date();
        newStartDate = values.startDate;
        newStartDate.setHours(values.startTime.getHours());
        newStartDate.setMinutes(values.startTime.getMinutes());

        let newEndDate = new Date();
        newEndDate = values.endDate;
        newEndDate.setHours(values.endTime.getHours());
        newEndDate.setMinutes(values.endTime.getMinutes());

        const createEventDetail: IEventCreate = {
          title: values.title,
          calendar_id: values.calendar_id,
          description: values.description,
          location: values.location,
          busy: values.busy,
          when: {
            start_time: newStartDate.getTime() / 1000,
            end_time: newEndDate.getTime() / 1000,
          },
        };

        dispatch(createEvent(createEventDetail)).finally(() => {
          form.reset();
          onClose();
        });
      }
    },
    [form.values],
  );

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Stack>
          <TextInput withAsterisk label="Event title" {...form.getInputProps("title")} />
          <TextInput withAsterisk label="Description" {...form.getInputProps("description")} />
          <TextInput withAsterisk label="Location" {...form.getInputProps("location")} />
          <Flex direction="row" w="100%" justify="space-between">
            <DatePicker
              w="45%"
              defaultValue={selectedDate || new Date()}
              label="Start date"
              {...form.getInputProps("startDate")}
            />
            <TimeInput
              defaultValue={selectedDate || new Date()}
              format="24"
              label="Start time"
              w="45%"
              {...form.getInputProps("startTime")}
            />
          </Flex>
          <Flex direction="row" w="100%" justify="space-between">
            <DatePicker
              w="45%"
              defaultValue={selectedDate || new Date()}
              label="End date"
              {...form.getInputProps("endDate")}
            />
            <TimeInput
              defaultValue={selectedDate || new Date()}
              format="24"
              label="End time"
              w="45%"
              {...form.getInputProps("endTime")}
            />
          </Flex>
          <Switch label="Busy" checked={form.values.busy} {...form.getInputProps("busy")} />
          <Group position="right" mt="md">
            <Button loading={loaders.creatingEvent} type="submit">
              Add Event
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddEventCalendar;
