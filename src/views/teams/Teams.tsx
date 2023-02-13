import { Button, Flex, Tabs, Title } from "@mantine/core";
import { IconMessageCircle, IconPhoto, IconSettings, IconUsers } from "@tabler/icons";
import React from "react";
import GroupsTab from "./GroupsTab";

const Teams = () => {
  return (
    <div className="p-4">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Team Management</Title>
      </Flex>

      <Tabs defaultValue="groups">
        <Tabs.List>
          <Tabs.Tab disabled value="members" icon={<IconUsers size={14} />}>
            Members
          </Tabs.Tab>
          <Tabs.Tab value="groups" icon={<IconUsers size={14} />}>
            Groups
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="members" pt="xs">
          Members...
        </Tabs.Panel>

        <Tabs.Panel value="groups" pt="xs">
          <GroupsTab />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Teams;