import { Box, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { IThreadResponse } from "../interfaces/nylas/IThreadResponse";
import { useAppSelector } from "../redux/store";

type ThreadCardProps = {
  thread: IThreadResponse;
  onClick: (t: IThreadResponse) => void;
  selectedThreadId?: string | null;
};

const ThreadCard = ({ thread, onClick, selectedThreadId }: ThreadCardProps) => {
  const { contacts } = useAppSelector((state) => state.nylas);

  const fullName = useMemo(() => {
    if (thread.participants.length <= 0) return "";
    const foundContact = contacts.find((c) => c.emails[0].email === thread.participants[0].email);

    if (!foundContact) return thread.participants[0].email;

    return `${foundContact.given_name} ${foundContact.surname}`;
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
        onClick={() => onClick(thread)}
      >
        <Flex justify="space-between">
          <Text>{fullName}</Text>
        </Flex>
        <Flex align="center" justify="space-between">
          <Text lineClamp={1} size="sm">
            {thread.subject}
          </Text>
          <Text size="xs">{dayjs(thread.last_message_timestamp * 1000).format("D/MM/YY")}</Text>
        </Flex>

        <Text size="sm" opacity={0.7} lineClamp={1}>
          {thread.snippet}
        </Text>
      </Flex>
    </Box>
  );
};

export default ThreadCard;
