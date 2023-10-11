import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import React from "react";
import { createCalendar } from "../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";

type AddCalendarModel = {
  calenderId: string;
};
const AddCalendarModel = ({ opened, onClose, title }: CommonModalProps) => {
  const { loaders } = useAppSelector((state) => state.nylas);
  const validationSchema: any = yup.object().shape({
    name: yup.string().required("Name is required"),
  });
  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: yupResolver(validationSchema),
  });
  const dispatch = useAppDispatch();

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit((values) => {
          const newCalendar = {
            name: values.name,
          };
          dispatch(createCalendar(newCalendar));
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Calendar name" {...form.getInputProps("name")} />
          <Group position="right" mt="md">
            <Button loading={loaders.creatingCalendar || loaders.gettingCalendars} type="submit">
              Add Calendar
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddCalendarModel;
