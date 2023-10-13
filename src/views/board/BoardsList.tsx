import { Button, Center, Grid, Modal, Progress, Title } from "@mantine/core";
import { IconClock, IconPlus } from "@tabler/icons";
import { useEffect, useMemo, useState } from "react";
import BoardCard from "../../components/BoardCard";
import BoardModal from "../../modals/BoardModal";
import { deleteBoard } from "../../redux/api/boardsApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import useChangeBoard from "../../hooks/useChangeBoard";
import { setActiveBoard } from "../../redux/slices/boardsSlice";
import IBoardResponse from "../../interfaces/boards/IBoardResponse";

const BoardsList = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const { handleBoardChange, loadingText, loadingValue } = useChangeBoard();

  useEffect(() => {
    dispatch(setActiveBoard(null));
  }, []);

  const { data: boards, loading: gettingBoards } = useAppSelector((state) => state.boards);
  const { search } = useAppSelector((state) => state.filters);

  const [selectedBoard, setSelectedBoard] = useState<IBoardResponse | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      return JSON.stringify(board).toLowerCase().includes(search.toLowerCase().trim());
    });
  }, [search, boards]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title className="flex items-center gap-4" order={3}>
          <IconClock size={32} />
          {t("boards")}
        </Title>

        <Button disabled={!!gettingBoards} onClick={() => setModalOpen(true)}>
          <IconPlus size={16} />
          {t("createBoard")}
        </Button>
      </div>

      <Grid>
        {filteredBoards?.map((board, i) => {
          return (
            <Grid.Col span="content" key={i}>
              <BoardCard
                onClick={() => handleBoardChange(board)}
                board={board}
                onEditClick={() => {
                  setSelectedBoard(board);
                  setModalOpen(true);
                }}
                onDeleteClick={() => {
                  dispatch(deleteBoard(board.id));
                }}
              />
            </Grid.Col>
          );
        })}
      </Grid>
      {modalOpen && (
        <BoardModal
          title={!selectedBoard ? t("createBoard") : t("updateBoard")}
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedBoard(undefined);
          }}
          board={selectedBoard}
        />
      )}

      <Modal
        opacity={0.9}
        opened={!!loadingText}
        onClose={() => {
          //
        }}
        withCloseButton={false}
        fullScreen
        transition="fade"
        transitionDuration={100}
      >
        <Center maw={900} h={"90vh"} mx="auto">
          <div className="w-full">
            <Progress value={loadingValue} animate />
            {loadingText || "Loading..."}
          </div>
        </Center>
      </Modal>
    </div>
  );
};

export default BoardsList;
