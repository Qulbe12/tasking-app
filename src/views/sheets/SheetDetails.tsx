import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { IRecord, ISheetDetailedResponse } from "../../interfaces/sheets/ISheetDetailedResponse";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  MultiSelect,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { showError } from "../../redux/commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { ISubFile } from "../../interfaces/sheets/common";
import SheetVersionModal from "../../modals/SheetVersionModal";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus } from "@tabler/icons";
import SheetPdfViewer from "../../components/SheetPdfViewer";
import _ from "lodash";
import Filter from "../../components/Filter";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useAppDispatch } from "../../redux/store";
import { updateSheet } from "../../redux/api/sheetsApi";
import { ISheetUpdate } from "../../interfaces/sheets/ISheetUpdate";
import { IErrorResponse } from "../../interfaces/IErrorResponse";
import { DatePicker } from "@mantine/dates";

const SheetDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();

  const [selectedSheet, setSelectedSheet] = useState<ISheetDetailedResponse | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<ISubFile | null>(null);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTags, setNewTags] = useState<string[]>([]);

  const [showSheetVersionModal, { toggle: toggleSheetVersionModal }] = useDisclosure(false);
  const [editMode, setEditMode] = useState(false);
  const [sheetUpdating, setSheetUpdating] = useState(false);

  const handlePageChange = useCallback(
    (e: KeyboardEvent) => {
      const { key } = e;
      if (!selectedSheet) return;
      if (!selectedPage) return;

      const selectedPageIndex = selectedSheet.records.findIndex((s) => s.id === selectedPage?.id);
      const keyRight = key === "ArrowRight";
      const keyLeft = key === "ArrowLeft";

      if (keyRight || keyLeft) {
        e.preventDefault();

        if (selectedPageIndex >= 0) {
          if (selectedPageIndex <= selectedSheet.records.length - 2) {
            if (keyRight) {
              setSelectedPage({
                id: selectedSheet.records[selectedPageIndex + 1].id,
                name: selectedSheet.records[selectedPageIndex + 1].code,
                url: selectedSheet.records[selectedPageIndex + 1].file.url,
              });
            }
          }

          if (selectedPageIndex > 0) {
            if (keyLeft) {
              setSelectedPage({
                id: selectedSheet.records[selectedPageIndex - 1].id,
                name: selectedSheet.records[selectedPageIndex - 1].code,
                url: selectedSheet.records[selectedPageIndex - 1].file.url,
              });
            }
          }
        }
      }
    },
    [selectedPage, selectedSheet],
  );

  const getDetailedSheet = async (latest?: boolean) => {
    if (!currentSheetId) return;
    setSelectedSheet(null);
    setLoading(true);
    let queryString = `/sheets/${currentSheetId}`;

    if (selectedVersion) {
      queryString += `?version=${selectedVersion}`;
    }

    if (latest) {
      queryString = `/sheets/${currentSheetId}`;
    }

    try {
      const res = await axiosPrivate.get<ISheetDetailedResponse>(queryString);

      setSelectedSheet(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      showError("Something went wrong");

      setLoading(false);
    }
  };

  const updateSheetInfo = useCallback(
    async (data: ISheetUpdate) => {
      if (!selectedSheet) return;
      if (sheetUpdating) return;

      setSheetUpdating(true);

      try {
        const res = await axiosPrivate.patch<ISheetDetailedResponse>(
          `/sheets/${selectedSheet.id}`,
          data,
        );
        dispatch(
          updateSheet({
            id: selectedSheet.id,
            data,
          }),
        );

        setSelectedSheet(res.data);
        setSheetUpdating(false);
      } catch (err) {
        const error = err as IErrorResponse;
        showError(error.response?.data.message);
        setSheetUpdating(false);
      }
    },
    [selectedSheet],
  );

  const currentSheetId = useMemo(() => {
    return location.pathname.split("/")[3];
  }, [location]);

  const filteredRecords: IRecord[] = useMemo<IRecord[]>(() => {
    if (!selectedSheet) return [];

    if (tagFilter.length <= 0) return selectedSheet.records;

    return _.filter(selectedSheet.records, (obj) => {
      return _.some(tagFilter, (tag) => _.includes(obj.tags, tag));
    });
  }, [selectedSheet, tagFilter]);

  const foundRecordIndex = useMemo<number>(() => {
    if (!selectedPage || !selectedSheet) return -1;

    const fi = selectedSheet.records.findIndex((r) => r.code === selectedPage.name);

    return fi;
  }, [selectedPage, selectedSheet]);

  useEffect(() => {
    if (!selectedSheet) return;
    setSelectedVersion(selectedSheet.currentVerion.version);

    if (selectedPage) return;

    if (selectedSheet.records.length > 0) {
      setSelectedPage({
        id: selectedSheet.records[0].id,
        name: selectedSheet.records[0].code,
        url: selectedSheet.records[0].file.url,
      });
    }
  }, [selectedSheet]);

  useEffect(() => {
    window.addEventListener("keydown", handlePageChange);
    setEditMode(false);

    return () => {
      window.removeEventListener("keydown", handlePageChange);
    };
  }, [selectedPage, selectedSheet]);

  useEffect(() => {
    if (selectedVersion === selectedSheet?.currentVerion.version) return;
    getDetailedSheet();
  }, [currentSheetId, selectedVersion]);

  return (
    <Paper>
      <LoadingOverlay visible={loading} />

      <Filter onChange={(e) => setTagFilter(e)} options={selectedSheet?.tags || []} />

      <Grid mt="sm" h="80vh">
        <Grid.Col span="auto" h="100%">
          <ScrollArea h="100%" offsetScrollbars>
            <Stack>
              {filteredRecords.map((r) => {
                return (
                  <Flex
                    key={r.id}
                    onClick={() => {
                      setSelectedPage({
                        id: r.id,
                        name: r.code,
                        url: r.file.url,
                      });
                    }}
                    direction="column"
                    align="center"
                    justify="center"
                    className={`hover:scale-110 cursor-pointer mx-2 my-2 ${
                      selectedPage?.id === r.id ? "scale-110" : undefined
                    }`}
                  >
                    <Image
                      src={r.thumbnail.url}
                      maw={150}
                      style={{
                        border:
                          selectedPage?.id === r.id
                            ? `2px solid ${theme.colors.indigo[6]}`
                            : undefined,
                      }}
                    />
                    {r.code}
                  </Flex>
                );
              })}
            </Stack>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col p="md" span={9}>
          {selectedSheet && selectedPage && (
            <SheetPdfViewer handleKeyEvent={handlePageChange} file={selectedPage} />
          )}
        </Grid.Col>
        <Grid.Col span="auto">
          <Stack h="100%">
            <Card h="50%" pos="relative">
              <LoadingOverlay visible={sheetUpdating} />
              <Group position="apart" mb="xs">
                <Text>{t("sheetInfo")}:</Text>
                <ActionIcon
                  variant={editMode ? "filled" : "subtle"}
                  color="indigo"
                  size="sm"
                  onClick={() => setEditMode((o) => !o)}
                >
                  <IconEdit />
                </ActionIcon>
              </Group>

              <ScrollArea h="90%" offsetScrollbars>
                <Stack>
                  <div>
                    <Text size="sm">Sheet:</Text>
                    {editMode ? (
                      <TextInput
                        defaultValue={selectedSheet?.title}
                        onBlur={async (e) => {
                          if (!e.target.value) return;
                          updateSheetInfo({ title: e.target.value });
                        }}
                      />
                    ) : (
                      <Text>{selectedSheet?.title}</Text>
                    )}
                  </div>

                  <div>
                    <Text size="sm">{t("description")}:</Text>
                    {editMode ? (
                      <TextInput
                        defaultValue={selectedSheet?.description}
                        onBlur={async (e) => {
                          if (!e.target.value) return;
                          updateSheetInfo({ description: e.target.value });
                        }}
                      />
                    ) : (
                      <Text>{selectedSheet?.description}</Text>
                    )}
                  </div>

                  <div>
                    <Text size="sm">Page:</Text>
                    {editMode ? (
                      <TextInput
                        defaultValue={selectedPage?.name}
                        onBlur={async (e) => {
                          if (!e.target.value) return;

                          const sheet = _.cloneDeep(selectedSheet);

                          if (!sheet) return;
                          if (!selectedPage) return;

                          if (foundRecordIndex < 0) return;

                          sheet.records[foundRecordIndex].code = e.target.value;

                          updateSheetInfo(sheet);
                          // updateSheetInfo({ description: e.target.value });
                        }}
                      />
                    ) : (
                      <Text>{selectedPage?.name}</Text>
                    )}
                  </div>

                  <div>
                    <Text size="sm">{t("emissionDate")}:</Text>

                    {editMode ? (
                      <DatePicker
                        defaultValue={new Date(selectedSheet?.startDate || "")}
                        onChange={(e) => {
                          updateSheetInfo({
                            startDate: e?.toISOString() || new Date().toISOString(),
                          });
                        }}
                      />
                    ) : (
                      <Text>{dayjs(selectedSheet?.startDate).format("MMMM D, YYYY")}</Text>
                    )}
                  </div>

                  {!editMode && (
                    <div>
                      <Text size="sm">{t("versionDate")}:</Text>
                      <Text>{dayjs(selectedSheet?.currentVerion.date).format("MMMM D, YYYY")}</Text>
                    </div>
                  )}

                  <div>
                    <Text size="sm">{t("tags")}:</Text>
                    {!editMode && (
                      <Grid>
                        {selectedSheet?.records
                          .find((r) => r.code === selectedPage?.name)
                          ?.tags.map((t) => {
                            return (
                              <Grid.Col key={t} span="content">
                                <Badge>{t}</Badge>
                              </Grid.Col>
                            );
                          })}
                      </Grid>
                    )}
                    {editMode && (
                      <Stack>
                        <MultiSelect
                          defaultValue={
                            selectedSheet?.records.find((r) => r.code === selectedPage?.name)?.tags
                          }
                          data={selectedSheet?.tags ?? []}
                          placeholder="Select items"
                          searchable
                          creatable
                          onChange={setNewTags}
                          getCreateLabel={(query) => `+ Create ${query}`}
                          onCreate={(query) => {
                            const item = query;
                            setNewTags((current) => [...current, item]);
                            return item;
                          }}
                        />
                        <Button
                          variant="outline"
                          onClick={async () => {
                            if (!selectedSheet || !selectedPage || !selectedVersion) return;

                            const res = await axiosPrivate.patch(
                              `/sheets/${selectedSheet.id}/records/${selectedPage.name}/tags/version/${selectedVersion}`,
                              newTags,
                            );

                            setSelectedSheet(res.data);
                          }}
                        >
                          Update Tags
                        </Button>
                      </Stack>
                    )}
                  </div>
                </Stack>
              </ScrollArea>
            </Card>
            <Card h="50%">
              <Group position="apart" mb="xs">
                <Text>{t("versions")}:</Text>
                <ActionIcon size="sm" onClick={toggleSheetVersionModal}>
                  <IconPlus />
                </ActionIcon>
              </Group>
              {selectedSheet?.versions.map((v, i) => {
                return (
                  <NavLink
                    key={v.title + i}
                    label={v.title}
                    active={selectedSheet.currentVerion.version === v.version}
                    onClick={async () => {
                      setSelectedVersion(v.version);
                    }}
                  />
                );
              })}
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      <SheetVersionModal
        onComplete={() => {
          getDetailedSheet(true);
        }}
        sheet={selectedSheet}
        onClose={toggleSheetVersionModal}
        opened={showSheetVersionModal}
        title={t("createNewVersion")}
      />
    </Paper>
  );
};

export default SheetDetails;
