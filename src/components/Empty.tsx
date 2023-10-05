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
        <IconFolder style={{ marginLeft: "20px", marginTop: "10px" }} size="50px" />
        <Text>{label}</Text>
      </Stack>
    </Center>
  );
};

export default Empty;
