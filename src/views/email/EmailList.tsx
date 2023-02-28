import React, { useState } from "react";
import { Box, Card, Flex, Text, Divider, Button, Affix, Input, Grid } from "@mantine/core";

import EmailModal from "../../modals/EmailModal";
import { IconSearch, IconStar } from "@tabler/icons";
import EmailDetailsModal from "../../modals/EmailDetailsModal";

const EmailList = () => {
  const [opened, setOpened] = useState(false);

  const email = [
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
    {
      sender: "Indeed",
      motive: "Someone wants to add u in a new project",
      message: "Hey! this is our new project",
    },
  ];

  const [detailsModal, setDetailsModal] = useState(false);

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
                {email.map((email, i) => {
                  return (
                    <Box key={i}>
                      <Flex w={"full"} align={"center"} gap={"xl"} p={10}>
                        <Flex align={"center"} gap={"xs"}>
                          <IconStar size={15} strokeWidth={1.5} cursor={"pointer"} />
                          <Text
                            className={"cursor"}
                            fw={500}
                            onClick={() => setDetailsModal((o) => !o)}
                          >
                            {email.sender}
                          </Text>
                        </Flex>
                        <Flex align={"center"} onClick={() => setDetailsModal((o) => !o)}>
                          <Text className={"cursor"} fw={500}>
                            {email.motive}
                          </Text>
                          {"-"}
                          <Text className={"cursor"} fw={"normal"}>
                            {email.message}
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
          <EmailDetailsModal opened={detailsModal} onClose={() => setDetailsModal((o) => !o)} />
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default EmailList;
