import { Badge, Box, DefaultMantineColor, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { IThreadExpandedResponse, IThreadResponse } from "../interfaces/nylas/IThreadResponse";

type ThreadCardProps = {
  thread: IThreadResponse;
  onClick: (t: IThreadResponse) => void;
  selectedThreadId?: string | null;
};

function FolderBadge({ email }: { email: IThreadExpandedResponse | IThreadResponse }) {
  let color: DefaultMantineColor = "blue";
  const folderName = email.folders[0].name;

  if (folderName === "sent") {
    color = "green";
  }

  switch (folderName) {
    case "inbox":
      color = "blue";
      break;
    case "trash":
      color = "red";
      break;
    case "permanent_trash":
      color = "red";
      break;
    case "sent":
      color = "green";
      break;
    default:
      color = "blue";
      break;
  }

  return <Badge color={color}>{folderName}</Badge>;
}

const ThreadCard = ({ thread, onClick, selectedThreadId }: ThreadCardProps) => {
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
          <Text>{thread.participants[0].name || thread.participants[0].email}</Text>
          <FolderBadge email={thread} />
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
