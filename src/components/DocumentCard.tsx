import { Card, Flex, Text } from "@mantine/core";
import { IDocument } from "hexa-sdk/dist/app.api";
import React from "react";

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
    <Card shadow="sm" className="cursor-pointer">
      <Flex direction="column">
        <Text>{document?.title}</Text>
        <Text size="sm">{document?.description}</Text>
      </Flex>
    </Card>
  );
};

export default DocumentCard;
