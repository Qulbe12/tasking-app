import { Button, Flex, Pagination, Title } from "@mantine/core";

import React, { useEffect, useMemo, useState } from "react";
import Calander from "../../components/Calendar";
import Filter from "../../components/Filter";
import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { connectNylas, fetchEmails } from "../../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import EmailList from "./EmailList";
import { ITemplate } from "hexa-sdk";
import _ from "lodash";

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
      dispatch(fetchEmails());
    }
  }, [emailOffset]);

  const filteredEmails = useMemo<IEmailThreadResponse[]>(() => {
    let eFilter = emailFilter;
    let fEmails = emails;
    const lowSearch = _.lowerCase(search);

    if (emailFilter[0] === "All") {
      eFilter = [""];
    }

    if (search) {
      fEmails = fEmails.filter((e) => {
        return _.lowerCase(e.subject + e.snippet).includes(lowSearch);
      });
    }

    fEmails = fEmails.filter((e: IEmailThreadResponse) => {
      return _.lowerCase(JSON.stringify(e.folders)).includes(eFilter[0]?.toLowerCase());
    });

    return fEmails;
  }, [emails, search, emailFilter, filter]);

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
        options={[...templates.map((t: ITemplate) => t.name)]}
        onChange={setFilter}
      />
      <Filter
        singleSelection
        defaultValues={["Inbox"]}
        // options={templates.map((t) => t.name)}
        options={["All", "Inbox", "Sent", "Spam", "Trash"]}
        onChange={setEmailFilter}
      />

      <Flex justify="space-between" align="center" mb="md">
        <Title order={2}>Emails</Title>
        <Button onClick={() => setSelectedMode((o) => !o)}>
          {selectedMode ? "Calendar" : "List"}
        </Button>
      </Flex>

      {selectedMode && <EmailList emails={filteredEmails} filter={emailFilter} />}
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
