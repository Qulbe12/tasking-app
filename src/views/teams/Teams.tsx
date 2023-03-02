import { Flex, Stack, Tabs, Text, Title } from "@mantine/core";
import { IconUsers } from "@tabler/icons";
import React from "react";
import { useAppSelector } from "../../redux/store";
import GroupsTab from "./GroupsTab";

const Teams = () => {
  const { activeBoard } = useAppSelector((state) => state.boards);
  return (
    <div className="p-4">
      <Flex justify="space-between" align="center" mb="md">
        <Stack>
          <Title order={2}>Team Management</Title>
          <Text>({activeBoard?.title})</Text>
        </Stack>
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
