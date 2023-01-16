import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Modal,
  ModalProps,
  MultiSelect,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons";
import { FieldType, ICreateField, ITemplate } from "hexa-sdk";
import React, { useEffect, useState } from "react";
import DynamicField from "../components/DynamicField";
import { addTemplate, addTemplateField, updateTemplate } from "../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../redux/store";

type TemplateModalProps = {
  template?: ITemplate;
};

const TemplateModal = ({ onClose, opened, template }: ModalProps & TemplateModalProps) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.templates);

  const [fieldVals, setFieldVals] = useState<ICreateField>({
    label: "",
    options: [],
    required: false,
    type: FieldType.Text,
  });

  const [newFieldModal, setNewFieldModal] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
    },
  });

  useEffect(() => {
    form.setValues({ name: template?.name });
  }, [template]);

  return (
    <Modal
      centered
      title={`Edit ${template?.name}` || "Add New Form"}
      opened={opened}
      onClose={onClose}
    >
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

          <Flex gap="md" justify="space-between">
            <Text>Fields</Text>
            <ActionIcon variant="filled" color="blue" onClick={() => setNewFieldModal(true)}>
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

      <Modal
        centered
        opened={newFieldModal}
        onClose={() => {
          setNewFieldModal(false);
        }}
        title="Add new field"
      >
        <Stack mb="xl">
          <TextInput
            label="Field Label"
            onChange={(e) => setFieldVals({ ...fieldVals, label: e.target.value })}
          />
          <Select
            value={fieldVals.type}
            onChange={(e) => setFieldVals({ ...fieldVals, type: e as FieldType })}
            label="Field Type"
            placeholder="Pick one"
            data={[
              { value: FieldType.Text, label: "Text" },
              { value: FieldType.Number, label: "Number" },
              { value: FieldType.Date, label: "Date" },
              { value: FieldType.Checkbox, label: "Checkbox" },
              { value: FieldType.Select, label: "Select" },
              { value: FieldType.Radio, label: "Radio" },
              { value: FieldType.Multiselect, label: "Multiselect" },
            ]}
          />

          {fieldVals.type === FieldType.Multiselect ||
          fieldVals.type === FieldType.Radio ||
          fieldVals.type === FieldType.Select ? (
            <MultiSelect
              label="Creatable MultiSelect"
              data={[]}
              placeholder="Select items"
              searchable
              creatable
              getCreateLabel={(query) => `+ Create ${query}`}
              onCreate={(query) => {
                const item = query;
                setFieldVals({ ...fieldVals, options: [...fieldVals.options, item] });

                return item;
              }}
            />
          ) : (
            ""
          )}

          <Checkbox
            label="Required?"
            onChange={(e) => setFieldVals({ ...fieldVals, required: e.target.checked })}
          />
        </Stack>

        <Divider my="md" label="Output" />
        <DynamicField
          field={{
            id: "Demo Id",
            key: "Demo Key",
            label: fieldVals.label,
            options: fieldVals.options,
            required: fieldVals.required,
            type: fieldVals.type,
          }}
        />
        <Group mt="xl" position="right">
          <Button variant="outline" onClick={() => setNewFieldModal(false)}>
            Cancel
          </Button>
          <Button
            loading={!!loading}
            onClick={async () => {
              if (!template) return;

              const { label, options, required, type } = fieldVals;

              await dispatch(
                addTemplateField({
                  templateId: template.id,
                  field: { label, options, required, type },
                }),
              );

              setNewFieldModal(false);
            }}
          >
            Add Field
          </Button>
        </Group>
      </Modal>
    </Modal>
  );
};

export default TemplateModal;
