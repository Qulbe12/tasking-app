import { ActionIcon, Box, Flex, Menu, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useMemo, useState } from "react";
import { IThreadResponse } from "../interfaces/nylas/IThreadResponse";
import { useAppSelector } from "../redux/store";
import { IconDots, IconFolder, IconTrash } from "@tabler/icons";
import { useDisclosure } from "@mantine/hooks";
import FoldersListModal from "../modals/FoldersListModal";

type ThreadCardProps = {
  thread: IThreadResponse;
  onClick: (t: IThreadResponse) => void;
  selectedThreadId?: string | null;
};

const ThreadCard: React.FC<ThreadCardProps> = ({ thread, onClick, selectedThreadId }) => {
  const { contacts } = useAppSelector((state) => state.nylas);
  const [threadId, setThreadId] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

  const fullName = useMemo(() => {
    const participant = thread.participants[0];
    if (!participant) return "";

    const foundContact = contacts.find((c) => c.email === participant.email);
    return foundContact ? foundContact.name : participant.email;
  }, [thread, contacts]);

  return (
    <Box key={thread.id}>
      <Flex
        direction="column"
        my="sm"
        py="sm"
        style={{
          boxSizing: "border-box",
          paddingLeft: "4px",
          paddingRight: "4px",
        }}
        className={`cursor-pointer rounded-sm border ${
          selectedThreadId === thread.id && "border-l-2 border-l-blue-500 box-border"
        }`}
      >
        <Flex justify="space-between">
          <Text
            onClick={() => {
              onClick(thread);
              setThreadId(thread.id);
            }}
          >
            {fullName}
          </Text>
          <Menu shadow="md" width={160}>
            <Menu.Target>
              <ActionIcon>
                <IconDots size={48} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="white"
                onClick={() => {
                  setThreadId(thread.id);
                  open();
                }}
                icon={<IconFolder />}
              >
                Move to folder
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={() => {
                  setThreadId(thread.id);
                }}
                icon={<IconTrash />}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
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
    </Box>
  );
};

export default ThreadCard;
