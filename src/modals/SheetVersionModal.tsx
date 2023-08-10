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
import { useEffect, useState } from "react";
import axios from "axios";
import { SHEETS_URL } from "../constants/URLS";
import { ISheetProcessResponse } from "../interfaces/sheets/ISheetProcessResponse";
import { showError } from "../redux/commonSliceFunctions";
import { startNavigationProgress, completeNavigationProgress } from "@mantine/nprogress";
import { IconTrash } from "@tabler/icons";
import ISheetCreateVersion from "../interfaces/sheets/ISheetCreateVersion";
import { createSheetVersion } from "../redux/api/sheetsApi";
import { ISheetDetailedResponse } from "../interfaces/sheets/ISheetDetailedResponse";
import { t } from "i18next";

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
    versionTitle: yup.string().required("Document title is required"),
  });

  const form = useForm({
    initialValues: {
      versionTitle: "",
    },
    validate: yupResolver(formSchema),
  });

  const [sheetUploaded, setSheetUploaded] = useState(false);

  const [sheetRes, setSheetRes] = useState<ISheetProcessResponse[]>([]);
  const [newCodes, setNewCodes] = useState<string[]>([]);

  const [tags, setTags] = useState<{ value: string; label: string; recordindex: number }[]>([]);

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
          const newRecords: ISheetProcessResponse[] = [];
          sheetRes.forEach((s, i) => {
            s.code = newCodes[i];
            s.tags = [];
            newRecords.push(s);
          });

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
            <Grid.Col span={2}>
              <Stack>
                <TextInput
                  label="Version Title"
                  withAsterisk
                  {...form.getInputProps("versionTitle")}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={10}>
              {!sheetUploaded && (
                <SheetDropzone
                  onDrop={async (file) => {
                    setSheetUploaded(false);
                    startNavigationProgress();
                    try {
                      const formData = new FormData();
                      formData.append("file", file[0]);
                      const res = await axios.post<ISheetProcessResponse[]>(SHEETS_URL, formData, {
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

              {sheetUploaded && (
                <Stack>
                  {sheetRes.map((s, i) => {
                    return (
                      <Paper key={s.code + i} p="md">
                        <Group position="apart">
                          <Group>
                            <Image maw={240} src={s.thumbnail.url} />
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
                                label={t("tags")}
                                data={tags}
                                placeholder={t("selectTags") || ""}
                                searchable
                                creatable
                                getCreateLabel={(query) => `+ Create ${query}`}
                                onCreate={(query) => {
                                  const item = { value: query, label: query, recordindex: i };
                                  setTags((current) => [...current, item]);
                                  return item;
                                }}
                              />
                            </Stack>
                          </Group>
                          <ActionIcon color="red" size="sm">
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
          <Button type="submit" disabled={!sheetUploaded} loading={addingVersion}>
            {t("createVersion")}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SheetVersionModal;
