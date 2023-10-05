import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { createContact } from "../redux/api/nylasApi";

const AddContactModel = ({ opened, onClose, title }: CommonModalProps) => {
  const { loaders } = useAppSelector((state) => state.nylas);
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    phone: yup.string().required("Phone is required"),
  });
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validate: yupResolver(validationSchema),
  });
  const dispatch = useAppDispatch();

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async () => {
          await dispatch(
            createContact({
              given_name: form.values.name,
              emails: [
                {
                  email: form.values.email,
                  type: "work",
                },
              ],
              phone_numbers: [
                {
                  number: form.values.phone,
                  type: "business",
                },
              ],
            }),
          );
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Contact name" {...form.getInputProps("name")} />
          <TextInput withAsterisk label="Work email" {...form.getInputProps("email")} />
          <TextInput withAsterisk label="Business phone" {...form.getInputProps("phone")} />
          <Group position="right" mt="md">
            <Button loading={loaders.creatingContact} type="submit">
              Add Contact
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddContactModel;
