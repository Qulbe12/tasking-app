import {
  Button,
  Flex,
  Grid,
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
import { useForm } from "@mantine/form";
import { DocumentPriority, DocumentStatus, IField } from "hexa-sdk";
import React, { useEffect, useState } from "react";
import { getAllTemplates } from "../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import DynamicField from "../components/DynamicField";
import CustomDropzone from "../components/CustomDropzone";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { IconFile, IconX } from "@tabler/icons";
import { createDocument } from "../redux/api/documentApi";
import { DatePicker } from "@mantine/dates";
import TemplateModal from "./TemplateModal";

const DocumentModal = ({ onClose, opened, title }: CommonModalProps) => {
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((state) => state.templates);
  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    dispatch(getAllTemplates(activeWorkspace.id));
  }, []);

  const [fields, setFields] = useState<IField[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      startDate: new Date(),
      dueDate: new Date(),
      priority: DocumentPriority.Low,
      status: DocumentStatus.Todo,
    },
  });

  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [commentFiles, setCommentFiles] = useState<FileWithPath[]>([]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <LoadingOverlay visible={!!loaders.adding} />
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!activeBoard?.id) return;

          const { title, description, startDate, dueDate, priority, status } = form.values;

          await dispatch(
            createDocument({
              boardId: activeBoard.id,
              document: {
                ...values,
                title,
                description,
                startDate: startDate.toISOString() as any,
                dueDate: dueDate.toISOString() as any,
                priority,
                status,
                attachments: files,
                assignedUsers: [],
                ccUsers: [],
                templateId: data.find((t) => t.name === selectedTemplate)?.id || "",
              },
            }),
          );

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
              <DatePicker label="Start Date" {...form.getInputProps("startDate")} />
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
            <Paper>
              <Grid grow my="xl">
                {files.map((file, index) => {
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
                            const newFiles = files.filter((f) => {
                              return f.name === file.name;
                            });
                            setFiles(newFiles);
                          }}
                        />
                      </Group>
                    </Grid.Col>
                  );
                })}
              </Grid>
              <CustomDropzone
                onDrop={(files) => {
                  setFiles(files);
                }}
              />
            </Paper>
          )}

          <Group position="right" mt="md">
            <Button disabled={!selectedTemplate} loading={!!loaders.adding} type="submit">
              Create Document
            </Button>
          </Group>
        </Stack>
      </form>

      {selectedTemplate && (
        <Stack>
          <Grid grow my="xl">
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
                        const newFiles = files.filter((f) => {
                          return f.name === file.name;
                        });
                        setCommentFiles(newFiles);
                      }}
                    />
                  </Group>
                </Grid.Col>
              );
            })}
          </Grid>
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
        </Stack>
      )}

      <TemplateModal opened={templateModalOpen} onClose={() => setTemplateModalOpen((o) => !o)} />
    </Modal>
  );
};

export default DocumentModal;
