import { ActionIcon, Card, Flex, Menu, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useState } from "react";
import { IThreadExpandedResponse } from "../interfaces/nylas/IThreadResponse";
import { useAppSelector } from "../redux/store";
import { IconDotsVertical, IconFolder, IconTrash } from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import FoldersListModal from "../modals/FoldersListModal";
import { getThreadSender } from "../utils/getThreadSender";

type ThreadCardProps = {
  thread: IThreadExpandedResponse;
  onClick: (t: IThreadExpandedResponse) => void;
  selectedThreadId?: string | null;
  hideMenu?: boolean;
};

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onClick, selectedThreadId, hideMenu }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [threadId, setThreadId] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Card
      withBorder
      my="md"
      className="cursor-pointer"
      key={thread.id}
      onClick={() => {
        onClick(thread);
        setThreadId(thread.id);
      }}
    >
      <Flex direction="column">
        <Flex justify="space-between">
          <Text>
            {getThreadSender(thread, user?.user.email ?? "").name ??
              getThreadSender(thread, user?.user.email ?? "").email}
          </Text>
          {!hideMenu && (
            <Menu shadow="md" width={160} withinPortal>
              <Menu.Target>
                <ActionIcon
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <IconDotsVertical size="1em" />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    setThreadId(thread.id);
                    open();
                  }}
                  icon={<IconFolder size="1em" />}
                >
                  Move to folder
                </Menu.Item>
                <Menu.Item
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    setThreadId(thread.id);
                  }}
                  icon={<IconTrash size="1em" />}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Flex>
        <Flex
          onClick={() => {
            setThreadId(thread.id);
            onClick(thread);
          }}
          align="center"
          justify="space-between"
        >
          <Text lineClamp={1} size="sm">
            {thread.subject}
          </Text>
          <Text size="xs">{dayjs(thread.last_message_timestamp * 1000).format("D/MM/YY")}</Text>
        </Flex>

        <Text
          onClick={() => {
            onClick(thread);
            setThreadId(thread.id);
          }}
          size="sm"
          opacity={0.7}
          lineClamp={1}
        >
          {thread.snippet}
        </Text>
      </Flex>
      <FoldersListModal selectedThreadId={threadId} onClose={close} opened={opened} />
    </Card>
  );
};

export default ThreadCard;
