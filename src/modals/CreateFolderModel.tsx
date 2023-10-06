import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import React from "react";
import CommonModalProps from "./CommonModalProps";
import { useAppDispatch, useAppSelector } from "../redux/store";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { createFolder } from "../redux/api/nylasApi";
import { ICreateFolder } from "../interfaces/nylas/ICreateFolder";

type AddEventCalendar = CommonModalProps;

const CreateFolderModal = ({ title, opened, onClose }: AddEventCalendar) => {
  const validationSchema: any = yup.object().shape({
    display_name: yup.string().required("Display name is required"),
  });
  const form = useForm({
    initialValues: {
      display_name: "",
    },
    validate: yupResolver(validationSchema),
  });

  const { loaders } = useAppSelector((state) => state.nylas);
  const dispatch = useAppDispatch();

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const createFolderData: ICreateFolder = {
            display_name: values.display_name,
            name: values.display_name,
          };
          await dispatch(createFolder(createFolderData));
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput
            withAsterisk
            label="Name of the folder"
            {...form.getInputProps("display_name")}
          />
          <Group position="right" mt="md">
            <Button loading={loaders.creatingFolder} type="submit">
              Create new folder
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateFolderModal;
