import { Button, Grid, LoadingOverlay, Title } from "@mantine/core";
import { IconClock, IconPlus } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import BoardCard from "../../components/BoardCard";
import BoardModal from "../../modals/BoardModal";
import { getBoards } from "../../redux/boardsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { data: boards, loading } = useAppSelector((state) => state.boards);

  useEffect(() => {
    dispatch(getBoards());
  }, []);

  return (
    <div>
      <LoadingOverlay visible={!!loading} overlayBlur={2} />
      <div className="flex justify-between items-center mb-4">
        <Title className="flex items-center gap-4">
          <IconClock size={32} />
          Personal Board
        </Title>

        <Button onClick={() => setModalOpen(true)} size="xs">
          <IconPlus size={16} />
          Create Project
        </Button>
      </div>

      <Grid>
        {boards?.map((board) => {
          return (
            <Grid.Col md={3} lg={2} xs={12} sm={6} key={board._id}>
              <BoardCard board={board} />
            </Grid.Col>
          );
        })}
      </Grid>

      <BoardModal title="Start a Project" opened={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
