import { Button, Flex, Title } from "@mantine/core";
import React, { useState } from "react";
import Calander from "../../components/Calendar";
import Filter from "../../components/Filter";
import { connectNylas } from "../../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import EmailList from "./EmailList";

const EmailPage = () => {
  const dispatch = useAppDispatch();

  const { data: templates } = useAppSelector((state) => state.templates);
  const { status } = useAppSelector((state) => state.nylas);

  const [selectedMode, setSelectedMode] = useState(true);
  const [filter, setFilter] = useState<string[]>([]);
  const [emailFilter, setEmailFilter] = useState<string[]>([]);
  const [con, setCon] = useState(false);

  if (!status && !con) {
    return (
      <div>
        Not Connected
        <Button
          onClick={() => {
            dispatch(connectNylas());
          }}
        >
          Connect
        </Button>
        <Button
          onClick={() => {
            setCon(true);
          }}
        >
          Dummy Connect
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Filter
        // options={templates.map((t) => t.name)}
        options={templates.map((t) => t.name)}
        onChange={setFilter}
      />
      <Filter
        // options={templates.map((t) => t.name)}
        options={["Unread", "Unclassified", "To do", "Completed"]}
        onChange={setEmailFilter}
      />
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Emails</Title>
        <Button onClick={() => setSelectedMode((o) => !o)}>
          {selectedMode ? "Calendar" : "List"}
        </Button>
      </Flex>
      {selectedMode && <EmailList />}
      {!selectedMode && <Calander />}
    </div>
  );
};

export default EmailPage;
