import { Tabs } from "@mantine/core";
import { IconUsers } from "@tabler/icons";
import React from "react";
import GroupsTab from "./GroupsTab";
import MembersTab from "./MembersTab";

const Teams = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="members">
        <Tabs.List>
          <Tabs.Tab value="members" icon={<IconUsers size={14} />}>
            Members
          </Tabs.Tab>
          <Tabs.Tab value="groups" icon={<IconUsers size={14} />}>
            Groups
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="members" pt="xs">
          <MembersTab />
        </Tabs.Panel>

        <Tabs.Panel value="groups" pt="xs">
          <GroupsTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Teams;
