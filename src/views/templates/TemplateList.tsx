import { Button, Divider, Flex, Grid, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import TemplateCard from "../../components/TemplateCard";
import { getAllTemplates } from "../../redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import TemplateModal from "../../modals/TemplateModal";

const TemplateList = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const templates = useAppSelector((state) => state.templates);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  function toggleOpen() {
    setOpen((o) => !o);
  }

  useEffect(() => {
    if (!activeWorkspace?.id) return;
    dispatch(getAllTemplates(activeWorkspace.id));
  }, []);

  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>();

  return (
    <div className="p-4">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Form Templates</Title>
        <Button onClick={toggleOpen}>Add Form</Button>
      </Flex>
      <Divider label="Default Templates" my="md" />
      <Grid>
        {templates.data?.map((t) => {
          if (t.default) {
            return (
              <Grid.Col
                onClick={() => {
                  setSelectedTemplate(t.id);
                  toggleOpen();
                }}
                span={2}
                key={t.id}
              >
                <TemplateCard template={t} />
              </Grid.Col>
            );
          }
        })}
      </Grid>

      {templates.data.find((t) => t.default === true) && (
        <div>
          <Divider label="Workspace Templates" my="md" />
          <Grid>
            {templates.data?.map((t) => {
              if (!t.default) {
                return (
                  <Grid.Col
                    onClick={() => {
                      setSelectedTemplate(t.id);
                      toggleOpen();
                    }}
                    span={2}
                    key={t.id}
                  >
                    <TemplateCard template={t} />
                  </Grid.Col>
                );
              }
            })}
          </Grid>
        </div>
      )}

      <TemplateModal
        opened={open}
        onClose={() => {
          setSelectedTemplate(undefined);
          toggleOpen();
        }}
        template={templates.data[templates.data.findIndex((t) => t.id === selectedTemplate)]}
      />
    </div>
  );
};

export default TemplateList;
