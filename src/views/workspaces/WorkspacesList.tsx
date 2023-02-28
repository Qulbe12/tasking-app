import { Button, Grid, LoadingOverlay, Title } from "@mantine/core";
import { IconDeviceLaptop, IconPlus } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useEffect, useState } from "react";
import WorkspaceCard from "../../components/WorkspaceCard";
import WorkspaceModal from "../../modals/WorkspaceModal";
import { getAllWorkSpaces, removeWorkspace } from "../../redux/api/workspacesApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const WorkspacesList = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { data: workspaces, loading } = useAppSelector((state) => state.workspaces);

  useEffect(() => {
    dispatch(getAllWorkSpaces());
  }, []);

  const [selectedWorkspace, setSlectedWorkspace] = useState<IWorkspace | undefined>();

  return (
    <div>
      <LoadingOverlay visible={!!loading} overlayBlur={2} />
      <div className="flex justify-between items-center mb-4">
        <Title className="flex items-center gap-4">
          <IconDeviceLaptop size={32} />
          Workspaces
        </Title>

        <Button onClick={() => setModalOpen(true)} size="xs">
          <IconPlus size={16} />
          Create Workspace
        </Button>
      </div>

      <Grid>
        {workspaces?.map((workspace, i) => {
          return (
            <Grid.Col span="content" key={i}>
              <WorkspaceCard
                workspace={workspace}
                onEditClick={() => {
                  setSlectedWorkspace(workspace);
                  setModalOpen(true);
                }}
                onDeleteClick={() => {
                  dispatch(removeWorkspace(workspace.id));
                }}
              />
            </Grid.Col>
          );
        })}
      </Grid>

      {modalOpen && (
        <WorkspaceModal
          title={selectedWorkspace ? "Create a Workspace" : "Update Workspace"}
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSlectedWorkspace(undefined);
          }}
          workspace={selectedWorkspace}
        />
      )}
    </div>
  );
};

export default WorkspacesList;
