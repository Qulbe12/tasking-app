import { Button, Center, Grid, Modal, Progress, Skeleton, Title } from "@mantine/core";
import { IconDeviceLaptop, IconPlus } from "@tabler/icons";
import { IWorkspace } from "hexa-sdk/dist/app.api";
import { useEffect, useState } from "react";
import WorkspaceCard from "../../components/WorkspaceCard";
import WorkspaceModal from "../../modals/WorkspaceModal";
import { getAllWorkSpaces, removeWorkspace } from "../../redux/api/workspacesApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import useChangeWorkspace from "../../hooks/useChangeWorkspace";

const WorkspacesList = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { handleWorkspaceChange, loadingText, loadingValue } = useChangeWorkspace();

  const { data: workspaces, loading } = useAppSelector((state) => state.workspaces);

  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | undefined>();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllWorkSpaces());
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4 mt-4">
        <Title className="flex items-center gap-4" order={3}>
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
                  onClick={() => handleWorkspaceChange(workspace)}
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

      <Modal
        opacity={0.8}
        opened={!!loadingText}
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
            <Progress value={loadingValue} animate />
            {loadingText || "Loading..."}
          </div>
        </Center>
      </Modal>
    </div>
  );
};

export default WorkspacesList;
