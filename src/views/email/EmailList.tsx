import React, { useState } from "react";
import {
  Box,
  Card,
  Flex,
  Text,
  Divider,
  Button,
  Affix,
  Grid,
  Skeleton,
  Badge,
  DefaultMantineColor,
  useMantineTheme,
} from "@mantine/core";

import EmailModal from "../../modals/EmailModal";
import EmailDetailsModal from "../../modals/EmailDetailsModal";
import { IEmailResponse, IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { showError } from "../../redux/commonSliceFunctions";
import generateDate from "../../utils/generateDate";
import { useAppSelector } from "../../redux/store";
import getEmailsByThreadId from "../../utils/getEmailsByThreadId";
import { IconCircle } from "@tabler/icons";

function FolderBadge({ email }: { email: IEmailThreadResponse }) {
  let color: DefaultMantineColor = "blue";
  const folderName = email.folders[0].name;

  if (folderName === "sent") {
    color = "green";
  }

  switch (folderName) {
    case "inbox":
      color = "blue";
      break;
    case "trash":
      color = "red";
      break;
    case "sent":
      color = "green";
      break;
    default:
      color = "blue";
      break;
  }

  return <Badge color={color}>{folderName}</Badge>;
}

type EmailListProps = {
  emails: IEmailThreadResponse[];
  filter?: string[];
};

const EmailList = ({ emails, filter }: EmailListProps) => {
  const { loaders } = useAppSelector((state) => state.nylas);

  const [opened, setOpened] = useState(false);

  const theme = useMantineTheme();

  const [threadEmails, setThreadEmails] = useState<IEmailResponse[] | null>(null);

  if (loaders.fetchingEmails) {
    return (
      <div>
        <Skeleton height={48} />
        <Divider />
        <Skeleton height={48} />
        <Divider />
        <Skeleton height={48} />
        <Divider />
        <Skeleton height={48} />
        <Divider />
        <Skeleton height={48} />
      </div>
    );
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <div>
          <Flex w="full" h={"auto"} direction={"column"} gap={"lg"} justify={"space-between"}>
            <Box w={"full"} h={"full"}>
              <Card radius={"md"} w={"full"} shadow={"md"} p={0}>
                {emails.map((email, i) => {
                  return (
                    <Box
                      p="sm"
                      key={i}
                      onClick={async () => {
                        try {
                          const res = await getEmailsByThreadId(email.id);
                          setThreadEmails(res.data);
                        } catch (error: any) {
                          showError(error.message);
                        }
                      }}
                      opacity={!email.unread ? 0.6 : 1}
                    >
                      <Grid>
                        <Grid.Col span={3}>
                          <Flex align="center" gap="sm">
                            <IconCircle
                              fill={
                                email.object === "thread"
                                  ? theme.colors.blue[6]
                                  : theme.colors.red[6]
                              }
                              color="transparent"
                              opacity={
                                email.subject.includes("[") && email.subject.includes("]") ? 1 : 0
                              }
                            />
                            <Text className={"cursor"} fw={500}>
                              {email.participants.length > 0 &&
                                (email.participants[0].name || email.participants[1].name)}
                            </Text>
                          </Flex>
                        </Grid.Col>
                        <Grid.Col span={7}>
                          <Text lineClamp={1} className="flex gap-4" mb="sm">
                            <>{email.subject}</>
                            <> - {email.snippet}</>
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={2}>
                          <Flex justify="flex-end" gap="md">
                            {filter && filter[0] === "All" && <FolderBadge email={email} />}
                            <Text align="right">{generateDate(email.last_message_timestamp)}</Text>
                          </Flex>
                        </Grid.Col>
                      </Grid>
                      {i < emails.length - 1 && <Divider />}
                    </Box>
                  );
                })}
              </Card>
            </Box>
            <Affix position={{ bottom: 20, right: 20 }}>
              <Button radius="xl" size="md" uppercase onClick={() => setOpened(true)}>
                Compose
              </Button>
            </Affix>
          </Flex>

          <EmailModal opened={opened} onClose={() => setOpened((o) => !o)} />
          <EmailDetailsModal
            emails={threadEmails}
            opened={!!threadEmails}
            onClose={() => setThreadEmails(null)}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default EmailList;
