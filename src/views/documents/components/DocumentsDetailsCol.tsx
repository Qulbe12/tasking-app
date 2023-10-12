import React, { useCallback, useState } from "react";
import { IAttachment, IDocumentResponse } from "../../../interfaces/documents/IDocumentResponse";
import {
  ActionIcon,
  Drawer,
  Flex,
  Group,
  Menu,
  Paper,
  Stack,
  Text,
  Title,
  ScrollArea,
} from "@mantine/core";
import {
  IconArchive,
  IconDotsVertical,
  IconEdit,
  IconFileText,
  IconPlus,
  IconTrash,
} from "@tabler/icons";
import { useTranslation } from "react-i18next";
import DocumentUpdateModal from "../../../modals/DocumentUpdateModal";
import { useDisclosure } from "@mantine/hooks";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import dayjs from "dayjs";
import _ from "lodash";
import AvatarGroup from "../../../components/AvatarGroup";
import { FieldType } from "../../../interfaces/documents/IField";
import PdfViewerComponent from "../../../components/PdfViewerComponent";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { archiveDocument, removeDocumentFiles } from "../../../redux/api/documentApi";
import { openConfirmModal } from "@mantine/modals";
import AddDocumentFilesModal from "../../../modals/AddDocumentFilesModal";

type DocumentsDetailsColProps = {
  document: IDocumentResponse | null;
  afterArchive: () => void;
};

const DocumentsDetailsCol: React.FC<DocumentsDetailsColProps> = ({ document, afterArchive }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { loaders } = useAppSelector((state) => state.documents);
  const [showEditModal, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [showAttachmentModal, { open: openAttachmentModal, close: closeAttachmentModal }] =
    useDisclosure(false);
  const [
    showArchiveConfirmModal,
    { open: openArchiveConfirmModal, close: closeArchiveConfirmModal },
  ] = useDisclosure(false);

  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);

  const handleEditClick = () => openEditModal();

  const handleArchiveClick = () => openArchiveConfirmModal();

  const handleArchive = useCallback(() => {
    if (!document) return;
    dispatch(archiveDocument(document.id)).finally(() => {
      afterArchive();
      closeArchiveConfirmModal();
    });
  }, [document]);

  const onAttachmentClick = (attachment: IAttachment) => {
    setSelectedAttachment(attachment);
  };

  const onAttachmentDeleteClick = (e: React.MouseEvent, attachment: IAttachment) => {
    e.stopPropagation();
    if (!document) return;
    openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">
          Are you sure you want to delete {attachment.name} file from {document.title}
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        dispatch(
          removeDocumentFiles({
            documentId: document.id,
            attachments: [attachment.id],
          }),
        );
      },
    });
  };

  const onAttachmentAddClick = () => {
    openAttachmentModal();
  };

  return (
    <Paper withBorder className="board">
      <div className="board-header">
        <Flex justify="space-between" py="md" align="center">
          <Title order={4}>{document?.title}</Title>
          <Menu>
            <Menu.Target>
              <ActionIcon size="sm">
                <IconDotsVertical />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconEdit size="1em" />} onClick={handleEditClick}>
                {t("edit")}
              </Menu.Item>
              <Menu.Item icon={<IconArchive size="1em" />} onClick={handleArchiveClick}>
                {t("archive")}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Flex>
      </div>
      <ScrollArea className="content">
        {document && (
          <Stack>
            {Object.entries(document).map(([k, v], i) => {
              const inputIndex = document.template.fields.findIndex((f) => f.key === k);

              if (k === "template") return;
              if (inputIndex < 0) return;

              let value = v;

              if (document.template.fields[inputIndex].type === FieldType.Date) {
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
                    //
                  }}
                >
                  <IconPlus />
                </ActionIcon>
              </Flex>
              <AvatarGroup users={document.assignedUsers} />
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
                    //
                  }}
                >
                  <IconPlus />
                </ActionIcon>
              </Flex>
              <AvatarGroup ccUsers={document.ccUsers} />
            </Flex>

            <Group position="apart" align="center">
              <Text>{t("attachments")}:</Text>
              <ActionIcon variant="filled" size="sm" onClick={onAttachmentAddClick}>
                <IconPlus />
              </ActionIcon>
            </Group>
            {document.attachments.map((a) => {
              return (
                <Flex
                  onClick={() => onAttachmentClick(a)}
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
                    onClick={(e) => onAttachmentDeleteClick(e, a)}
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
        )}
      </ScrollArea>

      {/* Document Update Modal */}
      <DocumentUpdateModal opened={showEditModal} onClose={closeEditModal} document={document} />

      {/* Archive Confirm Modal */}
      <ConfirmationModal
        opened={showArchiveConfirmModal}
        onClose={closeArchiveConfirmModal}
        loading={loaders.updating === document?.id}
        onOk={handleArchive}
        type="archive"
        body={`${t("archiveConfirmation")} ${document?.title}`}
        title={t("archiveDocument")}
      />

      {/* Add Attachment Modal */}
      <AddDocumentFilesModal
        document={document}
        onClose={closeAttachmentModal}
        opened={showAttachmentModal}
      />

      {/* Attachment View Modal */}
      <Drawer
        title={selectedAttachment?.name}
        padding="md"
        size={selectedAttachment?.type === "Sheets" ? "100%" : "50%"}
        position="right"
        opened={!!selectedAttachment}
        onClose={() => setSelectedAttachment(null)}
      >
        {selectedAttachment && (
          <PdfViewerComponent selectedDocument={document} attachment={selectedAttachment} />
        )}
      </Drawer>
    </Paper>
  );
};

export default DocumentsDetailsCol;
