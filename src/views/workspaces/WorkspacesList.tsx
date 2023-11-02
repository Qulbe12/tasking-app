import {
  Anchor,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Group,
  Modal,
  Paper,
  Progress,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconDeviceLaptop, IconHammer, IconPlus } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useEffect, useMemo, useState } from "react";
import WorkspaceModal from "../../modals/WorkspaceModal";
import { getAllWorkSpaces } from "../../redux/api/workspacesApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";

import BoardCard from "../../components/BoardCard";
import useChangeBoard from "../../hooks/useChangeBoard";
import BoardModal from "../../modals/BoardModal";
import { useDisclosure } from "@mantine/hooks";
import { setActiveWorkspace } from "../../redux/slices/workspacesSlice";
import { deleteBoard, getAllSharedBoards } from "../../redux/api/boardsApi";
import useDebouncedValue from "../../hooks/useDebounedValue";
import IBoardResponse from "../../interfaces/boards/IBoardResponse";

const WorkspacesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();

  const {
    handleBoardChange,
    loadingText: boardLoadingText,
    loadingValue: boardLoadingValue,
  } = useChangeBoard();

  const { data: workspaces, loading } = useAppSelector((state) => state.workspaces);
  const { sharedBoards } = useAppSelector((state) => state.boards);
  const { search } = useAppSelector((state) => state.filters);

  const searchTerm = useDebouncedValue(search, 500);

  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedBoard, setSelectedBoard] = useState<IBoardResponse | undefined>();
  const [boardEditModalOpen, setBoardEditModalOpen] = useState(false);

  const [showBoardModal, { toggle: toggleBoardModal }] = useDisclosure(false);

  const filteredWorkspaces = useMemo(() => {
    if (!searchTerm) return workspaces;
    return workspaces
      .map((workspace) => ({
        ...workspace,
        boards: workspace.boards.filter((board) =>
          board.title.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      }))
      .filter((workspace) => workspace.boards.length > 0);
  }, [searchTerm, workspaces]);

  useEffect(() => {
    dispatch(getAllWorkSpaces());
    console.log("workspaces", workspaces);
    dispatch(getAllSharedBoards());
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

      {workspaces.length <= 0 && !loading && (
        <Text>
          You do not have any workspaces created, please{" "}
          <Anchor
            component="button"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            Create a workspace!
          </Anchor>
        </Text>
      )}

      {filteredWorkspaces.map((workspace) => {
        if (!workspace.iAmOwner) return;
        return (
          <Paper key={workspace.id} w="100%" mb="md" shadow="md" p="md" withBorder>
            <Flex gap="md" align="center">
              <Group>
                <IconHammer /> <Text size="xl">{workspace.name}</Text>
              </Group>
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
                    onClick={() => handleBoardChange(board.id, workspace.id, true)}
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
          </Paper>
        );
      })}

      <Divider my="xl" />
      <Title className="flex items-center gap-4" order={4}>
        Shared Boards
      </Title>

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
        {sharedBoards.map((board) => {
          return (
            <BoardCard
              key={board.id}
              board={board}
              onClick={() => handleBoardChange(board.id, "", true)}
            />
          );
        })}
      </Flex>

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
