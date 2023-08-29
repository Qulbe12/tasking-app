import { ActionIcon, Avatar, Badge, Card, Divider, Flex, Text, Tooltip } from "@mantine/core";
import { IconClock, IconPaperclip, IconUnlink } from "@tabler/icons";
import dayjs from "dayjs";
import { DocumentStatus } from "hexa-sdk/dist/app.api";
import React from "react";
import { generateDocumentColor } from "../utils/generateDocumentColor";
import { IDocumentResponse } from "../interfaces/documents/IDocumentResponse";

type DocumentCardProps = {
  addCard?: boolean;
  document?: IDocumentResponse;
  onClick?: () => void;
  selected?: string;
  linkedView?: boolean;
  onUnlinkIconClick?: () => void;
};

const DocumentCard = ({
  addCard,
  document,
  onClick,
  selected,
  linkedView,
  onUnlinkIconClick,
}: DocumentCardProps) => {
  if (addCard) {
    return (
      <Card shadow="sm" withBorder className="cursor-pointer">
        Add Card
      </Card>
    );
  }

  return (
    <Card
      onClick={onClick}
      withBorder={selected !== document?.id}
      shadow="sm"
      style={{
        border: selected === document?.id ? "1px solid cyan" : undefined,
      }}
      className="cursor-pointer"
    >
      <Flex align="center" justify="space-between">
        <Flex gap="md">
          {linkedView && (
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
          )}
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
          {document?.attachments.length ? (
            <Tooltip label="Has attachments">
              <div>
                <IconPaperclip size="1.2em" />
              </div>
            </Tooltip>
          ) : (
            ""
          )}
          <Tooltip label="Due Date">
            <div>
              <IconClock size="1.2em" />
            </div>
          </Tooltip>
          <Text>{dayjs(document?.dueDate).format("MMM DD")}</Text>
        </Flex>

        <Avatar radius="xl" />
      </Flex>
    </Card>
  );
};

export default DocumentCard;
