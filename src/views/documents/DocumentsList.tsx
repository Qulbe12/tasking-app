import {
  Button,
  Drawer,
  Flex,
  Grid,
  LoadingOverlay,
  Modal,
  MultiSelect,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconFileText } from "@tabler/icons";
import {
  DocumentPriority,
  DocumentStatus,
  IAttachment,
  IDocument,
  IUpdateDocument,
  SubscriptionStatus,
} from "hexa-sdk/dist/app.api";
import React, { useEffect, useMemo, useState } from "react";
import Collapsable from "../../components/Collapsable";
import DocumentCard from "../../components/DocumentCard";
import Filter from "../../components/Filter";
import PdfViewerComponent from "../../components/PdfViewerComponent";
import UpdateDynamicField from "../../components/UpdateDynamicField";
import DocumentModal from "../../modals/DocumentModal";
import { getDocuments, updateDocument } from "../../redux/api/documentApi";
import { getAllTemplates } from "../../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import _ from "lodash";
import dayjs from "dayjs";
import { useId } from "@mantine/hooks";

const DocumentsList = () => {
  const [open, setOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const id = useId();

  function toggleOpen() {
    setOpen((o) => !o);
  }

  const dispatch = useAppDispatch();
  const { activeBoard } = useAppSelector((state) => state.boards);
  const { data, loading, loaders } = useAppSelector((state) => state.documents);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { data: templates } = useAppSelector((state) => state.templates);
  const { search } = useAppSelector((state) => state.filters);

  useEffect(() => {
    if (!activeBoard?.id) return;
    dispatch(getDocuments({ boardId: activeBoard?.id, query: {} }));
    if (!activeWorkspace?.id) return;
    dispatch(getAllTemplates(activeWorkspace?.id));
  }, []);

  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>(null);

  const [newForm, setNewForm] = useState<IDocument>();

  useEffect(() => {
    if (!selectedDocument) return;
    setNewForm({ ...newForm, ...selectedDocument });
  }, [selectedDocument]);

  const form = useForm<IUpdateDocument>();

  const [filter, setFilter] = useState<string[]>([]);

  const filteredData: IDocument[] = useMemo<IDocument[]>(() => {
    if (search && filter.length) {
      return data.filter((d) => {
        return (
          JSON.stringify(d).toLowerCase().includes(search.toLocaleLowerCase()) &&
          filter.includes(d.template.name)
        );
      });
    }
    if (search) {
      return data.filter((d) => {
        return JSON.stringify(d).toLowerCase().includes(search.toLocaleLowerCase());
      });
    }
    if (filter.length) {
      return data.filter((d) => {
        return filter.includes(d.template.name);
      });
    }

    return data;
  }, [filter, data, search]);

  return (
    <div className="">
      <Collapsable>
        <Filter
          // options={templates.map((t) => t.name)}
          options={templates.map((t) => t.name)}
          onChange={setFilter}
        />
      </Collapsable>

      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Documents</Title>
        <Button onClick={toggleOpen}>Add Document</Button>
      </Flex>

      <LoadingOverlay visible={!!loading} />

      <Grid>
        {!loading &&
          filteredData.map((d) => {
            if (!d) return "NO D";
            return (
              <Grid.Col
                key={d.id}
                span="content"
                onClick={() => {
                  setSelectedDocument(d);
                }}
              >
                <DocumentCard document={d} />
              </Grid.Col>
            );
          })}
        {/* <Grid.Col span="content">
          <DocumentCard addCard />
        </Grid.Col> */}
      </Grid>

      <DocumentModal onClose={toggleOpen} opened={open} title="Create Document" />

      <Modal
        opened={!!selectedDocument}
        title={selectedDocument?.title}
        onClose={() => {
          setSelectedDocument(null);
        }}
      >
        {newForm && (
          <form
            onSubmit={form.onSubmit(async () => {
              if (!selectedDocument) return;
              // form.setValues();
              console.log(newForm);

              await dispatch(
                updateDocument({ documentId: selectedDocument?.id, document: newForm }),
              );
              setSelectedDocument(null);

              // console.log(vals);
            })}
          >
            <Stack>
              <TextInput
                value={newForm?.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                label="Title"
                withAsterisk
              />
              <Textarea
                label="Description"
                withAsterisk
                value={newForm?.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
              />
              <DatePicker
                label="Start Date"
                value={new Date(newForm?.startDate || "")}
                onChange={(e) => {
                  if (!e) return;
                  setNewForm({ ...newForm, startDate: e });
                }}
              />
              <DatePicker
                label="Due Date"
                withAsterisk
                value={new Date(newForm?.dueDate || "")}
                onChange={(e) => {
                  if (!e) return;
                  setNewForm({ ...newForm, dueDate: e });
                }}
              />
              <Select
                label="Priority"
                placeholder="Pick one"
                withAsterisk
                data={[
                  { value: DocumentPriority.Low, label: "Low" },
                  { value: DocumentPriority.High, label: "High" },
                  { value: DocumentPriority.Urgent, label: "Urgent" },
                ]}
                value={newForm?.priority}
                onChange={(e: DocumentPriority) => setNewForm({ ...newForm, priority: e })}
              />
              <Select
                label="Status"
                placeholder="Pick one"
                withAsterisk
                data={[
                  { value: DocumentStatus.Todo, label: "Todo" },
                  { value: DocumentStatus.InProgresss, label: "In Progress" },
                  { value: DocumentStatus.Complete, label: "Complete" },
                ]}
                value={newForm?.status}
                onChange={(e: DocumentStatus) => setNewForm({ ...newForm, status: e })}
              />
              <MultiSelect
                disabled
                label="Assign Users"
                data={newForm.assignedUsers.map((u) => u.email)}
                placeholder="Select users"
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  setNewForm({
                    ...newForm,
                    assignedUsers: [
                      ...newForm.assignedUsers,
                      {
                        avatar: "",
                        email: item.value,
                        id: id,
                        name: item.value,
                        role: "user",
                        subscription: SubscriptionStatus.Active,
                      },
                    ],
                  });
                  return item;
                }}
              />

              <MultiSelect
                label="CC'd Users"
                data={newForm.ccUsers}
                value={newForm.ccUsers}
                placeholder="Add emails"
                searchable
                creatable
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  setNewForm({
                    ...newForm,
                    ccUsers: [...newForm.ccUsers, item.value],
                  });
                  return item;
                }}
              />

              <MultiSelect
                label="Link Documents"
                data={data.map((d) => {
                  return {
                    value: d.id,
                    label: d.title,
                  };
                })}
                value={newForm.linkedDocs}
                placeholder="Add emails"
                searchable
                onChange={(e) => {
                  setNewForm({
                    ...newForm,
                    linkedDocs: e,
                  });
                }}
                getCreateLabel={(query) => `+ Add ${query}`}
                onCreate={(query) => {
                  const item = { value: query, label: query };
                  console.log(item);

                  // setNewForm({
                  //   ...newForm,
                  //   linkedDocs: [...newForm.linkedDocs, item.value],
                  // });
                  return item;
                }}
              />

              {selectedDocument &&
                Object.entries(selectedDocument).map(([k, v], i) => {
                  const inputIndex = selectedDocument.template.fields.findIndex((f) => f.key === k);

                  if (k === "template") return;
                  if (inputIndex < 0) return;

                  return (
                    <div key={i + "document"}>
                      {inputIndex >= 0 ? (
                        <UpdateDynamicField
                          value={v}
                          field={selectedDocument.template.fields[inputIndex]}
                          onChange={(e) => {
                            setNewForm({
                              ...newForm,
                              [selectedDocument.template.fields[inputIndex].key]: e,
                            });
                            console.log(e);
                          }}
                        />
                      ) : (
                        <Text>{k}:</Text>
                      )}
                    </div>
                  );
                })}
              <p>Attachments</p>
              {selectedDocument?.attachments.map((a) => {
                return (
                  <Flex
                    onClick={() => {
                      setSelectedAttachment(a);
                      setPdfOpen(true);
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

              <Button
                type="submit"
                loading={!!loaders.updating}
                // onClick={() => {
                //   setPdfOpen((o) => !o);
                //   setSelectedAttachment(null);
                // }}
              >
                Update
              </Button>
            </Stack>
          </form>
        )}

        <Drawer
          padding="md"
          position="right"
          size={"100%"}
          title={selectedAttachment?.name}
          opened={pdfOpen}
          onClose={() => {
            setPdfOpen((o) => !o);
            setSelectedAttachment(null);
          }}
        >
          <Grid
            style={{
              overflow: "scroll",
            }}
          >
            <Grid.Col span={3}>
              {newForm && (
                <form
                  onSubmit={form.onSubmit(async () => {
                    if (!selectedDocument) return;
                    // form.setValues();
                    console.log(newForm);

                    await dispatch(
                      updateDocument({ documentId: selectedDocument?.id, document: newForm }),
                    );
                    setSelectedDocument(null);

                    // console.log(vals);
                  })}
                >
                  <Stack>
                    <Flex direction="column">
                      <Text weight="bolder" size="sm">
                        Title:
                      </Text>
                      <Text size="sm">{newForm.title}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text weight="bolder" size="sm">
                        Description:
                      </Text>
                      <Text size="sm">{newForm.description}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text weight="bolder" size="sm">
                        Start Date:
                      </Text>
                      <Text size="sm">{dayjs(newForm.startDate).format("MMMM DD, YYYY")}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text weight="bolder" size="sm">
                        Due Date:
                      </Text>
                      <Text size="sm">{dayjs(newForm.dueDate).format("MMMM DD, YYYY")}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text weight="bolder" size="sm">
                        Priority:
                      </Text>
                      <Text size="sm">{newForm.priority}</Text>
                    </Flex>
                    <Flex direction="column">
                      <Text weight="bolder" size="sm">
                        Status:
                      </Text>
                      <Text size="sm">{newForm.status}</Text>
                    </Flex>

                    {selectedDocument &&
                      Object.entries(selectedDocument).map(([k, v], i) => {
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
                  </Stack>
                </form>
              )}
            </Grid.Col>
            <Grid.Col span={9}>
              {selectedAttachment && <PdfViewerComponent documentUrl={selectedAttachment.url} />}
            </Grid.Col>
          </Grid>
        </Drawer>
      </Modal>
    </div>
  );
};

export default DocumentsList;
