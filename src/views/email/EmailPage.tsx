import { Button, Flex, Title } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Calander from "../../components/Calendar";
import Collapsable from "../../components/Collapsable";
import Filter from "../../components/Filter";
import { connectNylas, fetchEmails } from "../../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import EmailList from "./EmailList";

const EmailPage = () => {
  const dispatch = useAppDispatch();

  const { data: templates } = useAppSelector((state) => state.templates);
  const { user } = useAppSelector((state) => state.auth);

  const [selectedMode, setSelectedMode] = useState(true);
  const [filter, setFilter] = useState<string[]>([]);
  const [emailFilter, setEmailFilter] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchEmails());
  }, []);

  if (!user?.nylasToken) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
        }}
      >
        Not Connected
        <Button
          onClick={() => {
            dispatch(connectNylas());
          }}
        >
          Connect
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <Collapsable>
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
      </Collapsable>
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
