import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Paper,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import SheetDropzone from "../components/SheetDropzone";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { DocumentPriority, DocumentStatus } from "hexa-sdk/dist/app.api";
import { useState } from "react";

import { ISheetProcessResponse } from "../interfaces/sheets/ISheetProcessResponse";
import { showError } from "../redux/commonSliceFunctions";
import { completeNavigationProgress, startNavigationProgress } from "@mantine/nprogress";
import { IconTrash } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { ISheetCreate } from "../interfaces/sheets/ISheetCreate";
import { createSheet } from "../redux/api/sheetsApi";
import { useTranslation } from "react-i18next";
import { axiosSheets } from "../config/axiosSheets";

const SheetModal = ({ onClose, opened, title }: CommonModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const {
    loaders: { addingSheet },
  } = useAppSelector((state) => state.sheets);

  const formSchema = yup.object().shape({
    title: yup.string().required("Document title is required"),
    description: yup.string(),
    startDate: yup.date().required("Start date is required"),
    dueDate: yup.date().required("Due date is required"),
    priority: yup.string().required("Priority is required"),
    status: yup.string().required("Status is required"),
  });

  const form = useForm({
    initialValues: {
      title: "",
      versionTitle: "",
      description: "",
      startDate: new Date(),
      dueDate: new Date(),
      priority: DocumentPriority.Low,
      status: DocumentStatus.Todo,
    },
    validate: yupResolver(formSchema),
  });

  const [sheetUploaded, setSheetUploaded] = useState(false);

  const [sheetRes, setSheetRes] = useState<ISheetProcessResponse[]>([]);
  const [newCodes, setNewCodes] = useState<string[]>([]);

  const [tagsData, setTagsData] = useState<{ value: string; label: string; recordindex: number }[]>(
    [],
  );
  const [newTags, setNewTags] = useState<string[][]>([]);

  const handleSheetRemove = (sheetCode: string, index: number) => {
    const updatedSheets = sheetRes.filter((sr) => sr.code !== sheetCode);
    const updatedCodes = [...newCodes];
    updatedCodes.splice(index, 1);

    setSheetRes(updatedSheets);
    setNewCodes(updatedCodes);
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        setNewCodes([]);
        setSheetRes([]);
        completeNavigationProgress();
        setSheetUploaded(false);
        setTagsData([]);
        form.reset();
        onClose();
      }}
      title={title}
      fullScreen
    >
      <LoadingOverlay visible={!!loaders.adding} />
      <form
        onSubmit={form.onSubmit(async () => {
          if (!activeBoard) return;
          const newRecords: ISheetProcessResponse[] = [];
          sheetRes.forEach((s, i) => {
            s.code = newCodes[i];
            s.tags = newTags[i] || [];
            newRecords.push(s);
          });

          const preppedSheet: ISheetCreate = {
            ...form.values,
            startDate: form.values.startDate.toISOString(),
            dueDate: form.values.dueDate.toISOString(),
            records: newRecords,
          };
          await dispatch(createSheet({ boardId: activeBoard.id, sheet: preppedSheet }));
          onClose();
        })}
      >
        <Card>
          <Grid>
            <Grid.Col md={10} lg={2}>
              <Stack>
                <TextInput label={t("title")} withAsterisk {...form.getInputProps("title")} />
                <Textarea label={t("description")} {...form.getInputProps("description")} />
                <DatePicker
                  aria-errormessage="Invalid Start Date"
                  label={t("emissionDate")}
                  withAsterisk
                  {...form.getInputProps("startDate")}
                />
                <TextInput
                  label={t("versionTitle")}
                  withAsterisk
                  {...form.getInputProps("versionTitle")}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col md={4} lg={10}>
              {!sheetUploaded && (
                <SheetDropzone
                  onDrop={async (file) => {
                    setSheetUploaded(false);
                    startNavigationProgress();
                    try {
                      const formData = new FormData();
                      formData.append("file", file[0]);
                      const res = await axiosSheets.post<ISheetProcessResponse[]>("", formData);

                      setNewCodes(res.data.map((d) => d.code));

                      setSheetRes(res.data);
                      setSheetUploaded(true);
                      completeNavigationProgress();
                    } catch (err) {
                      setSheetUploaded(false);
                      completeNavigationProgress();

                      showError(
                        "Something went wrong while uploading the sheet, please try again.",
                      );
                    }
                  }}
                />
              )}

              {sheetUploaded && (
                <Stack>
                  {sheetRes.map((s, i) => {
                    return (
                      <Paper key={s.code + i} p="md">
                        <Group position="apart">
                          <Group>
                            <Image height={150} width={150} src={s.thumbnail.url} />
                            <Image maw={240} src={s.codeMeta.url} />
                            <Stack>
                              <TextInput
                                label={t("sheetCode")}
                                value={newCodes[i]}
                                onChange={(e) => {
                                  const oldCodes = [...newCodes];
                                  oldCodes[i] = e.target.value;
                                  setNewCodes(oldCodes);
                                }}
                              />
                            </Stack>
                            <Stack>
                              <MultiSelect
                                // maxSelectedValues={1}
                                label={t("tags")}
                                data={tagsData}
                                placeholder={t("selectTags") || ""}
                                searchable
                                creatable
                                getCreateLabel={(query) => `+ Create ${query}`}
                                onChange={(e) => {
                                  const nNewTags = [...newTags];
                                  nNewTags[i] = e;
                                  setNewTags(nNewTags);
                                }}
                                onCreate={(query) => {
                                  const item = { value: query, label: query, recordindex: i };
                                  setTagsData((current) => [...current, item]);
                                  return item;
                                }}
                              />
                            </Stack>
                          </Group>
                          <ActionIcon
                            color="red"
                            size="sm"
                            onClick={() => {
                              handleSheetRemove(s.code, i);
                            }}
                          >
                            <IconTrash />
                          </ActionIcon>
                        </Group>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Grid.Col>
          </Grid>
        </Card>
        <Group mt="md" position="right">
          <Button type="submit" disabled={!sheetUploaded} loading={addingSheet}>
            {t("createSheet")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SheetModal;
