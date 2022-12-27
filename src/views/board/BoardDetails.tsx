import { Title } from "@mantine/core";
import React from "react";
import Filter from "../../components/Filter";

const opts = [
  "Hello",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Hello",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Hello",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
  "Test",
];
const BoardDetails = () => {
  return (
    <div>
      <Title order={3}>Test 123</Title>
      <Filter options={opts} />
      <Filter options={opts} />
      <Filter options={opts} />
      <Filter options={opts} />
    </div>
  );
};

export default BoardDetails;
