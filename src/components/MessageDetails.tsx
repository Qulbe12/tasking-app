import { useCallback, useEffect, useState } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import {
  IconCornerUpLeft,
  IconCornerUpLeftDouble,
  IconCornerUpRight,
  IconFile,
  IconLink,
  IconPlus,
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
import { IDocumentResponse } from "../interfaces/documents/IDocumentResponse";
import { ISendMessage } from "../interfaces/nylas/ISendMessage";
import { IconPdf } from "@tabler/icons-react";
import { nylasAxios } from "../config/nylasAxios";
import { IFile } from "../interfaces/nylas/IFile";
import AttachFilesInput from "../views/email/components/AttachFilesInput";
import { useTranslation } from "react-i18next";
import DocumentModal from "../modals/DocumentModal";

type MessageDetailsProps = {
  selectedThreadId: string | null;
  onForwardClick?: (e: IMessageResponse) => void;
  selectedMessage?: IMessageResponse | null;
  onDocumentCardClick?: (d: IDocumentResponse) => void;
  justMessages?: boolean;
};

const MessageDetails = ({
  selectedThreadId,
  onForwardClick,
  onDocumentCardClick,
  justMessages,
}: MessageDetailsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { loaders, messages, threads, nylasToken } = useAppSelector((state) => state.nylas);
  const { data: documents, loading: gettingDocuments } = useAppSelector((state) => state.documents);
  const { activeBoard } = useAppSelector((state) => state.boards);

  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [emailContent, setEmailContent] = useState("");
  const [replyType, setReplyType] = useState<"all" | "solo">("solo");

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const [updatedMessages, setUpdatedMessages] = useState<IMessageResponse[]>([]);

  const [uploadedAttachments, setUploadedAttachments] = useState<IFile[]>([]);

  const [linkedDocuments, setLinkedDocuments] = useState<IDocumentResponse[]>([]);

  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showNewDocumentModal, setShowNewDocumentModal] = useState(false);
  const [linking, setLinking] = useState(false);

  useEffect(() => {
    setUpdatedMessages(messages); // Set messages immediately

    const fetchFileAndUpdateMessage = async (file: IFile, messageId: string) => {
      try {
        const res = await nylasAxios.get(`/files/${file.id}/download`, {
          responseType: "arraybuffer",
        });
        const blob = new Blob([res.data], { type: file.content_type });
        const imageUrl = window.URL.createObjectURL(blob);

        setUpdatedMessages((prevMsgs) =>
          prevMsgs.map((message) => {
            if (message.id !== messageId) return message;

            const parser = new DOMParser();
            const doc = parser.parseFromString(message.body, "text/html");
            const imgElements =
              (doc.querySelectorAll(
                `img[src="cid:${file.content_id}"]`,
              ) as unknown as HTMLImageElement[]) ?? [];
            imgElements.forEach((img) => {
              img.src = imageUrl;
            });

            return {
              ...message,
              body: doc.body.innerHTML,
            };
          }),
        );
      } catch (error) {
        console.error(`Error fetching file with ID ${file.id}:`, error);
      }
    };

    messages.forEach((message) => {
      message.files.forEach((file) => {
        fetchFileAndUpdateMessage(file, message.id);
      });
    });
  }, [messages]);

  useEffect(() => {
    setEmailContent("");
    const replyElement = document.getElementById("reply-container");
    replyElement?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessageIds]);

  useEffect(() => {
    if (!selectedThreadId) return setLinkedDocuments([]);
    setLinkedDocuments(documents.filter((d) => d.linkedEmailIds.includes(selectedThreadId)));
  }, [messages, selectedThreadId]);

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
        file_ids: uploadedAttachments.map((a) => a.id),
      }),
    );

    setEmailContent("");
    setSelectedMessageIds([]);
  }, [selectedMessageIds, emailContent, replyType]);

  const handleLinkDocument = useCallback(async () => {
    if (!selectedThreadId) return;
    setLinking(true);
    try {
      await axiosPrivate.post(`/doc-email-links/${selectedThreadId}`, {
        docIds: selectedDocuments,
      });

      setLinkedDocuments(documents.filter((d) => selectedDocuments.includes(d.id)));

      setShowDocumentsModal(false);
      setSelectedDocuments([]);
      setLinking(false);
    } catch (err) {
      const error = err as IErrorResponse;
      showError(error.response?.data.message);
      setLinking(false);
    }
  }, [selectedDocuments, activeBoard, selectedThreadId]);

  const downloadAttachment = async (file: IFile) => {
    const res = await nylasAxios.get(`/files/${file.id}/download`, {
      responseType: "arraybuffer",
    });

    const blob = new Blob([res.data], { type: file.content_type });
    const href = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = file.filename?.split(".")[0] + "." + file.content_type.split("/")[1] ?? "file";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemoveAttachment = (attachment: IFile) => {
    setUploadedAttachments((a) => a.filter((a) => a.id !== attachment.id));
  };

  const TypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "application/pdf":
        return <IconPdf />;

      default:
        return <IconFile />;
    }
  };

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
            updatedMessages.map((m) => {
              return (
                <Card key={m.id}>
                  <Group position="apart">
                    <Text size="lg">
                      {m.from[0].name} {`<${m.from[0].email}>`}
                    </Text>

                    {!justMessages ? (
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
                          <ActionIcon
                            color="indigo"
                            size="sm"
                            onClick={() => onForwardClick && onForwardClick(m)}
                          >
                            <IconCornerUpRight />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    ) : (
                      ""
                    )}
                  </Group>
                  <Text size="sm" opacity={0.7} mb="md">
                    To: {m.to[0].name} {`<${m.to[0].email}>`}
                  </Text>

                  {m.files.length > 0 && (
                    <Group my="md">
                      {m.files.map((f) => {
                        if (f.content_disposition !== "attachment") return;
                        return (
                          <Button
                            key={f.id}
                            onClick={() => downloadAttachment(f as any)}
                            leftIcon={<TypeIcon type={f.content_type} />}
                          >
                            {f.filename}
                          </Button>
                        );
                      })}
                    </Group>
                  )}
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

                      <AttachFilesInput
                        uploadedAttachments={uploadedAttachments}
                        afterUpload={(a) =>
                          setUploadedAttachments((attachments) => [...attachments, a])
                        }
                        handleRemoveAttachment={handleRemoveAttachment}
                      />
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
      {!justMessages && (
        <Card withBorder h="50%">
          <Group align="center" position="apart">
            <Text mb="md">Linked Documents: </Text>

            <Menu>
              <Menu.Target>
                <Button size="xs" leftIcon={<IconLink />}>
                  Link
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<IconFile size="1em" />}
                  onClick={() => setShowDocumentsModal(true)}
                >
                  {t("existingDocument")}
                </Menu.Item>
                <Menu.Item
                  icon={<IconPlus size="1en" />}
                  onClick={() => setShowNewDocumentModal(true)}
                >
                  {" "}
                  {t("createDocument")}
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          <ScrollArea h="100%">
            <SimpleGrid cols={4}>
              {gettingDocuments
                ? Array.from({ length: 6 }).map((e, i) => {
                    return <Skeleton height={180} key={i} />;
                  })
                : linkedDocuments.map((d) => {
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
      )}

      <DocumentModal
        onClose={() => setShowNewDocumentModal(false)}
        opened={showNewDocumentModal}
        title={t("createDocument")}
        selectedEmailId={selectedThreadId}
        onAfterCreate={(document) => {
          setLinkedDocuments((docs) => [...docs, document]);
        }}
      />

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
        onOk={handleLinkDocument}
      />
    </Stack>
  );
};

export default MessageDetails;
