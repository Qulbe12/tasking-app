import { Button } from "@mantine/core";

import { useEffect, useState } from "react";

import { connectNylas, getContacts } from "../../redux/api/nylasApi";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import EmailList from "./EmailList";
import EmailCalendar from "./EmailCalendar";

const EmailPage = () => {
  const dispatch = useAppDispatch();

  const { nylasToken } = useAppSelector((state) => state.nylas);

  const [selectedMode, setSelectedMode] = useState(true);

  useEffect(() => {
    if (nylasToken?.access_token) {
      dispatch(getContacts());
    }
  }, []);

  // const filteredEmails = useMemo<IEmailThreadResponse[]>(() => {
  //   let fEmails = emails;
  //   const lowSearch = _.lowerCase(search);

  //   if (search) {
  //     fEmails = fEmails.filter((e) => {
  //       return _.lowerCase(e.subject + e.snippet).includes(lowSearch);
  //     });
  //   }

  //   return fEmails;
  // }, [emails, search]);

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
    <div>
      {selectedMode && <EmailList onActionButtonClick={() => setSelectedMode((o) => !o)} />}
      {!selectedMode && <EmailCalendar onActionButtonClick={() => setSelectedMode((o) => !o)} />}
    </div>
  );
};

export default EmailPage;
