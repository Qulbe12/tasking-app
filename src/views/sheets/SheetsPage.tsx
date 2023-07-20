import { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/store";
import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Flex,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  NavLink,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft, IconPlus } from "@tabler/icons";
import SheetModal from "../../modals/SheetModal";
import { useDisclosure } from "@mantine/hooks";
import { pdfjs } from "react-pdf";
import SheetCard from "../../components/SheetCard";
import { ISheetResponse } from "../../interfaces/sheets/ISheetResponse";
import { ISubFile } from "../../interfaces/sheets/common";
import SheetPdfViewer from "../../components/SheetPdfViewer";
import { axiosPrivate } from "../../config/axios";
import { showError } from "../../redux/commonSliceFunctions";
import { ISheetDetailedResponse } from "../../interfaces/sheets/ISheetDetailedResponse";
import SheetVersionModal from "../../modals/SheetVersionModal";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const SheetsPage = () => {
  const { data: sheets } = useAppSelector((state) => state.sheets);

  const [showSheetModal, { toggle: toggleSheetModal }] = useDisclosure(false);
  const [showSheetVersionModal, { toggle: toggleSheetVersionModal }] = useDisclosure(false);

  const handleAddButtonClick = () => {
    toggleSheetModal();
  };

  const [selectedSheet, setSelectedSheet] = useState<ISheetResponse | null>(null);
  const [selectedPage, setSelectedPage] = useState<ISubFile | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [detailedResponse, setDetailedResponse] = useState<ISheetDetailedResponse | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedSheet) return;
    const foundIndex = sheets.findIndex((s) => s.id === selectedSheet.id);
    if (foundIndex < 0) return;
    const foundSheet = sheets[foundIndex];
    setSelectedSheet(foundSheet);
  }, [sheets]);

  useEffect(() => {
    const getDetailedSheet = async () => {
      if (!selectedSheet) return;
      setDetailedResponse(null);
      setLoading(true);
      let queryString = `/sheets/${selectedSheet.id}`;

      if (selectedVersion) {
        queryString += `?version=${selectedVersion}`;
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

    getDetailedSheet();
  }, [selectedSheet, selectedVersion]);

  return (
    <Paper>
      <LoadingOverlay visible={loading} />
      <Flex mb="md" justify="space-between">
        {selectedSheet ? (
          <Flex gap="md" align={"center"}>
            <ActionIcon
              onClick={() => {
                setSelectedSheet(null);
                setSelectedPage(null);
                setSelectedVersion(null);
              }}
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={4}>
              {selectedSheet.title} (
              {`${detailedResponse?.currentVerion.title} - ${detailedResponse?.currentVerion.version}`}
              )
            </Title>
          </Flex>
        ) : (
          <div />
        )}
        {!selectedSheet && (
          <Button onClick={handleAddButtonClick} size="xs" style={{ zIndex: 101 }}>
            <IconPlus size={16} />
            Add Sheet
          </Button>
        )}
      </Flex>
      {!selectedSheet && (
        <SimpleGrid cols={4}>
          {sheets.map((s) => {
            return (
              <SheetCard
                key={s.id}
                sheet={s}
                onClick={() => {
                  setSelectedSheet(s);
                }}
              />
            );
          })}
        </SimpleGrid>
      )}

      {selectedSheet && (
        <Grid h="84vh">
          <Grid.Col p="md" span={10}>
            <Grid>
              {detailedResponse?.records.map((r) => {
                return (
                  <Grid.Col key={r.id} span="content">
                    <Flex
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
                  </Grid.Col>
                );
              })}
            </Grid>
          </Grid.Col>
          <Grid.Col span={2}>
            <Paper h="100%">
              <Stack h="100%">
                <Card h="50%">
                  <Text>Tags:</Text>
                </Card>
                <Card h="50%">
                  <Group position="apart" mb="xs">
                    <Text>Versions:</Text>
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
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      )}

      <SheetModal onClose={toggleSheetModal} opened={showSheetModal} title="Create New Sheet" />
      <SheetVersionModal
        sheetId={selectedSheet?.id}
        onClose={toggleSheetVersionModal}
        opened={showSheetVersionModal}
        title={"Create New Version"}
      />
      <Drawer
        title={"Page " + selectedPage?.name.split("_")[1]}
        padding="md"
        size={"100%"}
        position="right"
        opened={!!selectedPage}
        onClose={() => setSelectedPage(null)}
      >
        {selectedSheet && selectedPage && <SheetPdfViewer file={selectedPage} />}
      </Drawer>
    </Paper>
  );
};

export default SheetsPage;
