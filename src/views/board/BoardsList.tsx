import { Button, Grid, LoadingOverlay, Title } from "@mantine/core";
import { IconClock, IconPlus } from "@tabler/icons";
import { IBoard } from "hexa-sdk/dist/app.api";
import React, { useEffect, useMemo, useState } from "react";
import BoardCard from "../../components/BoardCard";
import BoardModal from "../../modals/BoardModal";
import { deleteBoard, getBoards } from "../../redux/api/boardsApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const BoardsList = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { data: boards, loading } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { search } = useAppSelector((state) => state.filters);

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    dispatch(getBoards(activeWorkspace?.id));
  }, [activeWorkspace]);

  const filteredBoards = useMemo(() => {
    return boards.filter((board) => {
      return JSON.stringify(board).toLowerCase().includes(search.toLowerCase().trim());
    });
  }, [search]);

  const [selectedBoard, setSelectedBoard] = useState<IBoard | undefined>();

  return (
    <div>
      <LoadingOverlay visible={!!loading} overlayBlur={2} />
      <div className="flex justify-between items-center mb-4">
        <Title className="flex items-center gap-4">
          <IconClock size={32} />
          Boards
        </Title>

        <Button onClick={() => setModalOpen(true)} size="xs">
          <IconPlus size={16} />
          Create Board
        </Button>
      </div>

      <Grid>
        {filteredBoards?.map((board, i) => {
          return (
            <Grid.Col span="content" key={i}>
              <BoardCard
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
          title={selectedBoard ? "Start a Project" : "Update Project"}
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedBoard(undefined);
          }}
          board={selectedBoard}
        />
      )}
    </div>
  );
};

export default BoardsList;
