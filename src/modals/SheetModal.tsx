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
import { DocumentPriority, DocumentStatus } from "hexa-sdk/dist/app.api";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import CustomDropzone from "../components/CustomDropzone";
import { DatePicker } from "@mantine/dates";
import { FileWithPath } from "@mantine/dropzone";
import { showError } from "../redux/commonSliceFunctions";
import { IconX } from "@tabler/icons";
import * as yup from "yup";
import { createSheet } from "../redux/api/sheetsApi";

const SheetModal = ({ onClose, opened, title }: CommonModalProps) => {
  const dispatch = useAppDispatch();

  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const {
    loaders: { addingSheet },
  } = useAppSelector((state) => state.sheets);

  const formSchema = yup.object().shape({
    title: yup.string().required("Document title is required"),
    description: yup.string().required("Description is required"),
    startDate: yup.date().required("Start date is required"),
    dueDate: yup.date().required("Due date is required"),
    priority: yup.string().required("Priority is required"),
    status: yup.string().required("Status is required"),
  });

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      startDate: new Date(),
      dueDate: new Date(),
      priority: DocumentPriority.Low,
      status: DocumentStatus.Todo,
      files: [],
    },
    validate: yupResolver(formSchema),
  });

  const [attachments, setAttachments] = useState<FileWithPath[]>([]);

  // const [commentFiles, setCommentFiles] = useState<FileWithPath[]>([]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <LoadingOverlay visible={!!loaders.adding} />
      <form
        onSubmit={form.onSubmit(async (values: any) => {
          if (!activeBoard?.id) return;

          const { title, description, startDate, dueDate, priority, status } = form.values;

          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("startDate", startDate.toISOString());
          formData.append("dueDate", dueDate.toISOString());
          formData.append("priority", priority);
          formData.append("status", status);
          attachments.forEach((a) => {
            formData.append("files", a);
          });

          await dispatch(createSheet({ boardId: activeBoard.id, sheet: formData }));

          form.reset();
          setAttachments([]);
          onClose();
        })}
      >
        <Stack>
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

          <Text>
            Attachments <small>({attachments.length}/10)</small>:
          </Text>

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

          <Group position="right" mt="md">
            <Button loading={addingSheet} type="submit">
              Create Document
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default SheetModal;
