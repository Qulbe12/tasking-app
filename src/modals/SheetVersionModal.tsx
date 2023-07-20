import {
  ActionIcon,
  Button,
  Card,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Modal,
  Stack,
  TextInput,
} from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import SheetDropzone from "../components/SheetDropzone";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";
import { useState } from "react";
import axios from "axios";
import { SHEETS_URL } from "../constants/URLS";
import { ISheetProcessResponse } from "../interfaces/sheets/ISheetProcessResponse";
import { showError } from "../redux/commonSliceFunctions";
import { startNavigationProgress, completeNavigationProgress } from "@mantine/nprogress";
import { IconTrash } from "@tabler/icons";
import ISheetCreateVersion from "../interfaces/sheets/ISheetCreateVersion";
import { createSheetVersion } from "../redux/api/sheetsApi";

type SheetVersionModalProps = {
  sheetId?: string;
};

const SheetVersionModal = ({
  onClose,
  opened,
  title,
  sheetId,
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
          if (!sheetId) return;
          const newRecords: ISheetProcessResponse[] = [];
          sheetRes.forEach((s, i) => {
            s.code = newCodes[i];
            newRecords.push(s);
          });
          const preppedSheet: ISheetCreateVersion = {
            ...form.values,
            records: newRecords,
          };
          await dispatch(createSheetVersion({ sheetId, sheet: preppedSheet }));
          setNewCodes([]);
          setSheetRes([]);
          completeNavigationProgress();
          setSheetUploaded(false);
          onClose();
        })}
      >
        <Card>
          <Grid>
            <Grid.Col span={3}>
              <Stack>
                <TextInput
                  label="Version Title"
                  withAsterisk
                  {...form.getInputProps("versionTitle")}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={9}>
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
                      <Card key={s.code + i} withBorder>
                        <Group position="apart">
                          <Group>
                            <Image maw={240} src={s.codeMeta.url} />
                            <Stack>
                              <TextInput
                                value={newCodes[i]}
                                onChange={(e) => {
                                  const oldCodes = [...newCodes];
                                  oldCodes[i] = e.target.value;
                                  setNewCodes(oldCodes);
                                }}
                              />
                            </Stack>
                          </Group>
                          <ActionIcon color="red" size="sm">
                            <IconTrash />
                          </ActionIcon>
                        </Group>
                      </Card>
                    );
                  })}
                </Stack>
              )}
            </Grid.Col>
          </Grid>
        </Card>
        <Group mt="md" position="right">
          <Button type="submit" disabled={!sheetUploaded} loading={addingVersion}>
            Create Version
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default SheetVersionModal;
