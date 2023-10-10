import React, { useState, useCallback, useMemo } from "react";
import { Button, Group, Paper, ScrollArea, Tabs } from "@mantine/core";
import { IconFolder, IconLink, IconMail } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { IDocumentResponse } from "../../../interfaces/documents/IDocumentResponse";
import DocumentCard from "../../../components/DocumentCard";
import ConfirmationModal from "../../../modals/ConfirmationModal";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useDisclosure } from "@mantine/hooks";
import { addLinkedDocsAction, removeLinkedDocsAction } from "../../../redux/api/documentApi";
import DocumentsListModal from "../../../modals/DocumentsListModal";

type DocumentsLinkedDocsColProps = {
  selectedDocument?: IDocumentResponse | null;
  documents: IDocumentResponse[];
  onDocumentClick: (document: IDocumentResponse) => void;
};

const DocumentsLinkedDocsCol: React.FC<DocumentsLinkedDocsColProps> = ({
  selectedDocument,
  documents,
  onDocumentClick,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { loaders: documentLoaders } = useAppSelector((state) => state.documents);

  const [activeTab, setActiveTab] = useState<string | null>("linkedDocs");
  const [selectedLinkedDocument, setSelectedLinkedDocument] = useState<string | undefined>();
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState<string[]>([]);
  const [showDocumentsModal, { toggle: toggleShowDocumentsModal }] = useDisclosure(false);
  const [showConfirmationModal, { toggle: toggleShowConfirmationModal }] = useDisclosure(false);

  const linkedDocs = useMemo(
    () => selectedDocument?.linkedDocs.map((d) => documents.find((doc) => doc.id === d)),
    [selectedDocument, documents],
  );

  const handleDocumentClickMemoized = useCallback(
    (document?: IDocumentResponse) => {
      if (!document) return;
      onDocumentClick(document);
    },
    [onDocumentClick],
  );

  const handleUnlinkClickMemoized = useCallback(
    (documentId?: string) => {
      setSelectedLinkedDocument(documentId);
      toggleShowConfirmationModal();
    },
    [toggleShowConfirmationModal],
  );

  const handleOkClick = useCallback(async () => {
    if (selectedLinkedDocument && selectedDocument) {
      await dispatch(
        removeLinkedDocsAction({
          documentId: selectedDocument?.id,
          documentsToUnlink: [selectedLinkedDocument],
        }),
      );
      toggleShowConfirmationModal();
    }
  }, [dispatch, selectedLinkedDocument, selectedDocument, toggleShowConfirmationModal]);

  const handleDocumentsModalOkClick = useCallback(async () => {
    if (selectedDocument && selectedDocumentToLink.length) {
      await dispatch(
        addLinkedDocsAction({
          documentId: selectedDocument.id,
          documentsToLink: selectedDocumentToLink,
        }),
      );
      setSelectedDocumentToLink([]);
      toggleShowDocumentsModal();
    }
  }, [dispatch, selectedDocument, selectedDocumentToLink, toggleShowDocumentsModal]);

  return (
    <Paper withBorder className="board">
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab icon={<IconFolder size="1.5em" />} value="linkedDocs">
            {t("linkedDocs")}
          </Tabs.Tab>
          <Tabs.Tab icon={<IconMail size="1.5em" />} value="linkedEmails">
            {t("linkedEmails")}
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <ScrollArea className="content" mt="md">
        <Tabs value={activeTab}>
          <Tabs.Panel value="linkedDocs">
            <Group position="right" mb="md">
              <Button onClick={toggleShowDocumentsModal} leftIcon={<IconLink size="1em" />}>
                {t("linkDocument")}
              </Button>
            </Group>
            {linkedDocs?.map((foundDocument, index) => (
              <div key={index} className="mb-4">
                <DocumentCard
                  linkedView
                  document={foundDocument}
                  onClick={() => handleDocumentClickMemoized(foundDocument)}
                  onUnlinkIconClick={() => handleUnlinkClickMemoized(foundDocument?.id)}
                />
              </div>
            ))}
          </Tabs.Panel>
          <Tabs.Panel value="linkedEmails">Emails</Tabs.Panel>
        </Tabs>
      </ScrollArea>

      <ConfirmationModal
        type="delete"
        body={`${t("unlinkConfirmation")} ${
          documents.find((d) => d.id === selectedLinkedDocument)?.title
        } ${t("from")} ${selectedDocument?.title}?`}
        opened={showConfirmationModal}
        title={`${t("areYouSure")}?`}
        onClose={toggleShowConfirmationModal}
        loading={!!documentLoaders.linkingDocument}
        onOk={handleOkClick}
      />

      <DocumentsListModal
        okText={t("link")}
        onOk={handleDocumentsModalOkClick}
        selectedDocument={selectedDocument}
        loading={!!documentLoaders.linkingDocument}
        title={t("selectedDocumentToLink") + " - " + selectedDocument?.title}
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
    </Paper>
  );
};

export default React.memo(DocumentsLinkedDocsCol);
