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
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { DocumentPriority, DocumentStatus } from "hexa-sdk/dist/app.api";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ISheetProcessResponse } from "../interfaces/sheets/ISheetProcessResponse";
import { IconTrash } from "@tabler/icons";
import { DatePicker } from "@mantine/dates";
import { ISheetCreate } from "../interfaces/sheets/ISheetCreate";
import { createSheet } from "../redux/api/sheetsApi";
import { useTranslation } from "react-i18next";

const SheetModal = ({ onClose, opened, title }: CommonModalProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { activeBoard, loaders, sheetRecords, addingSheet } = useAppSelector((state) => ({
    activeBoard: state.boards.activeBoard,
    loaders: state.boards.loaders,
    sheetRecords: state.sheets.sheetRecords,
    addingSheet: state.sheets.loaders.addingSheet,
  }));

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

  const [sheetRes, setSheetRes] = useState<ISheetProcessResponse[]>([]);
  const [newCodes, setNewCodes] = useState<string[]>([]);

  useEffect(() => {
    setSheetRes(sheetRecords);
    setNewCodes(sheetRecords.map((sr) => sr.code));
  }, [sheetRecords]);

  const [tagsData, setTagsData] = useState<{ value: string; label: string; recordIndex: number }[]>(
    [],
  );
  const [newTags, setNewTags] = useState<string[][]>([]);

  const handleSheetRemove = useCallback((sheetCode: string, index: number) => {
    setSheetRes((prev) => prev.filter((sr) => sr.code !== sheetCode));
    setNewCodes((prev) => {
      const updatedCodes = [...prev];
      updatedCodes.splice(index, 1);
      return updatedCodes;
    });
  }, []);

  const handleClose = () => {
    setNewCodes([]);
    setSheetRes([]);
    setTagsData([]);
    form.reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!activeBoard) return;

    const newRecords = sheetRes.map((s, i) => ({
      ...s,
      code: newCodes[i],
      tags: newTags[i] || [],
    }));

    const preppedSheet: ISheetCreate = {
      ...form.values,
      startDate: form.values.startDate.toISOString(),
      dueDate: form.values.dueDate.toISOString(),
      records: newRecords,
    };

    await dispatch(createSheet({ boardId: activeBoard.id, sheet: preppedSheet }));
    form.reset();
    onClose();
  };

  const renderedSheets = useMemo(
    () =>
      sheetRes.map((s, i) => (
        <Paper key={s.code + i} p="md">
          <Group position="apart">
            <Group>
              <Image height={150} width={150} src={s.thumbnail.url} />
              <Image maw={240} src={s.meta.url} />
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
                    const item = { value: query, label: query, recordIndex: i };
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
      )),
    [sheetRes, newCodes, handleSheetRemove, tagsData, newTags],
  );

  return (
    <Modal opened={opened} onClose={handleClose} title={title} fullScreen>
      {loaders.adding && <LoadingOverlay visible={true} />}
      <form onSubmit={form.onSubmit(handleSubmit)}>
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
              <Stack>{renderedSheets}</Stack>
            </Grid.Col>
          </Grid>
        </Card>
        <Group mt="md" position="right">
          <Button type="submit" disabled={sheetRecords.length <= 0} loading={addingSheet}>
            {t("createSheet")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SheetModal;
