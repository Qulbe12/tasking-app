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
  TextInput,
} from "@mantine/core";

import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import SheetDropzone from "../components/SheetDropzone";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ISheetProcessResponse } from "../interfaces/sheets/ISheetProcessResponse";
import { showError } from "../redux/commonSliceFunctions";
import { completeNavigationProgress, startNavigationProgress } from "@mantine/nprogress";
import { IconTrash } from "@tabler/icons";
import ISheetCreateVersion from "../interfaces/sheets/ISheetCreateVersion";
import { createSheetVersion } from "../redux/api/sheetsApi";
import { ISheetDetailedResponse } from "../interfaces/sheets/ISheetDetailedResponse";
import { t } from "i18next";
import { DatePicker } from "@mantine/dates";

import { axiosSheets } from "../config/axiosSheets";

type SheetVersionModalProps = {
  sheet?: ISheetDetailedResponse | null;
  onComplete: () => void;
};

const SheetVersionModal = ({
  onClose,
  opened,
  title,
  sheet,
  onComplete,
}: CommonModalProps & SheetVersionModalProps) => {
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.boards);
  const {
    loaders: { addingVersion },
  } = useAppSelector((state) => state.sheets);

  const formSchema = yup.object().shape({
    versionTitle: yup.string().required("Version is required"),
    versionDate: yup.string().required("Date is required"),
  });

  const form = useForm({
    initialValues: {
      versionTitle: "",
      versionDate: new Date().toISOString(),
    },
    validate: yupResolver(formSchema),
  });

  const [sheetUploaded, setSheetUploaded] = useState(false);

  const [sheetRes, setSheetRes] = useState<ISheetProcessResponse[]>([]);
  const [newCodes, setNewCodes] = useState<string[]>([]);

  const [tags, setTags] = useState<{ value: string; label: string; recordindex: number }[]>([]);

  const [tagsData, setTagsData] = useState<{ value: string; label: string; recordIndex: number }[]>(
    [],
  );

  const [newTags, setNewTags] = useState<string[][]>([]);

  useEffect(() => {
    if (sheet) {
      setTags(
        sheet.tags.map((t) => {
          return {
            label: t,
            value: t,
            recordindex: -1,
          };
        }),
      );
    }
  }, [sheet]);

  const handleSheetRemove = useCallback((sheetCode: string, index: number) => {
    setSheetRes((prev) => prev.filter((sr) => sr.code !== sheetCode));
    setNewCodes((prev) => {
      const updatedCodes = [...prev];
      updatedCodes.splice(index, 1);
      return updatedCodes;
    });
  }, []);

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
    <Modal
      opened={opened}
      onClose={() => {
        setNewCodes([]);
        setSheetRes([]);
        completeNavigationProgress();
        setSheetUploaded(false);
        form.reset();
        onClose();
      }}
      title={title}
      fullScreen
    >
      <LoadingOverlay visible={!!loaders.adding} />
      <form
        onSubmit={form.onSubmit(async () => {
          if (!sheet?.id) return;
          const newRecords = sheetRes.map((s, i) => ({
            ...s,
            code: newCodes[i],
            tags: newTags[i] || [],
          }));

          tags.forEach((t) => {
            if (t.recordindex < 0) return;
            newRecords[t.recordindex].tags.push(t.label);
          });

          const preppedSheet: ISheetCreateVersion = {
            ...form.values,
            records: newRecords,
          };

          await dispatch(createSheetVersion({ sheetId: sheet.id, sheet: preppedSheet }));
          setNewCodes([]);
          setSheetRes([]);
          completeNavigationProgress();
          setSheetUploaded(false);
          onComplete();
          onClose();
        })}
      >
        <Card>
          <Grid>
            <Grid.Col md={10} lg={2}>
              <Stack>
                <TextInput
                  label={t("versionTitle")}
                  withAsterisk
                  {...form.getInputProps("versionTitle")}
                />

                <DatePicker
                  label={t("versionDate")}
                  withAsterisk
                  placeholder="Date input"
                  maw={400}
                  mx="auto"
                  defaultValue={new Date()}
                  {...form.getInputProps("versionDate")}
                />

                <Group mt="md" position="right">
                  <Button type="submit" disabled={!sheetUploaded} loading={addingVersion}>
                    {t("createVersion")}
                  </Button>
                </Group>
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
                      const res = await axiosSheets.post<ISheetProcessResponse[]>("", formData, {
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      });

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

              {sheetUploaded && <Stack>{renderedSheets}</Stack>}
            </Grid.Col>
          </Grid>
        </Card>
      </form>
    </Modal>
  );
};

export default SheetVersionModal;
