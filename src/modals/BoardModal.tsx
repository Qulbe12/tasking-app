import { Button, Group, Modal, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect } from "react";
import { addBoard } from "../redux/boardsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";

const BoardModal = ({ opened, onClose, title }: CommonModalProps) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.boards);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      members: [],
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await dispatch(addBoard(values));
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Project Name" {...form.getInputProps("title")} />
          <Textarea
            withAsterisk
            autosize
            minRows={3}
            label="Project Description"
            {...form.getInputProps("description")}
          />

          <Group position="right" mt="md">
            <Button loading={!!loading} type="submit">
              Create Project
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default BoardModal;
