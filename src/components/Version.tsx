import React from "react";
import pJson from "../../package.json";
import { IconCircleDot } from "@tabler/icons";
import { Group } from "@mantine/core";

const Version = ({ connected }: { connected: boolean }) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 5,
        right: 5,
      }}
    >
      <Group>
        {pJson.version} <IconCircleDot size="1em" color={connected ? "green" : "red"} />
      </Group>
    </div>
  );
};

export default Version;
