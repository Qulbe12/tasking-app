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
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons";
import {
  DocumentPriority,
  DocumentStatus,
  FieldType,
  ICreateField,
  IField,
  ITemplate,
} from "hexa-sdk/dist/app.api";
import React, { useEffect, useState } from "react";
import DynamicField from "../components/DynamicField";
import {
  addTemplate,
  addTemplateField,
  deleteTemplate,
  deleteTemplateFields,
  updateTemplate,
  updateTemplateFields,
} from "../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import * as yup from "yup";
import { DatePicker } from "@mantine/dates";

type TemplateModalProps = {
  template?: ITemplate;
};

const TemplateModal = ({ onClose, opened, template }: ModalProps & TemplateModalProps) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.templates);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { user } = useAppSelector((state) => state.auth);
  const [field, setField] = useState<IField>({
    id: "",
    key: "",
    options: [],
    required: false,
    type: FieldType.Text,
    label: "",
  });

  const [fieldVals, setFieldVals] = useState<ICreateField>({
    label: "",
    options: [],
    required: false,
    type: FieldType.Text,
  });

  const [newFieldModal, setNewFieldModal] = useState(false);
  const [updateFieldModal, setUpdateFieldModal] = useState(false);

  const formSchema = yup.object().shape({
    name: yup.string().required("Document type is required"),
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: yupResolver(formSchema),
  });

  useEffect(() => {
    form.setValues({ name: template?.name });
  }, [template]);

  return (
    <Modal
      centered
      title={template ? `Edit ${template?.name}` : "Add New Form"}
      opened={opened}
      onClose={onClose}
    >
      <form
        onSubmit={form.onSubmit(async (values) => {
          const { name } = values;
          if (template) {
            await dispatch(updateTemplate({ templateId: template.id, template: { name } }));
          } else {
            if (!activeWorkspace?.id) return;
            await dispatch(addTemplate({ template: { name }, workspaceId: activeWorkspace?.id }));
          }

          form.reset();
          onClose();
        })}
      >
        <Stack>
          <TextInput
            withAsterisk
            disabled={template?.default}
            label="Document Type"
            placeholder="Invoice"
            {...form.getInputProps("name")}
          />

          <Divider label="Default Fields" />
          <Stack>
            <TextInput label="Title" withAsterisk disabled />
            <Textarea label="Description" withAsterisk disabled />
            <DatePicker label="Start Date" withAsterisk disabled />
            <DatePicker label="Due Date" withAsterisk disabled />
            <Select
              disabled
              label="Priority"
              placeholder="Pick one"
              withAsterisk
              data={[
                { value: DocumentPriority.Low, label: "Low" },
                { value: DocumentPriority.High, label: "High" },
                { value: DocumentPriority.Urgent, label: "Urgent" },
              ]}
            />
            <Select
              label="Status"
              placeholder="Pick one"
              withAsterisk
              data={[
                { value: DocumentStatus.Todo, label: "Todo" },
                { value: DocumentStatus.InProgresss, label: "In Progress" },
                { value: DocumentStatus.Complete, label: "Complete" },
              ]}
            />
          </Stack>

          {!template?.default && template && activeBoard?.owner.email === user?.user.email && (
            <Flex gap="md">
              <Text>Fields</Text>
              <ActionIcon variant="filled" color="blue" onClick={() => setNewFieldModal(true)}>
                <IconPlus size={16} />
              </ActionIcon>
            </Flex>
          )}

          {template?.fields.map((f) => {
            return (
              <Flex key={f.id} align="end" gap="md">
                <DynamicField field={f} />
                <ActionIcon
                  color="indigo"
                  variant={"filled"}
                  size="lg"
                  onClick={() => {
                    setUpdateFieldModal(true);
                    setField(f);
                  }}
                >
                  <IconEdit />
                </ActionIcon>
                <ActionIcon
                  color="red"
                  variant={"filled"}
                  size="lg"
                  onClick={() => {
                    dispatch(deleteTemplateFields({ field: f.id, fieldId: template?.id }));
                  }}
                >
                  <IconTrash />
                </ActionIcon>
              </Flex>
            );
          })}

          <Group position="apart" mt="md">
            {template && !template.default && activeBoard?.owner.email === user?.user.email && (
              <Button
                color="red"
                loading={!!loading}
                onClick={async () => {
                  if (!template) return;
                  await dispatch(deleteTemplate(template.id));
                }}
              >
                Delete
              </Button>
            )}
            <Group position="right">
              <Button onClick={onClose}>
                {activeBoard?.owner.email === user?.user.email ? "Cancel" : "Close"}
              </Button>
              {!template?.default && activeBoard?.owner.email === user?.user.email && (
                <Button loading={!!loading} type="submit">
                  {template ? "Update" : "Create Form"}
                </Button>
              )}
            </Group>
          </Group>
        </Stack>
      </form>

      {/* update field */}
      <Modal
        centered
        opened={updateFieldModal}
        onClose={() => {
          setFieldVals({ label: "", options: [], required: false, type: FieldType.Text });
          setNewFieldModal(false);
        }}
        title="Update field"
      >
        <Stack mb="xl">
          <TextInput
            required
            label="Field Label"
            defaultValue={field.key}
            onChange={(e) => setFieldVals({ ...fieldVals, label: e.target.value })}
          />
          <Select
            required
            value={field.type}
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
              label="Options"
              data={[]}
              withAsterisk
              required
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
            label: field.label,
            options: field.options,
            required: field.required,
            type: field.type,
          }}
        />
        <Group mt="xl" position="right">
          <Button onClick={() => setUpdateFieldModal(false)}>Cancel</Button>
          <Button
            loading={!!loading}
            onClick={async () => {
              if (!template) return;

              const { label, options, required, type } = fieldVals;

              await dispatch(
                updateTemplateFields({
                  fieldId: template.id,
                  updatedField: { label, options, required, type },
                  field: field.id,
                }),
              );
              setUpdateFieldModal(false);
            }}
          >
            Update field
          </Button>
        </Group>
      </Modal>

      {/* add new field */}
      <Modal
        centered
        opened={newFieldModal}
        onClose={() => {
          setFieldVals({ label: "", options: [], required: false, type: FieldType.Text });
          setNewFieldModal(false);
        }}
        title="Add new field"
      >
        <Stack mb="xl">
          <TextInput
            required
            label="Field Label"
            onChange={(e) => setFieldVals({ ...fieldVals, label: e.target.value })}
          />
          <Select
            required
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
              label="Options"
              data={[]}
              withAsterisk
              required
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
          <Button onClick={() => setNewFieldModal(false)}>Cancel</Button>
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
