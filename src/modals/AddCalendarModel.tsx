import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { createCalendar } from "../redux/api/nylasApi";
import { useAppDispatch } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";

type AddCalendarModel = CommonModalProps;
const AddCalendarModel = ({ opened, onClose, title }: AddCalendarModel) => {
  const validationSchema: any = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    location: yup.string().required("Location is required"),
    timezone: yup.string(),
  });
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      location: "",
      timezone: "",
    },
    validate: yupResolver(validationSchema),
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    form.values.timezone = timeZone;
  }, []);
  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const newCalendar = {
            name: values.name,
            description: values.description,
            location: values.location,
            timezone: values.timezone,
          };
          dispatch(createCalendar(newCalendar));
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Calendar name" {...form.getInputProps("name")} />
          <TextInput withAsterisk label="Description" {...form.getInputProps("description")} />
          <TextInput withAsterisk label="Location" {...form.getInputProps("location")} />
          <Group position="right" mt="md">
            <Button type="submit">Add Calendar</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddCalendarModel;
