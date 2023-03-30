import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Flex,
  Grid,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IAttachment, IDocument } from "hexa-sdk";
import React, { useMemo, useState } from "react";
import DocumentCard from "../../components/DocumentCard";
import { useAppSelector } from "../../redux/store";
import _ from "lodash";
import dayjs from "dayjs";
import { IconFileText, IconPlus } from "@tabler/icons";
import Collapsable from "../../components/Collapsable";
import Filter from "../../components/Filter";
import PdfViewerComponent from "../../components/PdfViewerComponent";

const DocumentsBoardView = () => {
  const { data: documents, loading: documentsLoading } = useAppSelector((state) => state.documents);
  const { data: templates } = useAppSelector((state) => state.templates);
  const { search } = useAppSelector((state) => state.filters);

  const [filter, setFilter] = useState<string[]>([]);
  //   const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filteredData: IDocument[] = useMemo<IDocument[]>(() => {
    if (search && filter.length) {
      return documents.filter((d) => {
        return (
          JSON.stringify(d).toLowerCase().includes(search.toLocaleLowerCase()) &&
          filter.includes(d.template.name)
        );
      });
    }
    if (search) {
      return documents.filter((d) => {
        return JSON.stringify(d).toLowerCase().includes(search.toLocaleLowerCase());
      });
    }
    if (filter.length) {
      return documents.filter((d) => {
        return filter.includes(d.template.name);
      });
    }

    return documents;
  }, [filter, documents, search]);

  const [selectedDocument, setSelectedDocument] = React.useState<IDocument | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);

  return (
    <Paper p="md" className="flex flex-col" style={{ height: "80vh" }}>
      <Collapsable>
        <Filter options={templates.map((t) => t.name)} onChange={setFilter} />
        {/* <Filter
          options={[DocumentStatus.Complete, DocumentStatus.InProgresss, DocumentStatus.Todo]}
          onChange={setStatusFilter}
        /> */}
      </Collapsable>
      <LoadingOverlay visible={!!documentsLoading} overlayBlur={2} />
      <Grid className="h-full">
        <Grid.Col className="h-full" span={3}>
          <Card shadow="lg" className="h-full">
            <Title order={4} mb="md">
              Tasks
            </Title>
            <ScrollArea className="h-full">
              {filteredData.map((document, i) => {
                return (
                  <div key={i} className="mb-4">
                    <DocumentCard
                      document={document}
                      onClick={() => setSelectedDocument(document)}
                    />
                  </div>
                );
              })}
            </ScrollArea>
          </Card>
        </Grid.Col>
        {selectedDocument && (
          <Grid.Col className="h-full" span={3}>
            <Card shadow="lg" className="h-full">
              <ScrollArea className="h-full">
                <Flex justify="space-between" mb="xl">
                  <Text size="lg">{selectedDocument?.title}</Text>
                  <Button size="xs">Edit</Button>
                </Flex>
                <Stack>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Title:
                    </Text>
                    <Text size="sm">{selectedDocument.title}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Description:
                    </Text>
                    <Text size="sm">{selectedDocument.description}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Start Date:
                    </Text>
                    <Text size="sm">
                      {dayjs(selectedDocument.startDate).format("MMMM DD, YYYY")}
                    </Text>
                  </Flex>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Due Date:
                    </Text>
                    <Text size="sm">{dayjs(selectedDocument.dueDate).format("MMMM DD, YYYY")}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Priority:
                    </Text>
                    <Text size="sm">{selectedDocument.priority}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Status:
                    </Text>
                    <Text size="sm">{selectedDocument.status}</Text>
                  </Flex>

                  {Object.entries(selectedDocument).map(([k, v], i) => {
                    const inputIndex = selectedDocument.template.fields.findIndex(
                      (f) => f.key === k,
                    );

                    if (k === "template") return;
                    if (inputIndex < 0) return;

                    return (
                      <div key={i + "document"}>
                        {inputIndex >= 0 ? (
                          <Flex direction="column">
                            <Text weight="bolder" size="sm">
                              {_.startCase(k)}:
                            </Text>
                            <Text size="sm">{v}</Text>
                          </Flex>
                        ) : (
                          <Text>{k}:</Text>
                        )}
                      </div>
                    );
                  })}

                  <Text>Attachments:</Text>
                  {selectedDocument.attachments.map((a) => {
                    return (
                      <Flex
                        onClick={() => {
                          setSelectedAttachment(a);
                        }}
                        gap="md"
                        style={{ cursor: "pointer" }}
                        align="center"
                        key={a.id}
                      >
                        <IconFileText size={32} />
                        <p>{a.name}</p>
                      </Flex>
                    );
                  })}
                </Stack>
              </ScrollArea>
            </Card>
          </Grid.Col>
        )}
        {selectedDocument && (
          <Grid.Col span={3}>
            <Card shadow="md" className="h-full">
              <Title order={4} mb="md">
                Related Email
              </Title>

              <Text c="dimmed">This document does not have any related emails yet...</Text>
            </Card>
          </Grid.Col>
        )}

        {selectedDocument && (
          <Grid.Col span={3}>
            <Card shadow="md" className="h-full">
              <Flex justify="space-between">
                <Title order={4} mb="md">
                  Linked Documents
                </Title>
                <ActionIcon variant="filled" radius="xl" size="sm">
                  <IconPlus size={24} />
                </ActionIcon>
              </Flex>
              {selectedDocument?.linkedDocs.map((d) => {
                return <DocumentCard key={d} document={documents.find((doc) => doc.id === d)} />;
              })}
            </Card>
          </Grid.Col>
        )}
      </Grid>
      <Drawer
        padding="md"
        size={selectedAttachment?.type === "Sheets" ? "100%" : "50%"}
        position="right"
        opened={!!selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
      >
        {selectedAttachment && <PdfViewerComponent documentUrl={selectedAttachment.url} />}
      </Drawer>
    </Paper>
  );
};

export default DocumentsBoardView;
