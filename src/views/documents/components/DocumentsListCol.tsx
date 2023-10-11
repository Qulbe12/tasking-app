import { Button, Group, Paper, ScrollArea, Title } from "@mantine/core";
import React from "react";
import { IDocumentResponse } from "../../../interfaces/documents/IDocumentResponse";
import DocumentCard from "../../../components/DocumentCard";
import { IconPlus } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";
import DocumentModal from "../../../modals/DocumentModal";

type DocumentsListColProps = {
  documents: IDocumentResponse[];
  onDocumentClick: (document: IDocumentResponse) => void;
  selectedDocument: IDocumentResponse | null;
};

const DocumentsListCol: React.FC<DocumentsListColProps> = ({
  documents,
  selectedDocument,
  onDocumentClick,
}) => {
  const { t } = useTranslation();

  const [showDocumentModal, { open: openShowDocumentModal, close: closeDocumentModal }] =
    useDisclosure(false);

  const handleDocumentClick = (document: IDocumentResponse) => onDocumentClick(document);

  const handleCardContainerClick = (documentId: string) => {
    const element = document.getElementById(documentId);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleAddButtonClick = () => {
    openShowDocumentModal();
  };

  return (
    <Paper className="board" withBorder>
      <div className="board-header">
        <Group position="apart" align="center">
          <Title order={4}>{t("documents")}</Title>
          <Button leftIcon={<IconPlus size={"1em"} />} onClick={handleAddButtonClick}>
            {t("newDocument")}
          </Button>
        </Group>
      </div>
      <ScrollArea className="content">
        {documents.map((d, i) => {
          return (
            <div key={i} id={d.id} onClick={() => handleCardContainerClick(d.id)}>
              <DocumentCard
                selected={selectedDocument ? selectedDocument.id : undefined}
                document={d}
                onClick={() => handleDocumentClick(d)}
              />
            </div>
          );
        })}
      </ScrollArea>

      <DocumentModal
        opened={showDocumentModal}
        onClose={closeDocumentModal}
        title={t("createDocument")}
        onAfterCreate={(doc) => onDocumentClick(doc)}
      />
    </Paper>
  );
};

export default DocumentsListCol;
