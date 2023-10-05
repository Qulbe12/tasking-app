import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  SimpleGrid,
} from "@mantine/core";
import {
  IconCornerUpLeft,
  IconCornerUpLeftDouble,
  IconCornerUpRight,
  IconLink,
  IconSend,
  IconTrash,
} from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../redux/store";
import CustomTextEditor from "./CustomTextEditor";
import { sendMessage } from "../redux/api/nylasApi";
import { IMessageResponse } from "../interfaces/nylas/IMessageResponse";
import DocumentCard from "./DocumentCard";
import DocumentsListModal from "../modals/DocumentsListModal";
import { axiosPrivate } from "../config/axios";
import { showError } from "../redux/commonSliceFunctions";
import { IErrorResponse } from "../interfaces/IErrorResponse";
import { getDocuments } from "../redux/api/documentApi";
import { IDocumentResponse } from "../interfaces/documents/IDocumentResponse";
import { ISendMessage } from "../interfaces/nylas/ISendMessage";

type MessageDetailsProps = {
  selectedThreadId: string | null;
  onForwardClick: (e: IMessageResponse) => void;
  selectedMessage?: IMessageResponse | null;
  onDocumentCardClick?: (d: IDocumentResponse) => void;
};

const MessageDetails = ({
  selectedThreadId,
  onForwardClick,
  onDocumentCardClick,
}: MessageDetailsProps) => {
  const dispatch = useAppDispatch();
  const { loaders, messages, threads, nylasToken } = useAppSelector((state) => state.nylas);
  const { data: documents } = useAppSelector((state) => state.documents);
  const { activeBoard } = useAppSelector((state) => state.boards);

  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState("");
  const [replyType, setReplyType] = useState<"all" | "solo">("solo");

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  useEffect(() => {
    setEmailContent("");

    const replyElement = document.getElementById("reply-container");
    replyElement?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessageIds]);

  const handleReply = useCallback(async () => {
    if (selectedMessageIds.length <= 0) return;

    const to: ISendMessage["to"] = [
      {
        name: messages.find((m) => m.id === selectedMessageIds[0])?.from[0].name || "",
        email: messages.find((m) => m.id === selectedMessageIds[0])?.from[0].email || "",
      },
    ];

    let cc: ISendMessage["to"] | undefined = [];

    if (replyType === "all") {
      const foundThread = threads.find((t) => t.id === selectedThreadId);
      if (!foundThread) return;
      foundThread.participants.forEach((p) => {
        if (p.email === nylasToken?.email_address) return;
        cc?.push(p);
      });
    } else {
      cc = undefined;
    }

    await dispatch(
      sendMessage({
        reply_to_message_id: selectedMessageIds[0],
        body: emailContent,
        to: to,
        reply_to: to,
        cc: cc,
      }),
    );

    setEmailContent("");
    setSelectedMessageIds([]);
  }, [selectedMessageIds, emailContent, replyType]);

  const linkedDocuments = useMemo(() => {
    if (!selectedThreadId) return [];
    return documents.filter((d) => d.linkedEmailIds.includes(selectedThreadId));
  }, [messages, selectedThreadId]);

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [linking, setLinking] = useState(false);

  return (
    <Stack h="100%">
      <Card withBorder className="p-0" h="100%" component={ScrollArea}>
        {loaders.gettingMessages && !!selectedThreadId && (
          <Stack>
            <Skeleton h={20} w={400} />
            <Skeleton h={20} w={400} />
            <Skeleton h={200} />
          </Stack>
        )}

        {!selectedThreadId && <Text>Please Select an Email</Text>}

        <Stack>
          {selectedThreadId &&
            !loaders.gettingMessages &&
            messages.map((m) => {
              return (
                <Card key={m.id}>
                  <Group position="apart">
                    <Text size="lg">
                      {m.from[0].name} {`<${m.from[0].email}>`}
                    </Text>

                    <Group position="right">
                      <Tooltip label="Reply">
                        <ActionIcon
                          color="indigo"
                          size="sm"
                          onClick={() => {
                            setReplyType("solo");
                            setSelectedMessageIds([m.id]);
                          }}
                        >
                          <IconCornerUpLeft />
                        </ActionIcon>
                      </Tooltip>

                      <Tooltip label="Reply All">
                        <ActionIcon
                          color="indigo"
                          size="sm"
                          onClick={() => {
                            setReplyType("all");
                            setSelectedMessageIds([m.id]);
                          }}
                        >
                          <IconCornerUpLeftDouble />
                        </ActionIcon>
                      </Tooltip>

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
                  <iframe
                    srcDoc={m.body}
                    width="100%"
                    height="500px"
                    title={`email-${m.id}`}
                    style={{ borderRadius: "5px" }}
                  ></iframe>

                  {selectedMessageIds.length === 1 && selectedMessageIds.includes(m.id) && (
                    <Stack my="md" id="reply-container">
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
      </Card>
      <Card withBorder h="50%">
        <Group align="center" position="apart">
          <Text mb="md">Linked Documents: </Text>
          <Button size="xs" leftIcon={<IconLink />} onClick={() => setShowDocumentsModal(true)}>
            Link
          </Button>
        </Group>
        <ScrollArea h="100%">
          <SimpleGrid cols={4}>
            {linkedDocuments.map((d) => {
              return (
                <DocumentCard
                  key={d.id}
                  document={d}
                  onClick={() => onDocumentCardClick && onDocumentCardClick(d)}
                />
              );
            })}
          </SimpleGrid>
        </ScrollArea>
      </Card>

      <DocumentsListModal
        onClose={() => {
          setShowDocumentsModal(false);
          setSelectedDocuments([]);
        }}
        opened={showDocumentsModal}
        onDocumentClick={(d) => {
          if (selectedDocuments.includes(d.id)) {
            const fDocs = [...selectedDocuments];
            const foundIndex = fDocs.findIndex((fd) => fd === d.id);
            fDocs.splice(foundIndex, 1);
            setSelectedDocuments(fDocs);
          } else {
            setSelectedDocuments((document) => [...document, d.id]);
          }
        }}
        okText="Link Document"
        selectedDocuments={selectedDocuments}
        loading={linking}
        onOk={async () => {
          if (!selectedThreadId) return;
          setLinking(true);
          try {
            await axiosPrivate.post(`/doc-email-links/${selectedThreadId}`, {
              docIds: selectedDocuments,
            });

            setShowDocumentsModal(false);
            setSelectedDocuments([]);
            setLinking(false);
            if (activeBoard) {
              dispatch(
                getDocuments({ boardId: activeBoard.id, query: { emailId: selectedThreadId } }),
              );
            }
          } catch (err) {
            const error = err as IErrorResponse;
            showError(error.response?.data.message);
            setLinking(false);
          }
        }}
      />
    </Stack>
  );
};

export default MessageDetails;
