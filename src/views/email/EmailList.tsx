import { useEffect, useMemo, useState } from "react";
import { Affix, Button, Grid, ScrollArea } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  getAllFolders,
  getAllMessages,
  getAllThreads,
  getMoreThreads,
} from "../../redux/api/nylasApi";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import ThreadsList from "./components/ThreadsList";
import MessageDetails from "../../components/MessageDetails";
import EmailListHeader from "./components/EmailListHeader";
import ComposeEmail from "./components/ComposeEmail";
import FoldersList from "./components/FoldersList";
import { IMessageResponse } from "../../interfaces/nylas/IMessageResponse";

type EmailListProps = {
  filter?: string[];
  onActionButtonClick: () => void;
};

const FOLDER_TYPES = ["inbox", "sent", "spam", "trash"];

const EmailList = ({ onActionButtonClick }: EmailListProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { threads } = useAppSelector((state) => state.nylas);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [type, setType] = useState("inbox");
  const [selectedMessage, setSelectedMessage] = useState<IMessageResponse | null>(null);

  useEffect(() => {
    selectedThreadId && dispatch(getAllMessages({ thread_id: selectedThreadId }));
  }, [selectedThreadId]);

  const inFolder = useMemo(
    () => (FOLDER_TYPES.includes(type) ? _.startCase(type) : undefined),
    [type],
  );

  useEffect(() => {
    inFolder && dispatch(getAllThreads({ view: "expanded", limit: 20, in: inFolder }));
  }, [inFolder]);

  useEffect(() => {
    dispatch(getAllFolders());
  }, []);

  return (
    <div>
      <ScrollArea>
        <EmailListHeader
          onActionButtonClick={onActionButtonClick}
          type={type}
          onTypeChange={setType}
        />
        <Grid h="87vh" miw="90%">
          <Grid.Col span={2} h="100%">
            <FoldersList selectedThreadId={selectedThreadId} />
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
                  getMoreThreads({
                    view: "expanded",
                    limit: 20,
                    offset: threads.length,
                    in: inFolder,
                  }),
                );
              }}
            />
          </Grid.Col>
          <Grid.Col span={7} h="100%">
            {showEmailForm ? (
              <ComposeEmail
                selectedMessage={selectedMessage}
                onCancelClick={() => {
                  setShowEmailForm(false);
                  setSelectedMessage(null);
                }}
              />
            ) : (
              <MessageDetails
                selectedThreadId={selectedThreadId}
                selectedMessage={selectedMessage}
                onForwardClick={(m) => {
                  setSelectedMessage(m);
                  setShowEmailForm(true);
                }}
                onDocumentCardClick={(d) => navigate("/board", { state: { document: d } })}
              />
            )}
          </Grid.Col>
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
      </ScrollArea>
    </div>
  );
};

export default EmailList;
