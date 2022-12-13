import { Button, Title } from "@mantine/core";
import { IconClock, IconPlus } from "@tabler/icons";
import React, { useState } from "react";
import BoardModal from "../../modals/BoardModal";

const Dashboard = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title className="flex items-center gap-4">
          <IconClock size={32} />
          Personal Board
        </Title>

        <Button onClick={() => setModalOpen(true)} size="xs">
          <IconPlus size={16} />
          Create Project
        </Button>
      </div>

      <BoardModal title="Start a Project" opened={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Dashboard;
