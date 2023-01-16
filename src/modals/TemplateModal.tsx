import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  ModalProps,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons";
import { ITemplate } from "hexa-sdk";
import React, { useEffect } from "react";
import DynamicField from "../components/DynamicField";
import { addTemplate, updateTemplate } from "../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../redux/store";

type TemplateModalProps = {
  template?: ITemplate;
};

const TemplateModal = ({ onClose, opened, template }: ModalProps & TemplateModalProps) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.templates);

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.setValues({ name: template?.name });
  }, [template]);

  return (
    <Modal title={`Edit ${template?.name}` || "Add New Form"} opened={opened} onClose={onClose}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { name } = values;
          if (template) {
            await dispatch(updateTemplate({ templateId: template.id, template: { name } }));
          } else {
            await dispatch(addTemplate({ name }));
          }

          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput
            withAsterisk
            label="Type"
            placeholder="Invoice"
            {...form.getInputProps("name")}
          />

          <Flex gap="md">
            <Text>Fields</Text>
            <ActionIcon variant="outline" color="blue">
              <IconPlus size={16} />
            </ActionIcon>
          </Flex>

          {template?.fields.map((f) => {
            return <DynamicField field={f} key={f.id} />;
          })}

          <Group position="right" mt="md">
            <Button loading={!!loading} type="submit">
              {template ? "Update" : "Create Form"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default TemplateModal;
