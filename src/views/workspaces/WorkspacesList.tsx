import {
  Button,
  Center,
  Divider,
  Flex,
  Modal,
  Progress,
  SimpleGrid,
  Text,
  Title,
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

  useEffect(() => {
    dispatch(getAllWorkSpaces());
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-4">
        <Title className="flex items-center gap-4" order={2}>
          <IconDeviceLaptop size={32} />
          {t("workspaces")}
        </Title>

        <Button onClick={() => setModalOpen(true)} size="xs">
          <IconPlus size={16} />
          {t("createWorkspace")}
        </Button>
      </div>

      {workspaces?.map((workspace) => {
        if (!workspace.iAmOwner) return;
        return (
          <div key={workspace.id}>
            <Flex gap="md" align="center">
              <Text size="xl">{workspace.name}</Text>
              <Button
                size="sm"
                variant="subtle"
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

            <SimpleGrid cols={4} mt="md" mb="xl" spacing="xl">
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
            </SimpleGrid>
          </div>
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

      <BoardModal onClose={toggleBoardModal} opened={showBoardModal} />

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
    </div>
  );
};

export default WorkspacesList;
