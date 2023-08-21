import { useEffect, useState } from "react";
import { Button, Affix, Grid } from "@mantine/core";

import { useAppDispatch } from "../../redux/store";
import { getAllMessages } from "../../redux/api/nylasApi";
import ThreadsList from "./components/ThreadsList";
import MessageDetails from "./components/MessageDetails";
import EmailListHeader from "./components/EmailListHeader";
import ComposeEmail from "./components/ComposeEmail";
import { IMessageResponse } from "../../interfaces/nylas/IMessageResponse";

type EmailListProps = {
  filter?: string[];
  onActionButtonClick: () => void;
};

const EmailList = ({ onActionButtonClick }: EmailListProps) => {
  const dispatch = useAppDispatch();
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedThreadId) return;

    dispatch(getAllMessages({ thread_id: selectedThreadId }));
  }, [selectedThreadId]);

  const [selectedMessage, setSelectedMessage] = useState<IMessageResponse | undefined>();

  return (
    <div>
      <EmailListHeader onActionButtonClick={onActionButtonClick} />

      <Grid h="87vh">
        <Grid.Col span={2} h="100%">
          <ThreadsList
            selectedThreadId={selectedThreadId}
            onThreadClick={(t) => setSelectedThreadId(t.id)}
          />
        </Grid.Col>
        <Grid.Col span={showEmailForm ? 7 : 10} h="100%">
          <MessageDetails
            selectedThreadId={selectedThreadId}
            onForwardClick={(m) => {
              setShowEmailForm(false);
              setSelectedMessage(m);
              setShowEmailForm(true);
            }}
          />
        </Grid.Col>
        {showEmailForm && (
          <Grid.Col span={3}>
            <ComposeEmail
              selectedMessage={selectedMessage}
              onCancelClick={() => {
                setShowEmailForm(false);
                setSelectedMessage(undefined);
              }}
            />
          </Grid.Col>
        )}
      </Grid>

      {!showEmailForm && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <Button
            variant="filled"
            radius="xl"
            size="md"
            uppercase
            onClick={() => setShowEmailForm(true)}
          >
            Compose
          </Button>
        </Affix>
      )}
    </div>
  );
};

export default EmailList;
