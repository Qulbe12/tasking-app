import { Badge, Card, Divider, Flex, Group, Image, Stack, Text } from "@mantine/core";
import { ISheetResponse } from "../interfaces/sheets/ISheetResponse";
import { IconClock } from "@tabler/icons";
import dayjs from "dayjs";

type DocumentCardProps = {
  addCard?: boolean;
  sheet?: ISheetResponse;
  onClick?: () => void;
  selected?: string;
};

const SheetCard = ({ addCard, sheet, onClick, selected }: DocumentCardProps) => {
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
      <Flex gap="md">
        {sheet?.thumbnail && <Image src={sheet.thumbnail} width="100px" alt="" />}
        <Stack>
          <Flex align="center" gap="sm">
            <Text weight="bold">{sheet?.title}</Text>
            <Text size="sm">(v{sheet?.latestVersion.version})</Text>
          </Flex>
          <Flex align="center" gap="xs">
            <IconClock size="1em" />
            <Text size="sm">{dayjs(sheet?.startDate).format("MM/DD/YY")}</Text>
          </Flex>
          <Text size="sm" lineClamp={2}>
            {sheet?.description}
          </Text>
        </Stack>
      </Flex>
      <Divider my="md" />
      <Group>
        {sheet?.tags.map((t, i) => {
          return <Badge key={t + i + "tags"}>{t}</Badge>;
        })}
      </Group>
    </Card>
  );
};

export default SheetCard;
