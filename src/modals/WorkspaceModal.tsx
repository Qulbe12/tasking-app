import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { ICreateWorkspace, IWorkspace } from "hexa-sdk/dist/app.api";
import React, { useEffect } from "react";
import { createWorkspace, updateWorkspace } from "../redux/api/workspacesApi";

import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import * as yup from "yup";
import { useTranslation } from "react-i18next";

type WorkspaceModalProps = {
  workspace?: IWorkspace;
};

const WorkspaceModal = ({
  opened,
  onClose,
  title,
  workspace,
}: CommonModalProps & WorkspaceModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.workspaces);

  const formSchema = yup.object().shape({
    name: yup.string().required("Workspace name is required"),
  });

  const form = useForm<ICreateWorkspace>({
    initialValues: {
      name: "",
    },
    validate: yupResolver(formSchema),
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
          <TextInput
            error
            withAsterisk
            label={t("workspaceName")}
            {...form.getInputProps("name")}
          />

          <Group position="right" mt="md">
            <Button loading={!!loaders.adding || loaders.updating === workspace?.id} type="submit">
              {workspace ? t("updateWorkspace") : t("createWorkspace")}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default WorkspaceModal;
