import { useEffect, useState } from "react";
import {
  Divider,
  Button,
  Affix,
  Skeleton,
  Badge,
  DefaultMantineColor,
  Group,
  Grid,
  Stack,
  Card,
  Text,
  Flex,
  ScrollArea,
} from "@mantine/core";

import EmailModal from "../../modals/EmailModal";
import { IconCalendar } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getAllMessages, getAllThreads } from "../../redux/api/nylasApi";
import dayjs from "dayjs";
import { IThreadExpandedResponse, IThreadResponse } from "../../interfaces/nylas/IThreadResponse";

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

type EmailListProps = {
  filter?: string[];
  onActionButtonClick: () => void;
};

const EmailList = ({ onActionButtonClick }: EmailListProps) => {
  const dispatch = useAppDispatch();
  const { loaders, threads, messages } = useAppSelector((state) => state.nylas);
  const [opened, setOpened] = useState(false);

  const [type, setType] = useState("folder");

  useEffect(() => {
    switch (type) {
      case "folder":
        dispatch(getAllThreads({ view: "expanded", limit: 1000 }));
        break;
      case "inbox":
        dispatch(getAllThreads({ view: "expanded", in: "Inbox", limit: 1000 }));
        break;

      case "sent":
        dispatch(getAllThreads({ view: "expanded", in: "Sent", limit: 1000 }));
        break;
      case "spam":
        dispatch(getAllThreads({ view: "expanded", in: "Spam", limit: 1000 }));
        break;
      case "trash":
        dispatch(getAllThreads({ view: "expanded", in: "Trash", limit: 1000 }));
        break;

      default:
        break;
    }
  }, [type]);

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedThreadId) return;

    dispatch(getAllMessages({ thread_id: selectedThreadId }));
  }, [selectedThreadId]);

  return (
    <div>
      <Group position="apart" my="md">
        <Group>
          <Badge
            variant={type === "folder" ? "filled" : "outline"}
            onClick={() => setType("folder")}
            style={{ cursor: "pointer" }}
          >
            Folder
          </Badge>

          <Divider orientation="vertical" />

          <Badge
            variant={type === "pending" ? "filled" : "outline"}
            onClick={() => setType("pending")}
            style={{ cursor: "pointer" }}
          >
            Pending
          </Badge>
          <Badge
            variant={type === "done" ? "filled" : "outline"}
            onClick={() => setType("done")}
            style={{ cursor: "pointer" }}
          >
            Done
          </Badge>
          <Badge
            variant={type === "all" ? "filled" : "outline"}
            onClick={() => setType("all")}
            style={{ cursor: "pointer" }}
          >
            All
          </Badge>

          <Divider orientation="vertical" />

          <Badge
            variant={type === "inbox" ? "filled" : "outline"}
            onClick={() => setType("inbox")}
            style={{ cursor: "pointer" }}
          >
            Inbox
          </Badge>
          <Badge
            variant={type === "sent" ? "filled" : "outline"}
            onClick={() => setType("sent")}
            style={{ cursor: "pointer" }}
          >
            Sent
          </Badge>
          <Badge
            variant={type === "spam" ? "filled" : "outline"}
            onClick={() => setType("spam")}
            style={{ cursor: "pointer" }}
          >
            Spam
          </Badge>
          <Badge
            variant={type === "trash" ? "filled" : "outline"}
            onClick={() => setType("trash")}
            style={{ cursor: "pointer" }}
          >
            Trash
          </Badge>
        </Group>
        <Button onClick={onActionButtonClick} leftIcon={<IconCalendar />}>
          Calendar
        </Button>
      </Group>

      <Grid h="87vh">
        <Grid.Col span={2} h="100%">
          <Card withBorder shadow="sm" h="100%">
            <ScrollArea h="100%" offsetScrollbars>
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
                    <Flex
                      key={t.id}
                      direction="column"
                      my="sm"
                      p="sm"
                      className={`cursor-pointer rounded-sm border ${
                        selectedThreadId === t.id && "border-l-2 border-l-blue-500 box-border"
                      }`}
                      onClick={() => setSelectedThreadId(t.id)}
                    >
                      <Flex justify="space-between">
                        <Text>{t.participants[0].name || t.participants[0].email}</Text>
                        <FolderBadge email={t} />
                      </Flex>
                      <Flex align="center" justify="space-between">
                        <Text lineClamp={1} size="sm">
                          {t.subject}
                        </Text>
                        <Text size="xs">
                          {dayjs(t.last_message_timestamp * 1000).format("D/MM/YY")}
                        </Text>
                      </Flex>

                      <Text size="sm" opacity={0.7} lineClamp={1}>
                        {t.snippet}
                      </Text>
                    </Flex>
                  );
                })}
            </ScrollArea>
          </Card>
        </Grid.Col>
        <Grid.Col span={10} h="100%">
          <Stack h="100%">
            <Card className="p-0" h="100%">
              {loaders.gettingMessages && !!selectedThreadId && (
                <Stack>
                  <Skeleton h={20} w={400} />
                  <Skeleton h={20} w={400} />
                  <Skeleton h={200} />
                </Stack>
              )}

              {!selectedThreadId && <Text>Please Select an Email</Text>}

              <ScrollArea h="100%">
                <Stack>
                  {selectedThreadId &&
                    !loaders.gettingMessages &&
                    messages.map((m) => {
                      return (
                        <Card withBorder key={m.id} bg="#fff">
                          <div dangerouslySetInnerHTML={{ __html: m.body }}></div>
                        </Card>
                      );
                    })}
                </Stack>
              </ScrollArea>
            </Card>
            <Card bg="green" h="50%">
              Links
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Button variant="filled" radius="xl" size="md" uppercase onClick={() => setOpened(true)}>
          Compose
        </Button>
      </Affix>
      <EmailModal opened={opened} onClose={() => setOpened((o) => !o)} />
      {/* <EmailDetailsModal
        emails={threadEmails}
        opened={!!threadEmails}
        onClose={() => setThreadEmails(null)}
      /> */}
    </div>
  );
};

export default EmailList;
