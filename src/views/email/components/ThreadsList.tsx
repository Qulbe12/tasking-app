import {
  Badge,
  Box,
  Card,
  DefaultMantineColor,
  Flex,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
} from "@mantine/core";
import React from "react";
import { useAppSelector } from "../../../redux/store";
import {
  IThreadExpandedResponse,
  IThreadResponse,
} from "../../../interfaces/nylas/IThreadResponse";
import dayjs from "dayjs";

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

type ThreadsListProps = {
  onThreadClick: (thread: IThreadExpandedResponse | IThreadResponse) => void;
  selectedThreadId: string | null;
};

const ThreadsList = ({ onThreadClick, selectedThreadId }: ThreadsListProps) => {
  const { loaders, threads } = useAppSelector((state) => state.nylas);

  return (
    <Card withBorder shadow="sm" h="100%" component={ScrollArea}>
      <Stack>
        {loaders.gettingThreads &&
          Array(50)
            .fill(0)
            .map((a, i) => {
              return <Skeleton key={i} height={100} radius="sm" />;
            })}
      </Stack>
      {!loaders.gettingThreads &&
        threads?.map((t) => {
          if (t.participants.length <= 0) return;
          return (
            <Box key={t.id}>
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
                  selectedThreadId === t.id && "border-l-2 border-l-blue-500 box-border"
                }`}
                onClick={() => onThreadClick(t)}
              >
                <Flex justify="space-between">
                  <Text>{t.participants[0].name || t.participants[0].email}</Text>
                  <FolderBadge email={t} />
                </Flex>
                <Flex align="center" justify="space-between">
                  <Text lineClamp={1} size="sm">
                    {t.subject}
                  </Text>
                  <Text size="xs">{dayjs(t.last_message_timestamp * 1000).format("D/MM/YY")}</Text>
                </Flex>

                <Text size="sm" opacity={0.7} lineClamp={1}>
                  {t.snippet}
                </Text>
              </Flex>
            </Box>
          );
        })}
    </Card>
  );
};

export default ThreadsList;
