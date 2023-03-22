import React, { useState } from "react";
import { Box, Card, Flex, Text, Divider, Button, Affix, Grid } from "@mantine/core";

import EmailModal from "../../modals/EmailModal";
import EmailDetailsModal from "../../modals/EmailDetailsModal";
import { IEmailResponse, IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { nylasAxios } from "../../config/nylasAxios";
import { showError } from "../../redux/commonSliceFunctions";
import generateDate from "../../utils/generateDate";

type EmailListProps = {
  emails: IEmailThreadResponse[];
};

const EmailList = ({ emails }: EmailListProps) => {
  const [opened, setOpened] = useState(false);

  async function getEmailsByThreadId(threadId: string) {
    return await nylasAxios.get<IEmailResponse[]>(`/messages?thread_id=${threadId}`);
  }

  const [threadEmails, setThreadEmails] = useState<IEmailResponse[] | null>(null);

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
                          console.log(res.data[0]);

                          setThreadEmails(res.data);
                        } catch (error: any) {
                          showError(error.message);
                        }
                      }}
                      opacity={!email.unread ? 0.6 : 1}
                    >
                      <Grid>
                        <Grid.Col span={3}>
                          <Text className={"cursor"} fw={500}>
                            {email.participants[0].name || email.participants[1].name}
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={7}>
                          <Text lineClamp={1} className="flex gap-4" mb="sm">
                            <>{email.subject}</>
                            <> - {email.snippet}</>
                          </Text>
                        </Grid.Col>
                        <Grid.Col span={2}>
                          <Text align="right">{generateDate(email.last_message_timestamp)}</Text>
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
