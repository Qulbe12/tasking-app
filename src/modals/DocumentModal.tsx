import {
  ActionIcon,
  Button,
  Flex,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { DocumentPriority, DocumentStatus, ICreateDocument, IField } from "hexa-sdk/dist/app.api";
import React, { useEffect, useMemo, useState } from "react";
import { getAllTemplates } from "../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import DynamicField from "../components/DynamicField";
import CustomDropzone from "../components/CustomDropzone";
import { createDocument } from "../redux/api/documentApi";
import { DatePicker } from "@mantine/dates";
import TemplateModal from "./TemplateModal";
import { FileWithPath } from "@mantine/dropzone";
import { showError } from "../redux/commonSliceFunctions";
import { IconX } from "@tabler/icons";
import * as yup from "yup";

const DocumentModal = ({ onClose, opened, title }: CommonModalProps) => {
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((state) => state.templates);
  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { loaders: docLoaders } = useAppSelector((state) => state.documents);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    dispatch(getAllTemplates(activeWorkspace.id));
  }, []);

  const [fields, setFields] = useState<IField[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const formSchema = useMemo(() => {
    const schema: any = {
      title: yup.string().required("Document title is required"),
      description: yup.string().required("Description is required"),
      startDate: yup.date().required("Start date is required"),
      dueDate: yup.date().required("Due date is required"),
      priority: yup.string().required("Priority is required"),
      status: yup.string().required("Status is required"),
    };
    fields?.forEach((f) => {
      if (f.required) {
        schema[f.key] = yup.string().required(`${f.label} is required`);
      } else {
        schema[f.key] = yup.string();
      }
    });
    return yup.object().shape(schema);
  }, []);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      startDate: new Date(),
      dueDate: new Date(),
      priority: DocumentPriority.Low,
      status: DocumentStatus.Todo,
    },
    validate: yupResolver(formSchema),
  });

  const [attachments, setAttachments] = useState<FileWithPath[]>([]);

  // const [commentFiles, setCommentFiles] = useState<FileWithPath[]>([]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <LoadingOverlay visible={!!loaders.adding} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!activeBoard?.id) return;

          const { title, description, startDate, dueDate, priority, status } = form.values;

          const doc: ICreateDocument = {
            ...values,
            title,
            description,
            startDate: startDate.toISOString() as any,
            dueDate: dueDate.toISOString() as any,
            priority,
            status,
            files: (attachments as unknown as FileList) || ([] as any),
            assignedUsers: [],
            ccUsers: [],
            templateId: data.find((t) => t.name === selectedTemplate)?.id || "",
          };

          // console.log(form.values);

          await dispatch(createDocument({ boardId: activeBoard.id, document: doc }));

          form.reset();
          setAttachments([]);
          // form.reset();
          onClose();
        })}
      >
        <Stack>
          <Select
            value={selectedTemplate}
            searchable
            label="Document Type"
            placeholder="Pick one"
            disabled={!!loading || data.length <= 0}
            onChange={(e) => {
              setSelectedTemplate(e);
              const foundFrields = data.find((d) => d.name === e)?.fields;
              setFields(foundFrields);
            }}
            data={data.map((d) => {
              return { value: d.name, label: d.name };
            })}
          />
          {data.length <= 0 && (
            <Flex gap={4}>
              <Text size="sm" color="orange">
                No templates created, please
              </Text>

              <Text
                onClick={() => setTemplateModalOpen((o) => !o)}
                className="cursor-pointer"
                size="sm"
                color="orange"
                variant="link"
              >
                create a template
              </Text>
            </Flex>
          )}

          {selectedTemplate && (
            <Stack>
              <TextInput label="Title" withAsterisk {...form.getInputProps("title")} />
              <Textarea label="Description" withAsterisk {...form.getInputProps("description")} />
              <DatePicker
                aria-errormessage="asdsad"
                label="Start Date"
                withAsterisk
                {...form.getInputProps("startDate")}
              />
              <DatePicker label="Due Date" withAsterisk {...form.getInputProps("dueDate")} />
              <Select
                {...form.getInputProps("priority")}
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
                {...form.getInputProps("status")}
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
          )}

          {fields?.map((f) => {
            return <DynamicField key={f.id} field={f} form={form} />;
          })}

          {selectedTemplate && (
            <Text>
              Attachments <small>({attachments.length}/10)</small>:
            </Text>
          )}

          {Array.from(attachments).map((f, i) => {
            return (
              <Flex key={f.name} justify="space-between" align="center">
                <Text lineClamp={1}>{f.name}</Text>
                <ActionIcon
                  color={"red"}
                  size="sm"
                  onClick={() => {
                    setAttachments((a) => a.filter((_, index) => index !== i));
                  }}
                >
                  <IconX />
                </ActionIcon>
              </Flex>
            );
          })}

          {selectedTemplate && (
            <Paper>
              <CustomDropzone
                onDrop={(files) => {
                  if (attachments.length < 10) {
                    setAttachments((a) => [...a, ...files]);
                  } else {
                    showError("You can only attach 10 files");
                  }
                }}
              />
            </Paper>
          )}

          <Group position="right" mt="md">
            <Button disabled={!selectedTemplate} loading={!!docLoaders.adding} type="submit">
              Create Document
            </Button>
          </Group>
        </Stack>
      </form>

      {selectedTemplate && (
        <Stack>
          {/* <Grid grow my="xl">
            {commentFiles.map((file, index) => {
              return (
                <Grid.Col span="content" key={file.name + index}>
                  <Group position="apart">
                    <Group>
                      <IconFile stroke={1} size={36} />
                      {file.name}
                    </Group>
                    <IconX
                      cursor="pointer"
                      stroke={1}
                      size={16}
                      onClick={() => {
                        // const newFiles = files.filter((f) => {
                        //   return f.name === file.name;
                        // });
                        // setCommentFiles(newFiles);
                      }}
                    />
                  </Group>
                </Grid.Col>
              );
            })}
          </Grid> */}
          {/* <>
            <Dropzone
              onDrop={(files) => {
                setCommentFiles(files);
              }}
              activateOnClick={false}
              styles={{
                inner: { pointerEvents: "all" },
                root: {
                  padding: 0,
                  border: "none",
                  backgroundColor: "transparent",
                  ":hover": { backgroundColor: "transparent" },
                },
              }}
            >
              <Textarea label="Comment" description="Drag files here..." />
            </Dropzone>

            <Group position="right" mt="md">
              <Button disabled size="xs" loading={false}>
                Comment
              </Button>
            </Group>
          </> */}
        </Stack>
      )}

      <TemplateModal opened={templateModalOpen} onClose={() => setTemplateModalOpen((o) => !o)} />
    </Modal>
  );
};

export default DocumentModal;
