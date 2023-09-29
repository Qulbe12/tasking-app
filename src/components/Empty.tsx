import { Center, Stack, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons";
import React from "react";

type EmptyProps = {
  label: string;
};

const Empty: React.FC<EmptyProps> = ({ label }) => {
  return (
    <Center>
      <Stack>
        <IconFolder size="xs" />
        <Text>{label}</Text>
      </Stack>
    </Center>
  );
};

export default Empty;
