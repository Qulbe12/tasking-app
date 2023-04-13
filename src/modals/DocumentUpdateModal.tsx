import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Flex,
  Button,
  Drawer,
  Grid,
  Text,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconFileText } from "@tabler/icons";
import dayjs from "dayjs";
import { IAttachment, IDocument, IUpdateDocument } from "hexa-sdk";
import { DocumentPriority, DocumentStatus, SubscriptionStatus } from "hexa-sdk/dist/app.api";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import PdfViewerComponent from "../components/PdfViewerComponent";
import UpdateDynamicField from "../components/UpdateDynamicField";
import { updateDocument } from "../redux/api/documentApi";
import { useDisclosure, useId } from "@mantine/hooks";
import CommonModalProps from "./CommonModalProps";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useForm, yupResolver } from "@mantine/form";
import * as yup from "yup";

type DocumentUpdateModalProps = {
  document?: IDocument | null;
} & CommonModalProps;

const DocumentUpdateModal = ({ onClose, opened, document }: DocumentUpdateModalProps) => {
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const id = useId();

  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.documents);

  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>();

  const [newForm, setNewForm] = useState<IDocument>();
  const [pdfOpen, { toggle: togglePdfOpen }] = useDisclosure(false);

  useEffect(() => {
    if (!document) return;
    setSelectedDocument(document);
    setNewForm({ ...newForm, ...document });
  }, [document]);

  const formSchema = useMemo(() => {
    const schema: any = {
      title: yup.string().required("Document title is required"),
      description: yup.string().required("Description is required"),
      startDate: yup.date().required("Start date is required"),
      dueDate: yup.date().required("Due date is required"),
      priority: yup.string().required("Priority is required"),
      status: yup.string().required("Status is required"),
    };

    selectedDocument?.template.fields?.forEach((f) => {
      schema[f.label] = yup.string().required(`${f.label} is required`);
    });
    return yup.object().shape(schema);
  }, []);

  const form = useForm<IUpdateDocument>({ validate: yupResolver(formSchema) });

  return (
    <Modal opened={opened} title={"Update: " + selectedDocument?.title} onClose={onClose}>
      {newForm && (
        <form
          onSubmit={form.onSubmit(async () => {
            console.log(selectedDocument?.title);

            if (!selectedDocument) return;
            // form.setValues();
            console.log(newForm);

            await dispatch(updateDocument({ documentId: selectedDocument?.id, document: newForm }));
            onClose();
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
                    togglePdfOpen();
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
              onClick={() => {
                setSelectedAttachment(null);
              }}
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
          togglePdfOpen();
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
  );
};

export default DocumentUpdateModal;
