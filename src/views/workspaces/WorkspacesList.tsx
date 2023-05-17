import { Button, Grid, Skeleton, Title } from "@mantine/core";
import { IconDeviceLaptop, IconPlus } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useEffect, useState } from "react";
import WorkspaceCard from "../../components/WorkspaceCard";
import WorkspaceModal from "../../modals/WorkspaceModal";
import { getAllWorkSpaces, removeWorkspace } from "../../redux/api/workspacesApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";

const WorkspacesList = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { data: workspaces, loading } = useAppSelector((state) => state.workspaces);

  useEffect(() => {
    dispatch(getAllWorkSpaces());
  }, []);

  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | undefined>();

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-4">
        <Title className="flex items-center gap-4">
          <IconDeviceLaptop size={32} />
          {t("workspaces")}
        </Title>

        <Button onClick={() => setModalOpen(true)} size="xs">
          <IconPlus size={16} />
          {t("createWorkspace")}
        </Button>
      </div>
      {!!loading && <Skeleton height={64} width={300} radius="sm" />}
      {!loading && (
        <Grid>
          {workspaces?.map((workspace, i) => {
            return (
              <Grid.Col span="content" key={i}>
                <WorkspaceCard
                  workspace={workspace}
                  onEditClick={() => {
                    setSelectedWorkspace(workspace);
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
      )}

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
    </div>
  );
};

export default WorkspacesList;
