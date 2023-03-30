import { Avatar, Badge, Card, Divider, Flex, Text } from "@mantine/core";
import { IconClock, IconPaperclip } from "@tabler/icons";
import dayjs from "dayjs";
import { IDocument } from "hexa-sdk/dist/app.api";
import React from "react";
import { generateDocumentColor } from "../utils/generateDocumentColor";

type DocumentCardProps = {
  addCard?: boolean;
  document?: IDocument;
  onClick?: () => void;
};

const DocumentCard = ({ addCard, document, onClick }: DocumentCardProps) => {
  if (addCard) {
    return (
      <Card shadow="sm" withBorder className="cursor-pointer">
        Add Card
      </Card>
    );
  }

  return (
    <Card onClick={onClick} withBorder shadow="sm" className="cursor-pointer relative">
      {/* <Badge color={generateDocumentColor(document?.template.name)} mb="sm">
        {document?.template.name}
      </Badge>
      <Flex direction="column">
        <Text>{document?.title}</Text>
        <Text size="sm">{document?.description}</Text>
      </Flex> */}

      <Flex align="center" justify="space-between">
        <Text weight="bold">{document?.title}</Text>
        <Badge size="sm" color={generateDocumentColor(document?.template.name)} mb="sm">
          {document?.template.name}
        </Badge>
      </Flex>
      <Text size="sm" lineClamp={2}>
        {document?.description}
      </Text>
      <Divider my="sm" />
      <Flex align="center" justify="space-between">
        <Flex gap="md" align={"center"}>
          {document?.attachments.length ? <IconPaperclip size="1.2em" /> : ""}
          <IconClock size="1.2em" />
          <Text>{dayjs(document?.dueDate).format("MMM DD")}</Text>
        </Flex>
        <Avatar radius="xl" />
      </Flex>
    </Card>
  );
};

export default DocumentCard;
