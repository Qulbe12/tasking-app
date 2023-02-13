import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { ICreateWorkspace, IWorkspace } from "hexa-sdk";
import React, { useEffect } from "react";
import { createWorkspace, updateWorkspace } from "../redux/api/workspacesApi";

import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";

type WorkspaceModalProps = {
  workspace?: IWorkspace;
};

const WorkspaceModal = ({
  opened,
  onClose,
  title,
  workspace,
}: CommonModalProps & WorkspaceModalProps) => {
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.workspaces);

  const form = useForm<ICreateWorkspace>({
    initialValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (!workspace) return;
    form.setValues({
      name: workspace.name,
    });
  }, [workspace]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!workspace) {
            await dispatch(createWorkspace(values));
          } else {
            await dispatch(
              updateWorkspace({
                workspace: values,
                workSpaceId: workspace.id,
              }),
            );
          }
          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Workspace Name" {...form.getInputProps("name")} />

          <Group position="right" mt="md">
            <Button loading={!!loaders.adding || loaders.updating === workspace?.id} type="submit">
              {workspace ? "Update" : "Create Project"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default WorkspaceModal;