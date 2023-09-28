import { ActionIcon, Avatar, Badge, Card, Divider, Flex, Text } from "@mantine/core";
import { IconUnlink } from "@tabler/icons";
import { DocumentStatus } from "hexa-sdk/dist/app.api";
import React from "react";
import { ISheetResponse } from "../interfaces/sheets/ISheetResponse";

type DocumentCardProps = {
  addCard?: boolean;
  sheet?: ISheetResponse;
  onClick?: () => void;
  selected?: string;
  linkedView?: boolean;
  onUnlinkIconClick?: () => void;
};

const SheetCard = ({
  addCard,
  sheet,
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
      w="100%"
      onClick={onClick}
      withBorder={selected !== sheet?.id}
      shadow="sm"
      style={{
        border: selected === sheet?.id ? "1px solid cyan" : undefined,
      }}
      className="cursor-pointer"
    >
      <Flex align="center" justify="space-between">
        <Flex gap="md">
          {linkedView && (
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
          )}
          <Text weight="bold">{sheet?.title}</Text>
        </Flex>
      </Flex>
      <Text size="sm" lineClamp={2}>
        {sheet?.description}
      </Text>
      <Divider my="sm" />
      <Flex align="center" justify="space-between">
        <Badge
          size="xs"
          color={
            sheet?.status === DocumentStatus.Todo
              ? "yellow"
              : sheet?.status === DocumentStatus.InProgresss
              ? "grape"
              : "green"
          }
        >
          {sheet?.status}
        </Badge>
        <Avatar radius="xl" />
      </Flex>
    </Card>
  );
};

export default SheetCard;
