import {
  Card,
  Drawer,
  Flex,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconFileText, IconHistory, IconMessageDots } from "@tabler/icons";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { axiosPrivate } from "../../config/axios";
import { showError } from "../../redux/commonSliceFunctions";
import PdfViewerComponentPublic from "../../components/PdfViewerComponentPublic";
import { IAttachment, IDocumentResponse } from "../../interfaces/documents/IDocumentResponse";
import dayjs from "dayjs";
import _ from "lodash";
import AvatarGroup from "../../components/AvatarGroup";
import { useTranslation } from "react-i18next";
import { FieldType } from "../../interfaces/documents/IField";
import CommentsList from "../../components/CommentsList";
import CommentInput from "../../components/CommentInput";
import useChangeLog from "../../hooks/useChangeLog";

const DocumentPublicView = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [document, setDocument] = useState<IDocumentResponse | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<IAttachment | null>(null);
  const [pdfOpen, setPdfOpen] = useState(false);
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string | null>("comments");
  const { getChangeLog, gettingChangeLog, changeLog } = useChangeLog();

  async function fetchDocumentById(documentId: string) {
    setDocument(null);
    setLoading(true);
    try {
      const res = await axiosPrivate.get(`/documents/${documentId}`);
      setLoading(false);
      setDocument(res.data);
    } catch (err) {
      showError("Unable to get document");
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchDocumentById(location.pathname.split("/")[2]);
    if (!document) return;
    getChangeLog(document.id);
  }, []);

  return (
    <Paper>
      <LoadingOverlay visible={loading} />
      <Flex justify="center" w="100%" gap="md" m="md" h="100%">
        <Flex
          w="30%"
          className="h-full"
          sx={{
            [theme.fn.smallerThan("md")]: {
              width: "300px",
              marginRight: "4px",
            },
          }}
        >
          <Card shadow="lg" className="h-full w-full">
            <ScrollArea h="75vh">
              <Flex justify="space-between" mb="xl">
                <Text size="lg">{document?.title}</Text>
              </Flex>
              <Stack>
                {document &&
                  Object.entries(document).map(([k, v], i) => {
                    const inputIndex = document.template.fields.findIndex((f) => f.key === k);

                    if (k === "template") return;
                    if (inputIndex < 0) return;

                    let value = v;

                    if (document.template.fields[inputIndex].type === FieldType.Date) {
                      value = dayjs(v).format("MMMM D, YYYY");
                    }

                    return (
                      <div key={i + "document" + k + v}>
                        {inputIndex >= 0 ? (
                          <Flex direction="column">
                            <Text weight="bolder" size="sm">
                              {_.startCase(k)}:
                            </Text>

                            <Text size="sm">{value || "no value"}</Text>
                          </Flex>
                        ) : (
                          <Text>{k}:</Text>
                        )}
                      </div>
                    );
                  })}

                <Flex direction="column">
                  <Flex direction="row" align="center" justify="space-between">
                    <Text weight="bolder" size="sm">
                      {t("assignedUsers")}:
                    </Text>
                  </Flex>
                  <AvatarGroup users={document.assignedUsers} />
                </Flex>

                <Flex direction="column">
                  <Flex direction="row" align="center" justify="space-between">
                    <Text weight="bolder" size="sm">
                      {t("ccUsers")}:
                    </Text>
                  </Flex>
                  <AvatarGroup ccUsers={document.ccUsers} />
                </Flex>

                <Group position="apart" align="center">
                  <Text>{t("attachments")}:</Text>
                </Group>
                {document.attachments.map((a) => {
                  return (
                    <Flex
                      onClick={() => {
                        setSelectedAttachment(a);
                        setPdfOpen(true);
                      }}
                      gap="md"
                      style={{ cursor: "pointer" }}
                      align="center"
                      justify="space-between"
                      key={a.id}
                    >
                      <Group align="center">
                        <IconFileText size={24} />
                        <p>{a.name}</p>
                      </Group>
                    </Flex>
                  );
                })}
              </Stack>
            </ScrollArea>
          </Card>
        </Flex>
        <Card shadow="lg" w="30%" className="h-75vh">
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
                              <td className="text-end">
                                {dayjs(cl.date).format("MM/DD/YY HH:mm")}
                              </td>
                            </tr>
                          );
                        });
                      })}
                    {!gettingChangeLog && (
                      <tr>
                        <td>{`${document?.createdBy.name} created ${document?.title}`}</td>
                        <td className="text-end">
                          {dayjs(document?.created).format("MM/DD/YY HH:mm")}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Tabs.Panel>
            </Tabs>
          </ScrollArea>
          <CommentInput documentId={document?.id} />
        </Card>
      </Flex>
      {/* <Title order={1} className="cursor-pointer" onClick={() => navigate("/")} mb="md"> */}
      {/*   Hexadesk */}
      {/* </Title> */}

      {/* <Title order={3}> {document?.title}</Title> */}

      {/* <p>Description: {document?.description}</p> */}
      {/* <p>Document Type: {document?.type}</p> */}

      {/* <p>Attachments: </p> */}
      {/* {document?.attachments.map((a) => { */}
      {/*   return ( */}
      {/*     <Flex */}
      {/*       onClick={() => { */}
      {/*         setSelectedAttachment(a); */}
      {/*         setPdfOpen(true); */}
      {/*       }} */}
      {/*       gap="md" */}
      {/*       style={{ cursor: "pointer" }} */}
      {/*       align="center" */}
      {/*       key={a.id} */}
      {/*     > */}
      {/*       <IconFileText size={32} /> */}
      {/*       <p>{a.name}</p> */}
      {/*     </Flex> */}
      {/*   ); */}
      {/* })} */}

      <Drawer
        position="right"
        size="50%"
        title={selectedAttachment?.name}
        opened={pdfOpen}
        onClose={() => {
          setPdfOpen((o) => !o);
          setSelectedAttachment(null);
        }}
      >
        {selectedAttachment && (
          <PdfViewerComponentPublic selectedDocument={document} attachment={selectedAttachment} />
        )}
      </Drawer>
    </Paper>
  );
};

export default DocumentPublicView;
