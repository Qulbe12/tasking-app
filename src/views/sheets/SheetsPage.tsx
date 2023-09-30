import { useAppSelector } from "../../redux/store";
import { Button, Flex, Group, Paper, useMantineTheme } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import { pdfjs } from "react-pdf";
import SheetCard from "../../components/SheetCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SheetProcessModal from "../../modals/SheetProcessModal";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url,
).toString();

const SheetsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: sheets } = useAppSelector((state) => state.sheets);

  const [showSheetModal, { toggle: toggleSheetModal }] = useDisclosure(false);
  const theme = useMantineTheme();

  const handleAddButtonClick = () => {
    toggleSheetModal();
  };

  return (
    <Paper>
      <Group mb="md" position="right">
        <Button onClick={handleAddButtonClick} size="xs">
          <IconPlus size={16} />
          {t("addSheet")}
        </Button>
      </Group>
      <Flex wrap="wrap" gap={6}>
        {sheets.map((s) => {
          return (
            <Flex
              sx={{
                [theme.fn.smallerThan("sm")]: {
                  width: "100%",
                },
              }}
              w="20%"
              key={s.id}
            >
              <SheetCard
                sheet={s}
                onClick={() => {
                  navigate(`/board/sheets/${s.id}`);
                }}
              />
            </Flex>
          );
        })}
      </Flex>

      <SheetProcessModal onClose={toggleSheetModal} opened={showSheetModal} />
    </Paper>
  );
};

export default SheetsPage;
