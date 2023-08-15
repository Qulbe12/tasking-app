import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { IRecord, ISheetDetailedResponse } from "../../interfaces/sheets/ISheetDetailedResponse";
import {
  ActionIcon,
  Card,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  NavLink,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { showError } from "../../redux/commonSliceFunctions";
import { axiosPrivate } from "../../config/axios";
import { ISubFile } from "../../interfaces/sheets/common";
import SheetVersionModal from "../../modals/SheetVersionModal";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons";
import SheetPdfViewer from "../../components/SheetPdfViewer";
import _ from "lodash";
import Filter from "../../components/Filter";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const SheetDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const [detailedResponse, setDetailedResponse] = useState<ISheetDetailedResponse | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [selectedPage, setSelectedPage] = useState<ISubFile | null>(null);

  const [showSheetVersionModal, { toggle: toggleSheetVersionModal }] = useDisclosure(false);

  const [loading, setLoading] = useState(false);

  const currentSheetId = useMemo(() => {
    return location.pathname.split("/")[3];
  }, [location]);

  const handlePageChange = (e: KeyboardEvent) => {
    const { key } = e;
    let selectedPageIndex = -1;

    if (key === "ArrowRight" || key === "ArrowLeft") {
      e.preventDefault();
      selectedPageIndex =
        detailedResponse?.records.findIndex((s) => s.id === selectedPage?.id) || -1;
    }

    if (selectedPageIndex > 0) {
      console.log(selectedPageIndex);
    }
  };

  const getDetailedSheet = async (latest?: boolean) => {
    if (!currentSheetId) return;
    setDetailedResponse(null);
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

      setDetailedResponse(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      showError("Something went wrong");

      setLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handlePageChange);

    return () => {
      window.removeEventListener("keydown", handlePageChange);
    };
  }, []);

  useEffect(() => {
    getDetailedSheet();
  }, [currentSheetId, selectedVersion]);

  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const filteredRecords: IRecord[] = useMemo<IRecord[]>(() => {
    if (!detailedResponse) return [];

    if (tagFilter.length <= 0) return detailedResponse.records;

    return _.filter(detailedResponse.records, (obj) => {
      return _.some(tagFilter, (tag) => _.includes(obj.tags, tag));
    });
  }, [detailedResponse, tagFilter]);

  const pageTitle: string = useMemo<string>(() => {
    if (!detailedResponse) return "";

    return `${detailedResponse?.title} (${detailedResponse?.currentVerion.title} - ${detailedResponse?.currentVerion.version})`;
  }, [detailedResponse]);

  return (
    <Paper>
      <LoadingOverlay visible={loading} />

      <Flex gap="md" align={"end"} direction="row">
        <Title order={4}>{pageTitle}</Title>
        <Text> {selectedPage?.name}</Text>
        <Text size="xs">
          {dayjs(detailedResponse?.currentVerion.date ?? detailedResponse?.startDate).format(
            "MMMM D, YYYY",
          )}
        </Text>
      </Flex>
      <Filter onChange={(e) => setTagFilter(e)} options={detailedResponse?.tags || []} />

      <Grid mt="sm" h="75vh">
        <Grid.Col span={1} h="100%">
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
                    className="hover:scale-110 cursor-pointer"
                  >
                    <Image src={r.thumbnail.url} maw={150} />
                    {r.code}
                  </Flex>
                );
              })}
            </Stack>
          </ScrollArea>
        </Grid.Col>
        <Grid.Col p="md" span={9}>
          {detailedResponse && selectedPage && <SheetPdfViewer file={selectedPage} />}
        </Grid.Col>
        <Grid.Col span={2}>
          <Paper h="100%">
            <Card h="100%">
              <Group position="apart" mb="xs">
                <Text>{t("versions")}:</Text>
                <ActionIcon size="sm" onClick={toggleSheetVersionModal}>
                  <IconPlus />
                </ActionIcon>
              </Group>
              {detailedResponse?.versions.map((v, i) => {
                return (
                  <NavLink
                    key={v.title + i}
                    label={v.title}
                    active={detailedResponse.currentVerion.version === v.version}
                    onClick={async () => {
                      setSelectedVersion(v.version);
                    }}
                  />
                );
              })}
            </Card>
          </Paper>
        </Grid.Col>
      </Grid>

      <SheetVersionModal
        onComplete={() => {
          console.log("COMPLETED");

          getDetailedSheet(true);
        }}
        sheet={detailedResponse}
        onClose={toggleSheetVersionModal}
        opened={showSheetVersionModal}
        title={t("createNewVersion")}
      />
      {/* <Drawer
        title={selectedPage?.name}
        padding="md"
        size={"100%"}
        position="right"
        opened={!!selectedPage}
        onClose={() => setSelectedPage(null)}
      >
        {detailedResponse && selectedPage && <SheetPdfViewer file={selectedPage} />}
      </Drawer> */}
    </Paper>
  );
};

export default SheetDetails;
