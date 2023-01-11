import { Button, Flex, Title } from "@mantine/core";
import React, { useState } from "react";
import CreateTemplateModal from "./CreateTemplateModal";

const TemplateList = () => {
  const [open, setOpen] = useState(false);

  function toggleOpen() {
    setOpen((o) => !o);
  }

  return (
    <div className="p-4">
      <Flex justify="space-between" align="center">
        <Title order={2}>Form Templates</Title>
        <Button onClick={toggleOpen}>Add Form</Button>
      </Flex>

      <CreateTemplateModal opened={open} onClose={toggleOpen} />
    </div>
  );
};

export default TemplateList;
