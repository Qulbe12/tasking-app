import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";
import CommonModalProps from "./CommonModalProps";

const BoardModal = ({ opened, onClose, title }: CommonModalProps) => {
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      members: [],
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit((values) => {
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Project Name" {...form.getInputProps("name")} />
          <TextInput
            withAsterisk
            label="Project Description"
            {...form.getInputProps("description")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Create Project</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default BoardModal;
