import { useEffect, useMemo, useState } from "react";
import { Button, Affix, Grid } from "@mantine/core";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  GetAllThreadsArgs,
  getAllFolders,
  getAllMessages,
  getAllThreads,
  getMoreThreads,
} from "../../redux/api/nylasApi";
import ThreadsList from "./components/ThreadsList";
import MessageDetails from "../../components/MessageDetails";
import EmailListHeader from "./components/EmailListHeader";
import ComposeEmail from "./components/ComposeEmail";
import { IMessageResponse } from "../../interfaces/nylas/IMessageResponse";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import FoldersList from "./components/FoldersList";

type EmailListProps = {
  filter?: string[];
  onActionButtonClick: () => void;
};

const EmailList = ({ onActionButtonClick }: EmailListProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { threads } = useAppSelector((state) => state.nylas);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [type, setType] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState<IMessageResponse | undefined>();

  useEffect(() => {
    if (!selectedThreadId) return;

    dispatch(getAllMessages({ thread_id: selectedThreadId }));
  }, [selectedThreadId]);

  const commonThreadQuery: GetAllThreadsArgs = { view: "expanded", limit: 20 };

  const inFolder = useMemo(() => {
    if (type === "inbox" || type === "sent" || type === "spam" || type === "trash") {
      return _.startCase(type);
    }
  }, [type]);

  useEffect(() => {
    if (inFolder) {
      dispatch(getAllThreads({ ...commonThreadQuery, in: inFolder }));
    }
  }, [inFolder, type]);

  useEffect(() => {
    dispatch(getAllFolders());
  }, []);

  return (
    <div>
      <EmailListHeader
        onActionButtonClick={onActionButtonClick}
        type={type}
        onTypeChange={(t) => setType(t)}
      />
      <Grid h="87vh">
        <Grid.Col span={2} h="100%">
          <FoldersList
            selectedThreadId={selectedThreadId}
            onThreadClick={(t) => setSelectedThreadId(t.id)}
          />
        </Grid.Col>
        <Grid.Col span={3} h="100%">
          <ThreadsList
            selectedThreadId={selectedThreadId}
            onThreadClick={(t) => {
              setSelectedThreadId(t.id);
              setShowEmailForm(false);
            }}
            afterScroll={() => {
              dispatch(
                getMoreThreads({ ...commonThreadQuery, offset: threads.length, in: inFolder }),
              );
            }}
          />
        </Grid.Col>
        {!showEmailForm && (
          <Grid.Col span={7} h="100%">
            <MessageDetails
              selectedThreadId={selectedThreadId}
              selectedMessage={selectedMessage}
              onForwardClick={(m) => {
                setShowEmailForm(false);
                setSelectedMessage(m);
                setShowEmailForm(true);
              }}
              onDocumentCardClick={(d) => navigate("/board", { state: { document: d } })}
            />
          </Grid.Col>
        )}
        {showEmailForm && (
          <Grid.Col span={7} h="100%">
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
            {t("composeEmail")}
          </Button>
        </Affix>
      )}
    </div>
  );
};

export default EmailList;
