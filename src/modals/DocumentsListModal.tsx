import { Button, Flex, Input, Modal, SimpleGrid, Stack } from "@mantine/core";
import { IDocument } from "hexa-sdk/dist/app.api";
import { useMemo, useState } from "react";
import DocumentCard from "../components/DocumentCard";
import Filter from "../components/Filter";
import { useAppSelector } from "../redux/store";
import CommonModalProps from "./CommonModalProps";
import { IconSearch } from "@tabler/icons";

type DocumentsListModalProps = {
  onDocumentClick?: (document: IDocument) => void;
  selectedDocuments?: string[];
  okText?: string;
  onOk?: () => void;
  loading?: boolean;
};

const DocumentsListModal = ({
  opened,
  onClose,
  onDocumentClick,
  selectedDocuments,
  title,
  okText,
  loading,
  onOk,
}: CommonModalProps & DocumentsListModalProps) => {
  const { data, loading: documentsLoading } = useAppSelector((state) => state.documents);
  const { data: templates } = useAppSelector((state) => state.templates);

  const [filter, setFilter] = useState<string[]>([]);

  const [search, setSearch] = useState<string>("");

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
    <Modal size="80%" opened={opened} onClose={onClose} title={title}>
      <Stack spacing={"md"}>
        <Input
          icon={<IconSearch />}
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <Filter options={templates.map((t) => t.name)} onChange={setFilter} />

        <SimpleGrid cols={4}>
          {!documentsLoading &&
            filteredData.map((d) => {
              if (!d) return "NO D";
              return (
                <DocumentCard
                  selected={selectedDocuments?.find((docId) => d.id === docId)}
                  document={d}
                  key={d.id}
                  onClick={() => onDocumentClick && onDocumentClick(d)}
                />
              );
            })}
        </SimpleGrid>

        <Flex gap="md" justify="flex-end">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button loading={loading} onClick={onOk} variant="filled">
            {okText}
          </Button>
        </Flex>
      </Stack>
    </Modal>
  );
};

export default DocumentsListModal;