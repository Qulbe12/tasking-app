import { Button, Grid, LoadingOverlay, Title } from "@mantine/core";
import { IconClock, IconPlus } from "@tabler/icons";
import { IBoard } from "hexa-sdk/dist/app.api";
import React, { useState } from "react";
import BoardCard from "../../components/BoardCard";
import BoardModal from "../../modals/BoardModal";
import { deleteBoard } from "../../redux/api/boardsApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { data: boards, loading } = useAppSelector((state) => state.boards);

  const [selectedBoard, setSelectedBoard] = useState<IBoard | undefined>();

  return (
    <div>
      <LoadingOverlay visible={!!loading} overlayBlur={2} />
      <div className="flex justify-between items-center mb-4">
        <Title className="flex items-center gap-4" order={3}>
          <IconClock size={32} />
          Personal Board
        </Title>

        <Button onClick={() => setModalOpen(true)}>
          <IconPlus size={16} />
          Create Project
        </Button>
      </div>

      <Grid>
        {boards?.map((board, i) => {
          return (
            <Grid.Col span="content" key={i}>
              <BoardCard
                onClick={() => {
                  //
                }}
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
          title={!selectedBoard ? "Start a Project" : "Update Project"}
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

export default Dashboard;
