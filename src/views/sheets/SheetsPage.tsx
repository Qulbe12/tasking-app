import { useAppSelector } from "../../redux/store";
import { Button, Group, Paper, SimpleGrid } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import SheetModal from "../../modals/SheetModal";
import { useDisclosure } from "@mantine/hooks";
import { pdfjs } from "react-pdf";
import SheetCard from "../../components/SheetCard";
import { useNavigate } from "react-router-dom";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const SheetsPage = () => {
  const navigate = useNavigate();
  const { data: sheets } = useAppSelector((state) => state.sheets);

  const [showSheetModal, { toggle: toggleSheetModal }] = useDisclosure(false);

  const handleAddButtonClick = () => {
    toggleSheetModal();
  };

  return (
    <Paper>
      <Group mb="md" position="right">
        <Button onClick={handleAddButtonClick} size="xs" style={{ zIndex: 101 }}>
          <IconPlus size={16} />
          Add Sheet
        </Button>
      </Group>
      <SimpleGrid cols={4}>
        {sheets.map((s) => {
          return (
            <SheetCard
              key={s.id}
              sheet={s}
              onClick={() => {
                navigate(`/board/sheets/${s.id}`);
              }}
            />
          );
        })}
      </SimpleGrid>

      <SheetModal onClose={toggleSheetModal} opened={showSheetModal} title="Create New Sheet" />
    </Paper>
  );
};

export default SheetsPage;
