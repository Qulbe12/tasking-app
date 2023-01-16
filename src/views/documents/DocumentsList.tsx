import { Button, Flex, Title } from "@mantine/core";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const DocumentsList = () => {
  const [open, setOpen] = useState(false);

  const dispatch = useAppDispatch();

  const templates = useAppSelector((state) => state.templates);

  function toggleOpen() {
    setOpen((o) => !o);
  }

  return (
    <div className="p-4">
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Documents</Title>
        <Button onClick={toggleOpen}>Add Document</Button>
      </Flex>
    </div>
  );
};

export default DocumentsList;
