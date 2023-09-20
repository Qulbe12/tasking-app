import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  Progress,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDeviceLaptop, IconPlus } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useEffect, useState } from "react";
import WorkspaceModal from "../../modals/WorkspaceModal";
import { getAllWorkSpaces } from "../../redux/api/workspacesApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";

import BoardCard from "../../components/BoardCard";
import useChangeBoard from "../../hooks/useChangeBoard";
import BoardModal from "../../modals/BoardModal";
import { useDisclosure } from "@mantine/hooks";
import { setActiveWorkspace } from "../../redux/slices/workspacesSlice";
import { deleteBoard } from "../../redux/api/boardsApi";
import { IEntityBoard } from "../../interfaces/IEntityBoard";

const WorkspacesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const {
    handleBoardChange,
    loadingText: boardLoadingText,
    loadingValue: boardLoadingValue,
  } = useChangeBoard();

  const { data: workspaces, loading } = useAppSelector((state) => state.workspaces);

  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  const [showBoardModal, { toggle: toggleBoardModal }] = useDisclosure(false);

  const [selectedBoard, setSelectedBoard] = useState<IEntityBoard | undefined>();
  const [boardEditModalOpen, setBoardEditModalOpen] = useState(false);
  const theme = useMantineTheme();

  useEffect(() => {
    dispatch(getAllWorkSpaces());
  }, []);

  return (
    <Box>
      <Box
        className="flex justify-between items-center mb-4 mt-4"
        sx={{
          [theme.fn.smallerThan("sm")]: {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Title className="flex items-center gap-4" order={2}>
          <IconDeviceLaptop size={32} />
          {t("workspaces")}
        </Title>

        <Button leftIcon={<IconPlus size={16} />} onClick={() => setModalOpen(true)}>
          {t("createWorkspace")}
        </Button>
      </Box>

      {workspaces?.map((workspace) => {
        if (!workspace.iAmOwner) return;
        return (
          <Box key={workspace.id} w="100%">
            <Flex gap="md" align="center">
              <Text size="xl">{workspace.name}</Text>
              <Button
                onClick={() => {
                  dispatch(setActiveWorkspace(workspace));
                  setSelectedBoard(undefined);
                  toggleBoardModal();
                }}
                leftIcon={<IconPlus size={14} />}
              >
                {t("addBoard")}
              </Button>
            </Flex>
            <Flex
              gap="md"
              wrap="wrap"
              w={"100%"}
              mt="md"
              mb="xl"
              sx={{
                [theme.fn.smallerThan("md")]: {
                  wrap: "wrap",
                  gap: 8,
                },
                [theme.fn.smallerThan("sm")]: {
                  gap: 8,
                },
              }}
            >
              {workspace.boards?.map((board) => {
                return (
                  <BoardCard
                    key={board.id}
                    board={board}
                    onClick={() => handleBoardChange(board, workspace.id)}
                    onEditClick={() => {
                      setSelectedBoard(board);
                      setBoardEditModalOpen(true);
                    }}
                    onDeleteClick={() => {
                      dispatch(deleteBoard(board.id));
                    }}
                  />
                );
              })}
            </Flex>
          </Box>
        );
      })}

      <Divider my="xl" />
      <Title className="flex items-center gap-4" order={4}>
        Shared Boards
      </Title>

      <SimpleGrid cols={6} mt="md" mb="xl" spacing="xl">
        {workspaces?.map((workspace) => {
          if (workspace.iAmOwner) return;
          return workspace.boards.map((board) => {
            return (
              <BoardCard
                workspace={workspace}
                key={board.id + workspace.id}
                board={board}
                onClick={() => handleBoardChange(board, workspace.id)}
              />
            );
          });
        })}
      </SimpleGrid>

      {modalOpen && (
        <WorkspaceModal
          title={!selectedWorkspace ? t("createWorkspace") : t("updateWorkspace")}
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedWorkspace(undefined);
          }}
          workspace={selectedWorkspace}
        />
      )}

      <Modal
        opacity={0.8}
        opened={!!boardLoadingText}
        onClose={() => {
          //
        }}
        withCloseButton={false}
        fullScreen
        transition="fade"
        transitionDuration={100}
      >
        <Center maw={900} h={"50vh"} mx="auto">
          <div className="w-full">
            <Progress value={boardLoadingValue} animate />
            {boardLoadingText || "Loading..."}
          </div>
        </Center>
      </Modal>

      <Modal
        opacity={0.8}
        opened={loading}
        onClose={() => {
          //
        }}
        withCloseButton={false}
        fullScreen
        transition="fade"
        transitionDuration={100}
      >
        <Center maw={900} h={"50vh"} mx="auto">
          <div className="w-full">
            <Progress value={100} animate />
            {t("loadingWorkspaces")}
          </div>
        </Center>
      </Modal>

      <BoardModal title={t("createBoard")} onClose={toggleBoardModal} opened={showBoardModal} />

      <BoardModal
        title={!selectedBoard ? t("createBoard") : t("updateBoard")}
        opened={boardEditModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedBoard(undefined);
          setBoardEditModalOpen(false);
        }}
        board={selectedBoard}
      />
    </Box>
  );
};

export default WorkspacesList;
