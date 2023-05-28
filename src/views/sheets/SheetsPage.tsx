import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  ActionIcon,
  Button,
  Drawer,
  Flex,
  Grid,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { getSheets } from "../../redux/api/sheetsApi";
import { IconArrowLeft, IconPlus } from "@tabler/icons";
import SheetModal from "../../modals/SheetModal";
import { useDisclosure } from "@mantine/hooks";
import { Document, Page, pdfjs } from "react-pdf";
import SheetCard from "../../components/SheetCard";
import { ISheetResponse } from "../../interfaces/sheets/ISheetResponse";
import { IAttachment, ISubFile } from "../../interfaces/sheets/common";
import SheetPdfViewer from "../../components/SheetPdfViewer";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const SheetsPage = () => {
  const dispatch = useAppDispatch();

  const { data: sheets, loaders } = useAppSelector((state) => state.sheets);
  const { activeBoard } = useAppSelector((state) => state.boards);

  useEffect(() => {
    if (!activeBoard) return;
    dispatch(getSheets({ boardId: activeBoard.id }));
  }, []);

  const [showSheetModal, { toggle: toggleSheetModal }] = useDisclosure(false);

  const handleAddButtonClick = () => {
    toggleSheetModal();
  };

  const [selectedSheet, setSelectedSheet] = useState<ISheetResponse | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const [selectedPage, setSelectedPage] = useState<ISubFile | null>(null);

  useEffect(() => {
    if (selectedSheet && selectedSheet.attachments.length > 0) {
      setSelectedAttachment(selectedSheet.attachments[0] as any);
    }
  }, [selectedSheet]);

  return (
    <Paper>
      <LoadingOverlay visible={loaders.gettingSheets} />
      <Flex mb="md" justify="space-between">
        {selectedSheet ? (
          <Flex gap="md" align={"center"}>
            <ActionIcon
              onClick={() => {
                setSelectedSheet(null);
                setSelectedAttachment(null);
                setSelectedPage(null);
              }}
            >
              <IconArrowLeft />
            </ActionIcon>
            <Title order={4}>{selectedSheet.title}</Title>
          </Flex>
        ) : (
          <div />
        )}
        {!selectedSheet && (
          <Button onClick={handleAddButtonClick} size="xs">
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
        <Grid>
          <Grid.Col p="md" span={10}>
            <Text mb="md" weight="bold">
              Files:
            </Text>
            <Grid>
              {selectedAttachment?.subFiles.map((f, i) => {
                return (
                  <Grid.Col key={f.id} span="content">
                    <Flex
                      onClick={() => {
                        setSelectedPage(f);
                      }}
                      direction="column"
                      align="center"
                      justify="center"
                      className="hover:scale-110 cursor-pointer"
                    >
                      <Document renderMode="svg" file={f.url}>
                        <Page className="w-20 h-20" width={10} pageNumber={1} />
                      </Document>
                      Page {i + 1}
                    </Flex>
                  </Grid.Col>
                );
              })}
            </Grid>
          </Grid.Col>
          <Grid.Col span={2}>
            <Text weight="bold">Documents:</Text>
            {selectedSheet?.attachments.map((a) => {
              return (
                <Text
                  lineClamp={1}
                  bg={selectedAttachment?.id === a.id ? "indigo" : undefined}
                  p="4px"
                  className="cursor-pointer"
                  onClick={() => setSelectedAttachment(a)}
                  key={a.id}
                >
                  {a.name.split(".pdf")[0]}
                </Text>
              );
            })}
          </Grid.Col>
        </Grid>
      )}

      <SheetModal onClose={toggleSheetModal} opened={showSheetModal} title="Create New Sheet" />
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
