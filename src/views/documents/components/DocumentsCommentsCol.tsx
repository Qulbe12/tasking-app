import { Paper, ScrollArea, Skeleton, Table, Tabs } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useChangeLog from "../../../hooks/useChangeLog";
import dayjs from "dayjs";
import { IDocumentResponse } from "../../../interfaces/documents/IDocumentResponse";
import _ from "lodash";
import { IconHistory, IconMessageDots } from "@tabler/icons";
import { useAppDispatch } from "../../../redux/store";
import { getDocumentComments } from "../../../redux/api/commentsApi";
import CommentsList from "../../../components/CommentsList";
import CommentInput from "../../../components/CommentInput";

type DocumentsCommentsColProps = {
  selectedDocument: IDocumentResponse | null;
};

const DocumentsCommentsCol: React.FC<DocumentsCommentsColProps> = ({ selectedDocument }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<string | null>("comments");

  const { getChangeLog, gettingChangeLog, changeLog } = useChangeLog();

  useEffect(() => {
    if (!selectedDocument) return;
    getChangeLog(selectedDocument.id);
    dispatch(getDocumentComments({ documentId: selectedDocument.id }));
  }, [selectedDocument]);

  return (
    <Paper withBorder className="board">
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Tab icon={<IconMessageDots size="1.5em" />} value="comments">
            {t("comments")}
          </Tabs.Tab>
          <Tabs.Tab icon={<IconHistory size="1.5em" />} value="changelog">
            {t("changelog")}
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <ScrollArea
        className="content"
        mt="md"
        style={{ height: activeTab === "comments" ? "calc(100% - 250px)" : undefined }}
      >
        <Tabs value={activeTab}>
          <Tabs.Panel value="comments">
            <CommentsList />
          </Tabs.Panel>
          <Tabs.Panel value="changelog">
            <Table withColumnBorders={false}>
              <tbody>
                {gettingChangeLog ? (
                  <tr>
                    <td>
                      <Skeleton height={50} width="100%" />
                    </td>
                    <td>
                      <Skeleton height={50} width="100%" />
                    </td>
                  </tr>
                ) : (
                  ""
                )}
                {!gettingChangeLog &&
                  changeLog.reverse().map((cl, clIndex) => {
                    return cl.change.map((ch, chIndex) => {
                      return (
                        <tr key={cl.rid + clIndex + chIndex + "changelogReversed"}>
                          <td>
                            {`${cl.by.name} ${ch.type} ${_(ch.key).startCase()} from ${
                              ch.oldVal
                            } to ${ch.val}`}
                          </td>
                          <td className="text-end">{dayjs(cl.date).format("MM/DD/YY HH:mm")}</td>
                        </tr>
                      );
                    });
                  })}
                {!gettingChangeLog && (
                  <tr>
                    <td>{`${selectedDocument?.createdBy.name} created ${selectedDocument?.title}`}</td>
                    <td className="text-end">
                      {dayjs(selectedDocument?.created).format("MM/DD/YY HH:mm")}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
      </ScrollArea>
      <CommentInput documentId={selectedDocument?.id} />
    </Paper>
  );
};

export default DocumentsCommentsCol;
