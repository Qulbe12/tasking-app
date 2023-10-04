import React from "react";
import { ActionIcon, Avatar, Badge, Card, Divider, Flex, Text, Tooltip } from "@mantine/core";
import { IconClock, IconPaperclip, IconUnlink } from "@tabler/icons";
import dayjs from "dayjs";
import { DocumentStatus } from "hexa-sdk/dist/app.api";
import { generateDocumentColor } from "../utils/generateDocumentColor";
import { IDocumentResponse } from "../interfaces/documents/IDocumentResponse";
import PDFPreview from "./PDFPreview";

type DocumentCardProps = {
  addCard?: boolean;
  document?: IDocumentResponse;
  onClick?: () => void;
  selected?: string;
  linkedView?: boolean;
  onUnlinkIconClick?: () => void;
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onClick,
  selected,
  linkedView,
  onUnlinkIconClick,
}) => {
  const documentId = document?.id;

  const renderUnlinkIcon = () => (
    <Tooltip label="Unlink Document">
      <ActionIcon
        color="red"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onUnlinkIconClick && onUnlinkIconClick();
        }}
      >
        <IconUnlink />
      </ActionIcon>
    </Tooltip>
  );

  const renderAttachmentsIcon = () =>
    document?.attachments.length ? (
      <Tooltip label="Has attachments">
        <div>
          <IconPaperclip size="1.2em" />
        </div>
      </Tooltip>
    ) : null;

  const renderDueDate = () => (
    <Tooltip label="Due Date">
      <div>
        <IconClock size="1.2em" />
      </div>
    </Tooltip>
  );

  return (
    <Card
      w="100%"
      mb="md"
      onClick={onClick}
      withBorder={selected !== documentId}
      shadow="sm"
      className="cursor-pointer"
      style={{
        border: selected === documentId ? "1px solid cyan" : undefined,
      }}
    >
      {document && document.attachments.length > 0 && (
        <PDFPreview url={document.attachments[0].url} />
      )}
      <Flex
        mt={document && document.attachments.length > 0 ? "md" : undefined}
        align="center"
        justify="space-between"
      >
        <Flex gap="md">
          {linkedView && renderUnlinkIcon()}
          <Text weight="bold">{document?.title}</Text>
        </Flex>
      </Flex>
      <Flex gap="sm" mt="sm">
        <Badge size="sm" color={generateDocumentColor(document?.template.name)} mb="sm">
          {document?.template.name}
        </Badge>
        <Badge
          size="xs"
          color={
            document?.status === DocumentStatus.Todo
              ? "yellow"
              : document?.status === DocumentStatus.InProgresss
              ? "grape"
              : "green"
          }
        >
          {document?.status}
        </Badge>
      </Flex>
      <Text size="sm" lineClamp={2}>
        {document?.description}
      </Text>
      <Divider my="sm" />

      <Flex align="center" justify="space-between">
        <Flex gap="md" align={"center"}>
          {renderAttachmentsIcon()}
          {renderDueDate()}
          <Text>{dayjs(document?.dueDate).format("MMM DD")}</Text>
        </Flex>

        <Avatar radius="xl" />
      </Flex>
    </Card>
  );
};

export default DocumentCard;
