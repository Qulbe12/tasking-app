import { Button, Group, Modal, Stack, Textarea, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { IBoard } from "hexa-sdk/dist/app.api";
import React, { useEffect } from "react";
import { addBoard, updateBoard } from "../redux/api/boardsApi";

import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

type BoardModalProps = {
  board?: IBoard;
};

const BoardModal = ({ opened, onClose, title, board }: CommonModalProps & BoardModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  const formSchema = yup.object().shape({
    title: yup.string().required("Board title is required"),
    description: yup.string(),
  });

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      members: [],
    },
    validate: yupResolver(formSchema),
  });

  useEffect(() => {
    if (!board) return;
    form.setValues({
      title: board?.title,
      description: board?.description,
    });
  }, [board]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!board) {
            if (!activeWorkspace?.id) return;
            await dispatch(
              addBoard({
                workspaceId: activeWorkspace?.id,
                board: { description: values.description, title: values.title },
              }),
            );
          } else {
            await dispatch(
              updateBoard({
                id: board.id,
                board: { title: form.values.title, description: form.values.description },
              }),
            );
          }
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput withAsterisk label={t("boardName")} {...form.getInputProps("title")} />
          <Textarea
            autosize
            minRows={3}
            label={t("boardDescription")}
            {...form.getInputProps("description")}
          />

          <Group position="right" mt="md">
            <Button loading={!!loaders.adding || loaders.updating === board?.id} type="submit">
              {board ? t("updateBoard") : t("createBoard")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default BoardModal;
