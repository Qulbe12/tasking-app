import { Badge, Card, Flex, Text } from "@mantine/core";
import { IDocument } from "hexa-sdk/dist/app.api";
import React from "react";
import { generateDocumentColor } from "../utils/generateDocumentColor";

type DocumentCardProps = {
  addCard?: boolean;
  document?: IDocument;
};

const DocumentCard = ({ addCard, document }: DocumentCardProps) => {
  if (addCard) {
    return (
      <Card shadow="sm" withBorder className="cursor-pointer">
        Add Card
      </Card>
    );
  }

  return (
    <Card
      shadow="sm"
      className="cursor-pointer relative"
      style={{
        minWidth: "300px",
      }}
    >
      <Badge color={generateDocumentColor(document?.template.name)} mb="sm">
        {document?.template.name}
      </Badge>
      <Flex direction="column">
        <Text>{document?.title}</Text>
        <Text size="sm">{document?.description}</Text>
      </Flex>
    </Card>
  );
};

export default DocumentCard;
