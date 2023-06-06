import {
  ActionIcon,
  Button,
  Card,
  Drawer,
  Flex,
  Grid,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Paper,
  ScrollArea,
  SimpleGrid,
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
import { IconFileText, IconLink, IconPlus } from "@tabler/icons";
import Filter from "../../components/Filter";
import PdfViewerComponent from "../../components/PdfViewerComponent";

import { useDisclosure } from "@mantine/hooks";
import DocumentsListModal from "../../modals/DocumentsListModal";
import {
  addDocumentUsers,
  addLinkedDocsAction,
  removeLinkedDocsAction,
} from "../../redux/api/documentApi";
import ConfirmationModal from "../../modals/ConfirmationModal";
import DocumentUpdateModal from "../../modals/DocumentUpdateModal";
import DocumentModal from "../../modals/DocumentModal";
import { useTranslation } from "react-i18next";
import AvatarGroup from "../../components/AvatarGroup";
import { connectNylas } from "../../redux/api/nylasApi";
import EmailModal from "../../modals/EmailModal";
import EmailCard from "../../components/EmailCard";
import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";

const DocumentsBoardView = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const {
    data: documents,
    loading: documentsLoading,
    loaders: documentLoaders,
  } = useAppSelector((state) => state.documents);
  const { data: templates } = useAppSelector((state) => state.templates);
  const { user } = useAppSelector((state) => state.auth);
  const { search } = useAppSelector((state) => state.filters);
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { nylasToken, emails } = useAppSelector((state) => state.nylas);

  const [aUsers, setAUsers] = useState<{ value: string; label: string }[]>([]);
  const [userType, setUserType] = useState<"ccUsers" | "assignedUsers">("assignedUsers");

  useEffect(() => {
    if (activeBoard) {
      if (userType === "assignedUsers") {
        setAUsers(
          activeBoard.members.map((m) => {
            return {
              label: m.email,
              value: m.email,
            };
          }),
        );
      } else {
        setAUsers([]);
      }
    }
  }, [activeBoard, userType]);

  const [filter, setFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const filteredData: IDocument[] = useMemo<IDocument[]>(() => {
    const lowerSearch = search.toLocaleLowerCase();
    let emailsToFilter: IDocument[] = documents;

    if (search) {
      emailsToFilter = emailsToFilter.filter((d) => {
        return _.lowerCase(d.title + d.description + d.status + d.priority).includes(lowerSearch);
      });
    }

    if (filter.length) {
      emailsToFilter = emailsToFilter.filter((d) => {
        return filter.includes(d.template.name);
      });
    }

    if (statusFilter.length) {
      emailsToFilter = emailsToFilter.filter((d) => {
        return statusFilter.includes(d.status);
      });
    }

    return emailsToFilter;
  }, [filter, documents, search, statusFilter]);

  const [selectedDocument, setSelectedDocument] = React.useState<IDocument | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState<string[]>([]);

  const [showDocumentsModal, { toggle: toggleShowDocumentsModal }] = useDisclosure(false);
  const [showConfirmationModal, { toggle: toggleShowConfirmationModal }] = useDisclosure(false);
  const [showEditModal, { toggle: toggleShowEditModal }] = useDisclosure(false);

  const [selectedLinkedDocument, setSelectedLinkedDocument] = useState<string | undefined>();

  const [showNewMemberModal, setShowMember] = useState(false);

  const [showEmailModal, { toggle: toggleShowEmailModal }] = useDisclosure(false);

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

  const filteredEmails: IEmailThreadResponse[] = useMemo(() => {
    if (!selectedDocument) return [];
    return emails.filter((e) => {
      return e.subject.includes(selectedDocument.id);
    });
  }, [emails, selectedDocument]);

  const handleEscapePress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSelectedDocument(null);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress, false);
    return () => window.removeEventListener("keydown", handleEscapePress, false);
  }, []);

  const [showAssignConfirmationModal, { toggle: toggleAssignConfirmationModal }] =
    useDisclosure(false);

  return (
    <Paper h="80vh">
      <div className="mb-2">
        <Filter options={templates.map((t) => t.name)} onChange={setFilter} />
        <Filter options={["Complete", "In Progress", "Todo"]} onChange={setStatusFilter} />
      </div>

      <LoadingOverlay visible={!!documentsLoading} overlayBlur={2} />

      {!selectedDocument && (
        <div className="flex justify-end items-center mb-4">
          <Button onClick={handleAddButtonClick} size="xs">
            <IconPlus size={16} />
            {t("newDocument")}
          </Button>
        </div>
      )}

      {selectedDocument ? (
        <Grid className="h-full">
          <Grid.Col className="h-full" span={3}>
            <Card shadow="lg" className="h-full">
              <Flex justify="space-between">
                <Title order={4} mb="md">
                  {t("documents")}
                </Title>
                <Button
                  leftIcon={<IconPlus size={"0.8em"} />}
                  size="xs"
                  variant="subtle"
                  onClick={handleAddButtonClick}
                >
                  {t("newDocument")}
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
            <Grid.Col className="h-full" span={5}>
              <Card shadow="lg" className="h-full">
                <ScrollArea className="h-full">
                  <Flex justify="space-between" mb="xl">
                    <Text size="lg">{selectedDocument?.title}</Text>
                    <Button size="xs" onClick={() => toggleShowEditModal()}>
                      {t("edit")}
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
                      <Text size="sm">
                        {dayjs(selectedDocument.dueDate).format("MMMM DD, YYYY")}
                      </Text>
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

                    <Flex direction="column">
                      <Flex direction="row" align="center" justify="space-between">
                        <Text weight="bolder" size="sm">
                          Assigned Users:
                        </Text>
                        <ActionIcon
                          variant="filled"
                          onClick={() => {
                            setShowMember((o) => !o);
                            setUserType("assignedUsers");
                          }}
                        >
                          <IconPlus />
                        </ActionIcon>
                      </Flex>
                      <AvatarGroup users={selectedDocument.assignedUsers} />
                    </Flex>

                    <Flex direction="column">
                      <Flex direction="row" align="center" justify="space-between">
                        <Text weight="bolder" size="sm">
                          CC Users:
                        </Text>
                        <ActionIcon
                          variant="filled"
                          onClick={() => {
                            setShowMember((o) => !o);
                            setUserType("ccUsers");
                          }}
                        >
                          <IconPlus />
                        </ActionIcon>
                      </Flex>
                      <AvatarGroup ccUsers={selectedDocument.ccUsers} />
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
                              <Text size="sm">{v || "no value"}</Text>
                            </Flex>
                          ) : (
                            <Text>{k}:</Text>
                          )}
                        </div>
                      );
                    })}

                    <Text>{t("attachments")}:</Text>
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
            <Grid.Col span={2}>
              <Card shadow="md" className="h-full">
                <Flex justify="space-between" mb="xl">
                  <Title order={4} mb="md">
                    {t("relatedEmails")}
                  </Title>
                  <Button
                    leftIcon={<IconLink size={14} />}
                    variant="subtle"
                    size="xs"
                    onClick={toggleShowEmailModal}
                  >
                    Compose Email
                  </Button>
                </Flex>

                {!nylasToken && (
                  <Flex direction="column" gap="md">
                    <Text>Email is not connected, please establish a connection</Text>
                    <Button
                      onClick={() => {
                        dispatch(connectNylas());
                      }}
                    >
                      Connect
                    </Button>
                  </Flex>
                )}
                {nylasToken && !filteredEmails.length && (
                  <Text c="dimmed"> {t("relatedEmailsEmpty")}...</Text>
                )}
                {nylasToken &&
                  filteredEmails.map((e) => {
                    return <EmailCard key={e.id} email={e} />;
                  })}
              </Card>
            </Grid.Col>
          )}

          {selectedDocument && (
            <Grid.Col span={2}>
              <Card shadow="md" className="h-full">
                <Flex justify="space-between">
                  <Title order={4} mb="md">
                    {t("linkedDocuments")}
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
      ) : (
        <SimpleGrid cols={4}>
          {filteredData.map((document) => {
            return (
              <DocumentCard
                key={document.id}
                document={document}
                onClick={() => setSelectedDocument(document)}
              />
            );
          })}
        </SimpleGrid>
      )}
      <Drawer
        title={selectedAttachment?.name}
        padding="md"
        size={selectedAttachment?.type === "Sheets" ? "100%" : "50%"}
        position="right"
        opened={!!selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
      >
        {selectedAttachment && (
          <PdfViewerComponent selectedDocument={selectedDocument} attachment={selectedAttachment} />
        )}
      </Drawer>

      <DocumentsListModal
        okText={t("link")}
        onOk={async () => {
          if (selectedDocument && selectedDocumentToLink) {
            await dispatch(
              addLinkedDocsAction({
                documentId: selectedDocument.id,
                documentsToLink: selectedDocumentToLink,
              }),
            );
            setSelectedDocumentToLink([]);
            toggleShowDocumentsModal();
          }
        }}
        selectedDocument={selectedDocument}
        loading={!!documentLoaders.linkingDocument}
        title={t("selectedDocumentToLink") + " - " + selectedDocument?.title}
        selectedDocuments={selectedDocumentToLink}
        opened={showDocumentsModal}
        onClose={() => {
          toggleShowDocumentsModal();
          setSelectedDocumentToLink([]);
        }}
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
        body={`${t("unlinkConfirmation")} ${
          documents.find((d) => d.id === selectedLinkedDocument)?.title
        } ${t("from")} ${selectedDocument?.title}?`}
        opened={showConfirmationModal}
        title={`${t("areYouSure")}?`}
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

      <Modal
        title={`Assign Users to document - ${selectedDocument?.title}`}
        opened={showNewMemberModal}
        onClose={() => {
          setShowMember((o) => !o);
        }}
      >
        <MultiSelect
          label="Member Emails"
          data={aUsers}
          placeholder="Please select users..."
          searchable
          creatable
          getCreateLabel={(query) => `+ Add ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setAUsers((current) => [...current, item]);
            return item;
          }}
        />

        <Flex mt="md" justify="flex-end" gap="md">
          <Button
            variant="outline"
            onClick={() => {
              setShowMember((o) => !o);
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!selectedDocument) return;

              let hasExtra = false;
              activeBoard?.members.forEach((am) => {
                aUsers.forEach((au) => {
                  if (au.value !== am.email) {
                    hasExtra = true;
                  }
                });
              });

              if (hasExtra && userType === "assignedUsers") {
                toggleAssignConfirmationModal();
                return;
              }

              await dispatch(
                addDocumentUsers({
                  documentId: selectedDocument?.id,
                  emails: aUsers.map((u) => u.value),
                  type: userType,
                }),
              );

              setShowMember(false);
            }}
          >
            Add users
          </Button>
        </Flex>
      </Modal>

      <ConfirmationModal
        onClose={toggleAssignConfirmationModal}
        onOk={async () => {
          if (!selectedDocument) return;
          await dispatch(
            addDocumentUsers({
              documentId: selectedDocument?.id,
              emails: aUsers.map((u) => u.value),
              type: userType,
            }),
          );
          toggleAssignConfirmationModal();
          setShowMember(false);
        }}
        opened={showAssignConfirmationModal}
        type="archive"
        title="Assign Users Confirmation"
        body="Are you sure you want to assign users that are not members of the board?"
      />

      <EmailModal
        selectedDocument={selectedDocument}
        opened={showEmailModal}
        onClose={toggleShowEmailModal}
      />
    </Paper>
  );
};

export default DocumentsBoardView;
