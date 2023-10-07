import { Button, Group, SimpleGrid } from "@mantine/core";
import React from "react";
import { IDocumentResponse } from "../../../interfaces/documents/IDocumentResponse";
import DocumentCard from "../../../components/DocumentCard";
import { IconPlus } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { useDisclosure } from "@mantine/hooks";
import DocumentModal from "../../../modals/DocumentModal";

type DocumentsGridViewProps = {
  documents: IDocumentResponse[];
  onDocumentClick: (document: IDocumentResponse) => void;
};

const DocumentsGridView: React.FC<DocumentsGridViewProps> = ({ documents, onDocumentClick }) => {
  const { t } = useTranslation();

  const [showDocumentModal, { open: openDocumentModal, close: closeDocumentModal }] =
    useDisclosure(false);

  const handleDocumentClick = (document: IDocumentResponse) => onDocumentClick(document);

  return (
    <div>
      <Group position="right">
        <Button onClick={openDocumentModal}>
          <IconPlus size={16} />
          {t("newDocument")}
        </Button>
      </Group>

      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 3, spacing: "md" },
          { maxWidth: "sm", cols: 2, spacing: "sm" },
          { maxWidth: "xs", cols: 1, spacing: "sm" },
        ]}
      >
        {documents.map((d) => (
          <DocumentCard
            document={d}
            key={d.id + "documentsGrid"}
            onClick={() => handleDocumentClick(d)}
          />
        ))}
      </SimpleGrid>

      <DocumentModal
        opened={showDocumentModal}
        onClose={closeDocumentModal}
        title={t("createDocument")}
      />
    </div>
  );
};

export default DocumentsGridView;
