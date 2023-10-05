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
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { FieldType, IField } from "hexa-sdk/dist/app.api";
import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import DynamicField from "../components/DynamicField";
import CustomDropzone from "../components/CustomDropzone";
import { createDocument } from "../redux/api/documentApi";
import TemplateModal from "./TemplateModal";
import { FileWithPath } from "@mantine/dropzone";
import { showError } from "../redux/commonSliceFunctions";
import { IconX } from "@tabler/icons";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { isValidDate } from "../utils/isValidDate";

const DocumentModal = ({ onClose, opened, title }: CommonModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((state) => state.templates);
  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const { loaders: docLoaders } = useAppSelector((state) => state.documents);

  const [fields, setFields] = useState<IField[]>();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);

  const formSchema = useMemo(() => {
    const schema: any = {};
    fields?.forEach((f) => {
      if (f.required) {
        if (f.type === FieldType.Multiselect) {
          schema[f.key] = yup.array().required(`${f.label} is required`);
        } else {
          schema[f.key] = yup.string().required(`${f.label} is required`);
        }
      } else {
        schema[f.key] = yup.string();
      }
    });
    return yup.object().shape(schema);
  }, [fields]);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      startDate: new Date(),
      dueDate: new Date(),
    },
    validate: yupResolver(formSchema),
  });

  const [attachments, setAttachments] = useState<FileWithPath[]>([]);

  const handleSubmit = async (values: any) => {
    if (!activeBoard?.id) return;

    const formData = new FormData();
    formData.append("templateId", data.find((t) => t.name === selectedTemplate)?.id || "");
    attachments.forEach((a) => {
      formData.append("files", a);
    });

    Object.keys(values).map((k) => {
      let value = values[k];

      if (isValidDate(value)) {
        value = new Date(value).toISOString();
      }
      formData.append(k, value);
    });

    await dispatch(createDocument({ boardId: activeBoard.id, document: formData }));

    form.reset();
    setAttachments([]);
    setSelectedTemplate(null);
    setFields(undefined);
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <LoadingOverlay visible={!!loaders.adding} />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Select
            value={selectedTemplate}
            searchable
            label={t("documentType")}
            placeholder={t("pickOne") || "Pick One"}
            disabled={!!loading || data.length <= 0}
            onChange={(e) => {
              setSelectedTemplate(e);
              const foundFields = data.find((d) => d.name === e)?.fields;
              setFields(foundFields);
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

          {fields?.map((f) => {
            return <DynamicField key={f.id} field={f} form={form} />;
          })}

          {selectedTemplate && (
            <Text>
              {t("attachments")} <small>({attachments.length}/10)</small>:
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
              {t("createDocument")}
            </Button>
          </Group>
        </Stack>
      </form>

      <TemplateModal opened={templateModalOpen} onClose={() => setTemplateModalOpen((o) => !o)} />
    </Modal>
  );
};

export default DocumentModal;
