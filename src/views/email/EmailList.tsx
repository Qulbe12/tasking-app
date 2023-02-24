/* eslint-disable camelcase */
import { Button, Flex, Title } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import Calander from "../../components/Calendar";
import Filter from "../../components/Filter";
import { connectNylas } from "../../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const EmailList = () => {
  const dispatch = useAppDispatch();

  const { data: templates } = useAppSelector((state) => state.templates);
  const { status } = useAppSelector((state) => state.nylas);

  const [selectedMode, setSelectedMode] = useState(true);
  const [filter, setFilter] = useState<string[]>([]);
  const [emailFilter, setEmailFilter] = useState<string[]>([]);
  const [con, setCon] = useState(false);

  const [creds, setCreds] = useState({
    email: "farhanjamil259@gmail.com",
    password: "Aa3221766!!Gmail",
  });

  const user = {};

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
        <button
          onClick={async () => {
            try {
              const res = await axios.post("https://api.nylas.com/connect/authorize", {
                client_id: "atuhp52v4461qzw4mpgr0e2f2",
                name: "Farhan Jamil",
                email_address: "farhanjamil259@gmail.com",
                provider: "gmail",
                settings: {
                  password: "Aa3221766!!Gmail",
                },
                scopes: "email.read_only",
              });

              console.log(res.data);
            } catch (err) {
              console.log(err);
            }
          }}
        >
          LOGIN
        </button>
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
      {selectedMode && <div>{user.token}</div>}
      {!selectedMode && <Calander />}
    </div>
  );
};

export default EmailList;
