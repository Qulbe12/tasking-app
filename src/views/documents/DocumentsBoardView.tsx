import {
  ActionIcon,
  Anchor,
  Button,
  Card,
  Divider,
  Drawer,
  Flex,
  Group,
  Loader,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { FieldType, IAttachment } from "hexa-sdk/dist/app.api";

import React, { useEffect, useMemo, useState } from "react";
import DocumentCard from "../../components/DocumentCard";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import _ from "lodash";
import dayjs from "dayjs";
import {
  IconEdit,
  IconFileText,
  IconLink,
  IconPlugConnected,
  IconPlus,
  IconTrash,
} from "@tabler/icons";
import Filter from "../../components/Filter";
import PdfViewerComponent from "../../components/PdfViewerComponent";

import { useDisclosure } from "@mantine/hooks";
import DocumentsListModal from "../../modals/DocumentsListModal";
import {
  addDocumentUsers,
  addLinkedDocsAction,
  getDocuments,
  removeDocumentFiles,
  removeLinkedDocsAction,
} from "../../redux/api/documentApi";
import ConfirmationModal from "../../modals/ConfirmationModal";
import DocumentUpdateModal from "../../modals/DocumentUpdateModal";
import DocumentModal from "../../modals/DocumentModal";
import { useTranslation } from "react-i18next";
import AvatarGroup from "../../components/AvatarGroup";
import { connectNylas, getAllMessages, getAllThreads } from "../../redux/api/nylasApi";
import EmailModal from "../../modals/EmailModal";
import useChangeLog from "../../hooks/useChangeLog";
import CommentInput from "../../components/CommentInput";
import CommentsList from "../../components/CommentsList";
import { getDocumentComments } from "../../redux/api/commentsApi";
import AddDocumentFilesModal from "../../modals/AddDocumentFilesModal";
import { openConfirmModal } from "@mantine/modals";
import { IDocumentResponse } from "../../interfaces/documents/IDocumentResponse";
import ThreadCard from "../../components/ThreadCard";
import MessageDetails from "../../components/MessageDetails";
import { useLocation } from "react-router-dom";

const DocumentsBoardView = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { state } = useLocation();
  const { getChangeLog, gettingChangeLog, changeLog } = useChangeLog();

  const { data: documents, loaders: documentLoaders } = useAppSelector((state) => state.documents);
  const { data: templates } = useAppSelector((state) => state.templates);
  const { search } = useAppSelector((state) => state.filters);
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { nylasToken, threads, loaders } = useAppSelector((state) => state.nylas);

  const [aUsers, setAUsers] = useState<{ value: string; label: string }[]>([]);
  const [userType, setUserType] = useState<"ccUsers" | "assignedUsers">("assignedUsers");
  const [filter, setFilter] = useState<string[]>([]);

  const [selectedDocument, setSelectedDocument] = useState<IDocumentResponse | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState<string[]>([]);
  const [newForm, setNewForm] = useState<IDocumentResponse>();
  const [selectedLinkedDocument, setSelectedLinkedDocument] = useState<string | undefined>();
  const [showNewMemberModal, setShowMember] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const [showDocumentsModal, { toggle: toggleShowDocumentsModal }] = useDisclosure(false);
  const [showConfirmationModal, { toggle: toggleShowConfirmationModal }] = useDisclosure(false);
  const [showEditModal, { toggle: toggleShowEditModal }] = useDisclosure(false);
  const [showEmailModal, { toggle: toggleShowEmailModal }] = useDisclosure(false);
  const [showAttachmentsModal, { toggle: toggleAttachmentsModal }] = useDisclosure(false);
  const [opened, { toggle }] = useDisclosure(false);
  const [showAssignConfirmationModal, { toggle: toggleAssignConfirmationModal }] =
    useDisclosure(false);
  const theme = useMantineTheme();

  useEffect(() => {
    if (selectedDocument) {
      const foundDocument = documents.find((d) => d.id === selectedDocument.id);
      if (foundDocument) {
        setSelectedDocument(foundDocument);
      }
    }
  }, [documents]);

  useEffect(() => {
    if (!selectedDocument) return;
    setNewForm({ ...newForm, ...selectedDocument });
    dispatch(getDocumentComments({ documentId: selectedDocument.id }));
  }, [selectedDocument]);

  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress, false);
    return () => window.removeEventListener("keydown", handleEscapePress, false);
  }, []);

  useEffect(() => {
    if (!selectedDocument) return;
    const documentCard = document.getElementById(selectedDocument.id);
    documentCard?.scrollIntoView({ behavior: "smooth", block: "center" });
    getChangeLog(selectedDocument.id);
  }, [selectedDocument]);

  useEffect(() => {
    if (!activeBoard) return;
    dispatch(getDocuments({ boardId: activeBoard.id, query: {} }));

    if (!nylasToken || threads.length > 0) return;
    dispatch(getAllThreads({}));
  }, []);

  useEffect(() => {
    if (!activeBoard) return;

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
  }, [activeBoard, userType]);

  const filteredThreads = useMemo(() => {
    return threads.filter((t) => selectedDocument?.linkedEmailIds.includes(t.id));
  }, [selectedDocument]);

  useEffect(() => {
    if (!selectedThreadId) return;
    dispatch(getAllMessages({ thread_id: selectedThreadId }));
  }, [selectedThreadId]);

  useEffect(() => {
    if (state) {
      const { document } = state;

      setSelectedDocument(document);
    }
  }, [state]);

  const filteredData: IDocumentResponse[] = useMemo<IDocumentResponse[]>(() => {
    const lowerSearch = search.toLocaleLowerCase();
    let emailsToFilter: IDocumentResponse[] = documents;

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

    return emailsToFilter;
  }, [filter, documents, search]);

  const handleAddButtonClick = () => {
    toggle();
  };

  const handleEscapePress = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSelectedDocument(null);
    }
  };

  return (
    <Paper h="80vh">
      <div className="mb-2">
        <Filter options={templates.map((t) => t.name)} onChange={setFilter} />
      </div>

      {!selectedDocument && (
        <Group position="right">
          <Button onClick={handleAddButtonClick}>
            <IconPlus size={16} />
            {t("newDocument")}
          </Button>
        </Group>
      )}

      <Group></Group>
      {documents.length < 0 && (
        <Text>
          You do not have any boards created, please{" "}
          <Anchor component="button" onClick={handleAddButtonClick}>
            Create a Document!
          </Anchor>
        </Text>
      )}

      <ScrollArea>
        {selectedDocument ? (
          <Flex w="100%" justify="space-between" className="h-full">
            <Flex
              className="h-full"
              w="20%"
              sx={{
                [theme.fn.smallerThan("md")]: {
                  width: "300px",
                  marginRight: "4px",
                },
              }}
            >
              <Card shadow="lg" w="100%" className="h-full">
                <Flex justify="space-between">
                  <Title order={4} mb="md">
                    {t("documents")}
                  </Title>
                  <Button leftIcon={<IconPlus size={"0.8em"} />} onClick={handleAddButtonClick}>
                    {t("newDocument")}
                  </Button>
                </Flex>
                <ScrollArea h="70vh">
                  {filteredData.map((d, i) => {
                    return (
                      <div
                        key={i}
                        className="mb-4"
                        id={d.id}
                        onClick={() => {
                          const element = document.getElementById(d.id);
                          element?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                      >
                        <DocumentCard
                          selected={selectedDocument ? selectedDocument.id : undefined}
                          document={d}
                          onClick={() => {
                            setSelectedDocument(d);
                          }}
                        />
                      </div>
                    );
                  })}
                </ScrollArea>
              </Card>
            </Flex>

            {/* Document Details */}
            <Flex
              w="30%"
              className="h-full"
              sx={{
                [theme.fn.smallerThan("md")]: {
                  width: "300px",
                  marginRight: "4px",
                },
              }}
            >
              <Card w="100%" shadow="lg" className="h-full w-full">
                <ScrollArea h="75vh">
                  <Flex justify="space-between" mb="xl">
                    <Text size="lg">{selectedDocument?.title}</Text>
                    <Button
                      leftIcon={<IconEdit size="1em" />}
                      onClick={() => toggleShowEditModal()}
                    >
                      {t("edit")}
                    </Button>
                  </Flex>

                  <Stack>
                    {Object.entries(selectedDocument).map(([k, v], i) => {
                      const inputIndex = selectedDocument.template.fields.findIndex(
                        (f) => f.key === k,
                      );

                      if (k === "template") return;
                      if (inputIndex < 0) return;

                      let value = v;

                      if (selectedDocument.template.fields[inputIndex].type === FieldType.Date) {
                        value = dayjs(v).format("MMMM D, YYYY");
                      }

                      return (
                        <div key={i + "document" + k + v}>
                          {inputIndex >= 0 ? (
                            <Flex direction="column">
                              <Text weight="bolder" size="sm">
                                {_.startCase(k)}:
                              </Text>

                              <Text size="sm">{value || "no value"}</Text>
                            </Flex>
                          ) : (
                            <Text>{k}:</Text>
                          )}
                        </div>
                      );
                    })}

                    <Flex direction="column">
                      <Flex direction="row" align="center" justify="space-between">
                        <Text weight="bolder" size="sm">
                          {t("assignedUsers")}:
                        </Text>
                        <ActionIcon
                          size="sm"
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
                          {t("ccUsers")}:
                        </Text>
                        <ActionIcon
                          size="sm"
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

                    <Group position="apart" align="center">
                      <Text>{t("attachments")}:</Text>
                      <ActionIcon variant="filled" size="sm" onClick={toggleAttachmentsModal}>
                        <IconPlus />
                      </ActionIcon>
                    </Group>
                    {selectedDocument.attachments.map((a) => {
                      return (
                        <Flex
                          onClick={() => {
                            setSelectedAttachment(a);
                          }}
                          gap="md"
                          style={{ cursor: "pointer" }}
                          align="center"
                          justify="space-between"
                          key={a.id}
                        >
                          <Group align="center">
                            <IconFileText size={24} />
                            <p>{a.name}</p>
                          </Group>
                          <ActionIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!selectedDocument) return;
                              openConfirmModal({
                                title: "Please confirm your action",
                                confirmProps: {
                                  loading: !!documentLoaders.updating,
                                },
                                children: (
                                  <Text size="sm">
                                    Are you sure you want to delete {a.name} file from{" "}
                                    {selectedDocument.title}
                                  </Text>
                                ),
                                labels: { confirm: "Confirm", cancel: "Cancel" },
                                onConfirm: async () => {
                                  await dispatch(
                                    removeDocumentFiles({
                                      documentId: selectedDocument.id,
                                      attachments: [a.id],
                                    }),
                                  );
                                },
                              });
                            }}
                            variant="subtle"
                            size="sm"
                            color="red"
                          >
                            <IconTrash />
                          </ActionIcon>
                        </Flex>
                      );
                    })}
                  </Stack>

                  <Divider label={t("documentHistory")} my="md" />

                  {gettingChangeLog && <Loader size="sm" />}

                  <Table withColumnBorders={false}>
                    <tbody>
                      {changeLog.reverse().map((cl, clIndex) => {
                        return cl.change.map((ch) => {
                          return (
                            <tr key={cl.rid + clIndex}>
                              <td>
                                {`${cl.by.name} ${ch.type} ${_(ch.key).startCase()} from ${
                                  ch.oldVal
                                } to ${ch.val}`}
                              </td>
                              <td className="text-end">
                                {dayjs(cl.date).format("MM/DD/YY HH:mm")}
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </Table>
                </ScrollArea>
              </Card>
            </Flex>

            {/* Related Emails */}
            <Flex
              w="20%"
              className="h-full"
              wrap="wrap"
              sx={{
                [theme.fn.smallerThan("md")]: {
                  width: "300px",
                  marginRight: "4px",
                },
              }}
            >
              <Card w="100%" shadow="md" className="h-full" pos="relative">
                <LoadingOverlay visible={loaders.gettingThreads} overlayBlur={2} />
                <Tabs variant="outline" defaultValue="comments" className="h-full">
                  <Tabs.List mb="md">
                    <Tabs.Tab value="emails">Emails</Tabs.Tab>
                    <Tabs.Tab value="comments">Comments</Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="emails">
                    <Group position="apart" mb="xl">
                      <Title order={4}>{t("relatedEmails")}</Title>
                      <Button
                        disabled={!nylasToken ? true : false}
                        leftIcon={<IconLink size={14} />}
                        onClick={toggleShowEmailModal}
                      >
                        {t("composeEmail")}
                      </Button>
                    </Group>

                    {filteredThreads.map((t) => {
                      return (
                        <ThreadCard
                          thread={t}
                          onClick={() => setSelectedThreadId(t.id)}
                          key={t.id}
                        />
                      );
                    })}
                    {!nylasToken && (
                      <Flex direction="column" gap="md" style={{ height: "90%" }}>
                        <Text>{t("emailNotConnected")}</Text>
                        <Button
                          leftIcon={<IconPlugConnected size={"1em"} />}
                          onClick={() => {
                            dispatch(connectNylas());
                          }}
                        >
                          {t("connect")}
                        </Button>
                      </Flex>
                    )}
                  </Tabs.Panel>

                  <Tabs.Panel value="comments" className="h-full">
                    <Flex
                      direction="column"
                      style={{
                        height: "90%",
                      }}
                      justify="space-between"
                    >
                      <ScrollArea className="h-full w-full">
                        <CommentsList />
                      </ScrollArea>
                      <CommentInput documentId={selectedDocument.id} />
                    </Flex>
                  </Tabs.Panel>
                </Tabs>
              </Card>
            </Flex>

            <Flex
              w="25%"
              sx={{
                [theme.fn.smallerThan("md")]: {
                  width: "300px",
                  marginRight: "4px",
                },
              }}
            >
              <Card w="100%" shadow="md" className="h-full">
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
                <ScrollArea h="70vh">
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
            </Flex>
          </Flex>
        ) : (
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: "md", cols: 3, spacing: "md" },
              { maxWidth: "sm", cols: 2, spacing: "sm" },
              { maxWidth: "xs", cols: 1, spacing: "sm" },
            ]}
          >
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
            <PdfViewerComponent
              selectedDocument={selectedDocument}
              attachment={selectedAttachment}
            />
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

        <DocumentModal onClose={toggle} opened={opened} title={t("createDocument")} />

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
              onClick={() => {
                setShowMember((o) => !o);
              }}
            >
              {t("cancel")}
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
              {t("addUsers")}
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

        <AddDocumentFilesModal
          document={selectedDocument}
          onClose={toggleAttachmentsModal}
          opened={showAttachmentsModal}
        />

        <Modal size="2xl" opened={!!selectedThreadId} onClose={() => setSelectedThreadId(null)}>
          <MessageDetails
            onDocumentCardClick={(d) => {
              setSelectedDocument(d);
              setSelectedThreadId(null);
            }}
            selectedThreadId={selectedThreadId}
            onForwardClick={() => {
              //
            }}
          />
        </Modal>
      </ScrollArea>
    </Paper>
  );
};

export default DocumentsBoardView;
