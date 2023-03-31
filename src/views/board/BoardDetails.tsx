import { Button, Flex, Grid, Tabs, useMantineTheme } from "@mantine/core";
import { IconChartBar, IconPhoto, IconPlus, IconUser } from "@tabler/icons";
import React, { CSSProperties, useEffect } from "react";
import _ from "lodash";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getDocuments } from "../../redux/api/documentApi";
import { getAllTemplates } from "../../redux/api/templateApi";
import Teams from "../teams/Teams";
import AnalyticsPage from "../analytics/AnalyticsPage";
import DocumentsBoardView from "../documents/DocumentsBoardView";
import DocumentModal from "../../modals/DocumentModal";
import { useDisclosure } from "@mantine/hooks";

const BoardDetails = () => {
  const theme = useMantineTheme();
  const dispatch = useAppDispatch();

  const { activeBoard } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);

  useEffect(() => {
    if (!activeBoard?.id) return;
    dispatch(getDocuments({ boardId: activeBoard?.id, query: {} }));
    if (!activeWorkspace?.id) return;
    dispatch(getAllTemplates(activeWorkspace?.id));
  }, []);

  const [opened, { toggle }] = useDisclosure(false);

  const tabs = [
    {
      value: "workItems",
      icon: <IconPhoto size="0.8rem" />,
      element: <DocumentsBoardView />,
    },
    {
      value: "analytics",
      icon: <IconChartBar size="0.8rem" />,
      element: <AnalyticsPage />,
    },
    {
      value: "teams",
      icon: <IconUser size="0.8rem" />,
      element: <Teams />,
    },
  ];

  const tabsStyles: CSSProperties = {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
  };

  const handleAddButtonClick = () => {
    toggle();
  };

  return (
    <div>
      <Tabs defaultValue={tabs[0].value}>
        <Grid>
          <Grid.Col span={8}>
            <Tabs.List style={tabsStyles} className="w-fit">
              {tabs.map((t, i) => {
                return (
                  <Tabs.Tab value={t.value} icon={t.icon} key={i + "tabTitle"}>
                    {_.startCase(t.value)}
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex gap="md" justify="flex-end">
              <Button
                leftIcon={<IconPlus size={"0.8em"} />}
                size="xs"
                variant="subtle"
                onClick={handleAddButtonClick}
              >
                Add Another Item
              </Button>
            </Flex>
          </Grid.Col>
        </Grid>

        {tabs.map((t) => {
          return (
            <Tabs.Panel value={t.value} pt="xs" key={t.value}>
              {t.element}
            </Tabs.Panel>
          );
        })}
      </Tabs>

      <DocumentModal onClose={toggle} opened={opened} title="Create Document" />
    </div>
  );
};

export default BoardDetails;
