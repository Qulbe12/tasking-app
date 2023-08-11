import React, { useEffect, useState } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  Flex,
  Button,
  Drawer,
  Grid,
  Text,
  Title,
  Checkbox,
  TransferList,
  TransferListData,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { IAttachment, IDocument } from "hexa-sdk";
import { DocumentPriority, DocumentStatus } from "hexa-sdk/dist/app.api";
import _ from "lodash";

import PdfViewerComponent from "../components/PdfViewerComponent";
import UpdateDynamicField from "../components/UpdateDynamicField";
import { updateDocument } from "../redux/api/documentApi";
import { useDisclosure } from "@mantine/hooks";
import CommonModalProps from "./CommonModalProps";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useForm } from "@mantine/form";
import { IUpdateDocument } from "../interfaces/IUpdateDocument";

type DocumentUpdateModalProps = {
  document?: IDocument | null;
} & CommonModalProps;

const DocumentUpdateModal = ({ onClose, opened, document }: DocumentUpdateModalProps) => {
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);

  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.documents);

  const [ccUsers, setCCUsers] = useState<TransferListData>([[], []]);
  const [assUsers, setAssUsers] = useState<TransferListData>([[], []]);

  const [selectedDocument, setSelectedDocument] = useState<IDocument | null>();

  const [notifySettings, setNotifySettings] = useState({
    notifyAssignedUsers: false,
    notifyCcUsers: false,
  });

  const [newForm, setNewForm] = useState<any>();
  const [pdfOpen, { toggle: togglePdfOpen }] = useDisclosure(false);

  function updateNewForm() {
    if (!document) return;
    setSelectedDocument(document);
    setNewForm({ ...newForm, ...document });
    const modCCUsers = document.ccUsers.map((u) => {
      return {
        value: u,
        label: u,
      };
    });
    setCCUsers([modCCUsers, []]);

    const modAssUsers = document.assignedUsers.map((u) => {
      return {
        value: u.email,
        label: `${u.email} (${u.name})`,
      };
    });

    setAssUsers([modAssUsers, []]);
  }

  useEffect(() => {
    updateNewForm();
  }, [document]);

  const form = useForm<IUpdateDocument>();

  const [showConfirmationModal, { toggle }] = useDisclosure(false);

  return (
    <Modal
      opened={opened}
      title={"Update: " + selectedDocument?.title}
      onClose={() => {
        updateNewForm();
        onClose();
      }}
    >
      {newForm && (
        <form
          onSubmit={form.onSubmit(() => {
            toggle();
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

            {selectedDocument &&
              Object.entries(selectedDocument).map(([k], i) => {
                const inputIndex = selectedDocument.template.fields.findIndex((f) => f.key === k);

                if (k === "template") return;
                if (inputIndex < 0) return;

                return (
                  <div key={i + "document"}>
                    {inputIndex >= 0 ? (
                      <UpdateDynamicField
                        value={newForm[selectedDocument.template.fields[inputIndex].key] || ""}
                        field={selectedDocument.template.fields[inputIndex]}
                        onChange={(e) => {
                          setNewForm({
                            ...newForm,
                            [selectedDocument.template.fields[inputIndex].key]: e,
                          });
                        }}
                      />
                    ) : (
                      <Text>{k}:</Text>
                    )}
                  </div>
                );
              })}

            <Button type="submit" loading={!!loaders.updating}>
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

                  await dispatch(
                    updateDocument({ documentId: selectedDocument?.id, document: newForm }),
                  );
                  setSelectedDocument(null);
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
                              <Text size="sm">{v || ""}</Text>
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
            {selectedAttachment && (
              <PdfViewerComponent
                selectedDocument={selectedDocument}
                attachment={selectedAttachment}
              />
            )}
          </Grid.Col>
        </Grid>
      </Drawer>

      <Modal
        size="50%"
        opened={showConfirmationModal}
        onClose={toggle}
        title={`Update confirmation: ${newForm?.title}`}
      >
        <div>
          <Title mb="md" order={5}>
            Notify:
          </Title>
          <Stack>
            <Checkbox
              size="md"
              label="CC Users"
              checked={notifySettings.notifyCcUsers}
              onChange={(e) =>
                setNotifySettings({ ...notifySettings, notifyCcUsers: e.currentTarget.checked })
              }
            />

            <TransferList
              value={ccUsers}
              onChange={setCCUsers}
              searchPlaceholder="Search..."
              nothingFound="Nothing here"
              titles={["Current CC Users", "Excluded Users"]}
              breakpoint="sm"
            />

            <Checkbox
              size="md"
              label="Notify All Assigned Users"
              checked={notifySettings.notifyAssignedUsers}
              onChange={(e) => {
                setNotifySettings({
                  ...notifySettings,
                  notifyAssignedUsers: e.currentTarget.checked,
                });
              }}
            />

            <TransferList
              value={assUsers}
              onChange={setAssUsers}
              searchPlaceholder="Search..."
              nothingFound="Nothing here"
              titles={["Current Assigned Users", "Excluded Users"]}
              breakpoint="sm"
            />
          </Stack>
        </div>
        <Flex justify="flex-end">
          <Button
            loading={!!loaders.updating}
            onClick={async () => {
              if (!selectedDocument || !newForm) return;

              await dispatch(
                updateDocument({
                  documentId: selectedDocument?.id,
                  document: {
                    ...newForm,
                    notifyUsers: {
                      ccUsers: {
                        notify: notifySettings.notifyCcUsers,
                        exclude: ccUsers[1].map((u) => u.value),
                      },
                      assignedUsers: {
                        notify: notifySettings.notifyAssignedUsers,
                        exclude: assUsers[1].map((u) => u.value),
                      },
                    },
                  },
                }),
              );
              toggle();
              onClose();
            }}
          >
            Update
          </Button>
        </Flex>
      </Modal>
    </Modal>
  );
};

export default DocumentUpdateModal;
