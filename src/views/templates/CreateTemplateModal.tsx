import { Button, Group, Input, Modal, ModalProps, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const CreateTemplateModal = ({ onClose, opened }: ModalProps) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.boards);

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  const [name, setName] = useState("");
  return (
    <Modal title="Add New Form" opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          //   await dispatch(addBoard(values));
          console.log(values);

          //   form.reset();
          //   onClose();
        })}
      >
        <Stack>
          <TextInput
            withAsterisk
            label="Type"
            placeholder="Invoice"
            {...form.getInputProps("name")}
          />

          <Group position="right" mt="md">
            <Button loading={!!loading} type="submit">
              Create Form
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateTemplateModal;
