import {
  Button,
  Group,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ICreateGroup } from "hexa-sdk/dist/app.api";
import React, { useState } from "react";
import CommonModalProps from "../../../modals/CommonModalProps";
import { createGroup } from "../../../redux/api/groupsApi";
import { useAppDispatch, useAppSelector } from "../../../redux/store";

const CreateGroupModal = ({ onClose, opened }: CommonModalProps) => {
  const form = useForm<ICreateGroup>({
    initialValues: {
      name: "",
      templateId: "",
      ccUsers: [],
    },
  });

  const { loading, data } = useAppSelector((state) => state.templates);
  const { loaders } = useAppSelector((state) => state.groups);

  const { activeBoard } = useAppSelector((state) => state.boards);

  const dispatch = useAppDispatch();

  const [ccUsers, setCcUsers] = useState<string[]>([]);

  return (
    <Modal opened={opened} title={"Create New Group"} onClose={onClose}>
      <LoadingOverlay visible={!!loading} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!activeBoard?.id) return;
          await dispatch(createGroup({ group: values, boardId: activeBoard?.id }));
          form.reset();
          onClose();
        })}
      >
        <Stack spacing={16}>
          <TextInput label="Group Title" {...form.getInputProps("name")} />
          <Select
            label="Document Type"
            placeholder="Pick one"
            data={data.map((d) => {
              return { label: d.name, value: d.id };
            })}
            {...form.getInputProps("templateId")}
          />

          <MultiSelect
            label="User Emails"
            data={ccUsers}
            placeholder="Select items"
            searchable
            creatable
            getCreateLabel={(query) => `+ Add ${query}`}
            onCreate={(query) => {
              setCcUsers((current) => [...current, query]);
              return query;
            }}
            {...form.getInputProps("ccUsers")}
          />

          <Group position="right">
            <Button loading={loaders.adding} type="submit">
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
