/* eslint-disable camelcase */
import { Button, Flex, Pagination, Title } from "@mantine/core";

import React, { useEffect, useMemo, useState } from "react";
import Calander from "../../components/Calendar";
import Filter from "../../components/Filter";
import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { connectNylas, fetchEmails } from "../../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import EmailList from "./EmailList";
import { ITemplate } from "hexa-sdk";
import { setNylasToken } from "../../redux/slices/nylasSlice";

const EmailPage = () => {
  const dispatch = useAppDispatch();

  const { data: templates } = useAppSelector((state) => state.templates);
  const { loaders: emailLoaders, emails, nylasToken } = useAppSelector((state) => state.nylas);
  const { search } = useAppSelector((state) => state.filters);

  const [selectedMode, setSelectedMode] = useState(true);
  const [filter, setFilter] = useState<string[]>([]);
  const [emailFilter, setEmailFilter] = useState<string[]>(["Inbox"]);

  const [emailOffset, setEmailOffset] = useState(0);

  useEffect(() => {
    if (nylasToken?.access_token) {
      dispatch(fetchEmails({ offset: emailOffset, folder: emailFilter[0] }));
    }
  }, [emailOffset, emailFilter]);

  const filteredEmails = useMemo<IEmailThreadResponse[]>(() => {
    return emails.filter((e: IEmailThreadResponse) => {
      return (
        JSON.stringify(e).toLowerCase().includes(search.toLowerCase()) &&
        JSON.stringify(e.folders).toLowerCase().includes(emailFilter[0]?.toLowerCase())
      );
    });
  }, [emails, search, emailFilter]);

  if (!nylasToken?.access_token) {
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
      <Filter
        // options={templates.map((t) => t.name)}
        options={templates.map((t: ITemplate) => t.name)}
        onChange={setFilter}
      />
      <Filter
        singleSelection
        defaultValues={["Inbox"]}
        // options={templates.map((t) => t.name)}
        options={["Inbox", "Sent", "Spam", "Trash"]}
        onChange={setEmailFilter}
      />
      <Button
        onClick={() => {
          dispatch(
            setNylasToken({
              ...nylasToken,
              access_token: "asdasd",
            }),
          );
        }}
      >
        Clear Token
      </Button>
      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Emails</Title>
        <Button onClick={() => setSelectedMode((o) => !o)}>
          {selectedMode ? "Calendar" : "List"}
        </Button>
      </Flex>

      {selectedMode && <EmailList emails={filteredEmails} />}
      {!selectedMode && <Calander emails={filteredEmails} />}
      {!emailLoaders.fetchingEmails && (
        <Pagination
          total={10}
          my="md"
          onChange={(e) => {
            setEmailOffset((e - 1) * 50);
          }}
        />
      )}
    </div>
  );
};

export default EmailPage;
