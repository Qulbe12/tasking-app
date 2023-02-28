import React, { useState } from "react";
import { Box, Card, Flex, Text, Divider, Button, Affix, Input, Grid } from "@mantine/core";

import EmailModal from "../../modals/EmailModal";
import { IconSearch, IconStar } from "@tabler/icons";
import EmailDetailsModal from "../../modals/EmailDetailsModal";
import { useAppSelector } from "../../redux/store";

const EmailList = () => {
  const [opened, setOpened] = useState(false);

  const { emails } = useAppSelector((state) => state.nylas);

  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  return (
    <Grid>
      <Grid.Col span={12}>
        <div>
          <Input
            py="md"
            placeholder="Search Email"
            rightSection={<IconSearch size={22} strokeWidth={1} />}
          />

          <Flex w="full" h={"auto"} direction={"column"} gap={"lg"} justify={"space-between"}>
            <Box w={"full"} h={"full"}>
              <Card radius={"md"} w={"full"} shadow={"md"} p={0}>
                <Box p={15}>
                  <Text fw={500} size={"xl"}>
                    Primary
                  </Text>
                </Box>
                <Divider />
                {emails.map((email, i) => {
                  return (
                    <Box key={i} onClick={() => setSelectedEmail(email)}>
                      <Flex w={"full"} align={"center"} gap={"xl"} p={10}>
                        <Flex align={"center"} gap={"xs"}>
                          <IconStar size={15} strokeWidth={1.5} cursor={"pointer"} />
                          <Text className={"cursor"} fw={500}>
                            {email.from[0].name}
                          </Text>
                        </Flex>
                        <Flex align={"center"}>
                          <Text className={"cursor"} fw={500}>
                            {email.subject}
                            <Text lineClamp={1}>{email.snippet}</Text>
                          </Text>
                        </Flex>
                      </Flex>
                      <Divider />
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
            email={selectedEmail}
            opened={selectedEmail}
            onClose={() => setSelectedEmail(null)}
          />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default EmailList;
