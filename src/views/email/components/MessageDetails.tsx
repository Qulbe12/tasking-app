import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  Card,
  Skeleton,
  ScrollArea,
  Group,
  Tooltip,
  ActionIcon,
  Text,
  Button,
} from "@mantine/core";
import { IconCornerUpLeft, IconCornerUpRight, IconSend, IconTrash } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import CustomTextEditor from "../../../components/CustomTextEditor";
import { sendMessage } from "../../../redux/api/nylasApi";
import { IMessageResponse } from "../../../interfaces/nylas/IMessageResponse";

type MessageDetailsProps = {
  selectedThreadId: string | null;
  onForwardClick: (e: IMessageResponse) => void;
};

const MessageDetails = ({ selectedThreadId, onForwardClick }: MessageDetailsProps) => {
  const dispatch = useAppDispatch();
  const { loaders, messages } = useAppSelector((state) => state.nylas);

  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState("");

  useEffect(() => {
    setEmailContent("");
  }, [selectedMessageIds]);

  const handleReply = useCallback(async () => {
    if (selectedMessageIds.length <= 0) return;

    await dispatch(
      sendMessage({
        reply_to_message_id: selectedMessageIds[0],
        body: emailContent,
        to: [
          {
            name: messages.find((m) => m.id === selectedMessageIds[0])?.from[0].name || "",
            email: messages.find((m) => m.id === selectedMessageIds[0])?.from[0].email || "",
          },
        ],
        reply_to: [
          {
            name: messages.find((m) => m.id === selectedMessageIds[0])?.from[0].name || "",
            email: messages.find((m) => m.id === selectedMessageIds[0])?.from[0].email || "",
          },
        ],
      }),
    );

    setEmailContent("");
    setSelectedMessageIds([]);
  }, [selectedMessageIds, emailContent]);

  return (
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

        <ScrollArea h="100%" offsetScrollbars>
          <Stack>
            {selectedThreadId &&
              !loaders.gettingMessages &&
              messages.map((m) => {
                return (
                  <Card withBorder key={m.id}>
                    <Group position="apart">
                      <Text size="lg">
                        {m.from[0].name} {`<${m.from[0].email}>`}
                      </Text>

                      <Group position="right">
                        <Tooltip label="Reply">
                          <ActionIcon
                            color="indigo"
                            size="sm"
                            onClick={() => setSelectedMessageIds([m.id])}
                          >
                            <IconCornerUpLeft />
                          </ActionIcon>
                        </Tooltip>
                        {/* <Tooltip label="Reply All">
                          <ActionIcon
                            color="indigo"
                            size="sm"
                            onClick={() => setSelectedMessageIds([...messages.map((m) => m.id)])}
                          >
                            <IconCornerUpLeftDouble />
                          </ActionIcon>
                        </Tooltip> */}
                        <Tooltip label="Forward">
                          <ActionIcon color="indigo" size="sm" onClick={() => onForwardClick(m)}>
                            <IconCornerUpRight />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Group>
                    <Text size="sm" opacity={0.7} mb="md">
                      To: {m.to[0].name} {`<${m.to[0].email}>`}
                    </Text>
                    <div dangerouslySetInnerHTML={{ __html: m.body }} className="" style={{}}></div>

                    {selectedMessageIds.length === 1 && selectedMessageIds.includes(m.id) && (
                      <Stack my="md">
                        <CustomTextEditor content={emailContent} onUpdate={setEmailContent} />
                        <Group position="right">
                          <Button
                            loading={loaders.sendingMessage}
                            color="red"
                            size="xs"
                            leftIcon={<IconTrash />}
                            onClick={() => setSelectedMessageIds([])}
                          >
                            Discard
                          </Button>
                          <Button
                            loading={loaders.sendingMessage}
                            size="xs"
                            leftIcon={<IconSend />}
                            onClick={handleReply}
                          >
                            Reply
                          </Button>
                        </Group>
                      </Stack>
                    )}
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
  );
};

export default MessageDetails;
