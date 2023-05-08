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

import React, { useEffect, useMemo, useState } from "react";
import DocumentCard from "../../components/DocumentCard";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import _ from "lodash";
import dayjs from "dayjs";
import { IconFileText, IconPlus } from "@tabler/icons";
import Filter from "../../components/Filter";
import PdfViewerComponent from "../../components/PdfViewerComponent";

import { useDisclosure } from "@mantine/hooks";
import DocumentsListModal from "../../modals/DocumentsListModal";
import { addLinkedDocsAction, removeLinkedDocsAction } from "../../redux/api/documentApi";
import ConfirmationModal from "../../modals/ConfirmationModal";
import DocumentUpdateModal from "../../modals/DocumentUpdateModal";
import DocumentModal from "../../modals/DocumentModal";

const DocumentsBoardView = () => {
  const dispatch = useAppDispatch();

  const {
    data: documents,
    loading: documentsLoading,
    loaders: documentLoaders,
  } = useAppSelector((state) => state.documents);
  const { data: templates } = useAppSelector((state) => state.templates);
  const { user } = useAppSelector((state) => state.auth);
  const { search } = useAppSelector((state) => state.filters);

  const [filter, setFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

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
    if (filter.length || statusFilter.length) {
      return documents.filter((d) => {
        return filter.includes(d.template.name) || statusFilter.includes(d.status);
      });
    }

    return documents;
  }, [filter, documents, search, statusFilter]);

  const [selectedDocument, setSelectedDocument] = React.useState<IDocument | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState<string[]>([]);

  const [showDocumentsModal, { toggle: toggleShowDocumentsModal }] = useDisclosure(false);
  const [showConfirmationModal, { toggle: toggleShowConfirmationModal }] = useDisclosure(false);
  const [showEditModal, { toggle: toggleShowEditModal }] = useDisclosure(false);

  const [selectedLinkedDocument, setSelectedLinkedDocument] = useState<string | undefined>();

  useEffect(() => {
    if (selectedDocument) {
      const foundDocument = documents.find((d) => d.id === selectedDocument.id);
      if (foundDocument) {
        setSelectedDocument(foundDocument);
      }
    }
  }, [documents]);

  const [newForm, setNewForm] = useState<IDocument>();

  useEffect(() => {
    if (!selectedDocument) return;
    setNewForm({ ...newForm, ...selectedDocument });
  }, [selectedDocument]);

  const [opened, { toggle }] = useDisclosure(false);

  const handleAddButtonClick = () => {
    toggle();
  };

  return (
    <Paper h="80vh">
      <div className="mb-2">
        <Filter options={templates.map((t) => t.name)} onChange={setFilter} />
        <Filter options={["Complete", "In Progress", "Todo"]} onChange={setStatusFilter} />
      </div>

      <LoadingOverlay visible={!!documentsLoading} overlayBlur={2} />
      <Grid className="h-full">
        <Grid.Col className="h-full" span={3}>
          <Card shadow="lg" className="h-full">
            <Flex justify="space-between">
              <Title order={4} mb="md">
                Tasks
              </Title>
              <Button
                leftIcon={<IconPlus size={"0.8em"} />}
                size="xs"
                variant="subtle"
                onClick={handleAddButtonClick}
              >
                New Task
              </Button>
            </Flex>
            <ScrollArea className="h-full">
              {filteredData.map((document, i) => {
                return (
                  <div key={i} className="mb-4">
                    <DocumentCard
                      selected={selectedDocument ? selectedDocument.id : undefined}
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
                  <Button size="xs" onClick={() => toggleShowEditModal()}>
                    Edit
                  </Button>
                </Flex>
                <Stack>
                  <Flex direction="column">
                    <Text weight="bolder" size="sm">
                      Created By:
                    </Text>
                    <Text size="sm">
                      {selectedDocument.createdBy.name}
                      {user?.user.id === selectedDocument.createdBy.id && " (me)"}
                    </Text>
                  </Flex>
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
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  size="sm"
                  onClick={toggleShowDocumentsModal}
                >
                  <IconPlus size={24} />
                </ActionIcon>
              </Flex>
              <ScrollArea>
                {selectedDocument?.linkedDocs.map((d) => {
                  const foundDocument = documents.find((doc) => doc.id === d);
                  return (
                    <div key={d} className="mb-4">
                      <DocumentCard
                        linkedView
                        document={foundDocument}
                        onClick={() => {
                          if (foundDocument) setSelectedDocument(foundDocument);
                        }}
                        onUnlinkIconClick={() => {
                          setSelectedLinkedDocument(d);
                          toggleShowConfirmationModal();
                        }}
                      />
                    </div>
                  );
                })}
              </ScrollArea>
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

      <DocumentsListModal
        okText="Link"
        onOk={async () => {
          if (selectedDocument && selectedDocumentToLink) {
            dispatch(
              await addLinkedDocsAction({
                documentId: selectedDocument.id,
                documentsToLink: selectedDocumentToLink,
              }),
            );
            toggleShowDocumentsModal();
          }
        }}
        selectedDocument={selectedDocument}
        loading={!!documentLoaders.linkingDocument}
        title={"Select a Document To Link to - " + selectedDocument?.title}
        selectedDocuments={selectedDocumentToLink}
        opened={showDocumentsModal}
        onClose={toggleShowDocumentsModal}
        onDocumentClick={(doc) => {
          if (selectedDocumentToLink.includes(doc.id)) {
            setSelectedDocumentToLink(selectedDocumentToLink.filter((d) => d !== doc.id));
          } else {
            setSelectedDocumentToLink([...selectedDocumentToLink, doc.id]);
          }
        }}
      />

      <ConfirmationModal
        type="delete"
        body={`Are you sure you want to unlink ${
          documents.find((d) => d.id === selectedLinkedDocument)?.title
        } from ${selectedDocument?.title}?`}
        opened={showConfirmationModal}
        title="Are you sure?"
        onClose={toggleShowConfirmationModal}
        loading={!!documentLoaders.linkingDocument}
        onOk={async () => {
          if (selectedLinkedDocument && selectedDocument) {
            await dispatch(
              removeLinkedDocsAction({
                documentId: selectedDocument?.id,
                documentsToUnlink: [selectedLinkedDocument],
              }),
            );
            toggleShowConfirmationModal();
          }
        }}
      />

      <DocumentUpdateModal
        opened={showEditModal}
        document={selectedDocument}
        onClose={() => toggleShowEditModal()}
      />

      <DocumentModal onClose={toggle} opened={opened} title="Create Document" />
    </Paper>
  );
};

export default DocumentsBoardView;
