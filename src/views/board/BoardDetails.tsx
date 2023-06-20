import { Tabs } from "@mantine/core";
import { IconChartBar, IconPhoto, IconUser } from "@tabler/icons";
import React from "react";
import { useAppSelector } from "../../redux/store";
import Teams from "../teams/Teams";
import AnalyticsPage from "../analytics/AnalyticsPage";
import DocumentsBoardView from "../documents/DocumentsBoardView";
import SheetsPage from "../sheets/SheetsPage";

const BoardDetails = () => {
  const { boardTab } = useAppSelector((state) => state.menus);

  const tabs = [
    {
      value: "Work Items",
      icon: <IconPhoto size="0.8rem" />,
      element: <DocumentsBoardView />,
    },
    {
      value: "Sheets",
      icon: <IconPhoto size="0.8rem" />,
      element: <SheetsPage />,
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
