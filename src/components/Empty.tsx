import { Center, Flex, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons";
import React from "react";

type EmptyProps = {
  label: string;
};

const Empty: React.FC<EmptyProps> = ({ label }) => {
  return (
    <Center>
      <Flex direction="column">
        <IconFolder size="xl" />
        <Text>{label}</Text>
      </Flex>
    </Center>
  );
};

export default Empty;
