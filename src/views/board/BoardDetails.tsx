import { Tabs } from "@mantine/core";
import { IconChartBar, IconPhoto, IconUser } from "@tabler/icons";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getDocuments } from "../../redux/api/documentApi";
import { getAllTemplates } from "../../redux/api/templateApi";
import Teams from "../teams/Teams";
import AnalyticsPage from "../analytics/AnalyticsPage";
import DocumentsBoardView from "../documents/DocumentsBoardView";

const BoardDetails = () => {
  const dispatch = useAppDispatch();

  const { activeBoard } = useAppSelector((state) => state.boards);
  const { activeWorkspace } = useAppSelector((state) => state.workspaces);
  const { boardTab } = useAppSelector((state) => state.menus);

  useEffect(() => {
    if (!activeBoard?.id) return;
    dispatch(getDocuments({ boardId: activeBoard?.id, query: {} }));
    if (!activeWorkspace?.id) return;
    dispatch(getAllTemplates(activeWorkspace?.id));
  }, []);

  const tabs = [
    {
      value: "Work Items",
      icon: <IconPhoto size="0.8rem" />,
      element: <DocumentsBoardView />,
    },
    {
      value: "Analytics",
      icon: <IconChartBar size="0.8rem" />,
      element: <AnalyticsPage />,
    },
    {
      value: "Teams",
      icon: <IconUser size="0.8rem" />,
      element: <Teams />,
    },
  ];

  return (
    <div>
      <Tabs defaultValue={tabs[0].value} value={boardTab}>
        {tabs.map((t) => {
          return (
            <Tabs.Panel value={t.value} pt="xs" key={t.value}>
              {t.element}
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </div>
  );
};

export default BoardDetails;
