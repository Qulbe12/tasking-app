import { Button, Group, Paper, SimpleGrid, Skeleton, Title } from "@mantine/core";
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
  gettingDocuments?: boolean;
};

const DocumentsGridView: React.FC<DocumentsGridViewProps> = ({
  documents,
  onDocumentClick,
  gettingDocuments,
}) => {
  const { t } = useTranslation();

  const [showDocumentModal, { open: openDocumentModal, close: closeDocumentModal }] =
    useDisclosure(false);

  const handleDocumentClick = (document: IDocumentResponse) => onDocumentClick(document);

  return (
    <Paper p="md">
      <Group position="apart">
        <Title order={4}>{t("documents")}</Title>
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
        {!gettingDocuments ? (
          documents.map((d) => (
            <DocumentCard
              document={d}
              key={d.id + "documentsGrid"}
              onClick={() => handleDocumentClick(d)}
            />
          ))
        ) : (
          <>
            <Skeleton height={250} />
            <Skeleton height={250} />
            <Skeleton height={250} />
            <Skeleton height={250} />
            <Skeleton height={250} />
            <Skeleton height={250} />
          </>
        )}
      </SimpleGrid>

      <DocumentModal
        opened={showDocumentModal}
        onClose={closeDocumentModal}
        title={t("createDocument")}
        onAfterCreate={(doc) => onDocumentClick(doc)}
      />
    </Paper>
  );
};

export default DocumentsGridView;
