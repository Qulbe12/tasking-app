import React, { useState } from "react";
import { Avatar, Box, Button, Card, Flex, Modal, Text } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { IconStar } from "@tabler/icons";
import CommonModalProps from "./CommonModalProps";
import EmailModal from "./EmailModal";
import { IEmailResponse } from "../interfaces/IEmailResponse";
import { Interweave } from "interweave";

type EmailDetailsModalProps = {
  email?: IEmailResponse;
};
const EmailDetailsModal = ({
  opened,
  onClose,
  email,
}: CommonModalProps & EmailDetailsModalProps) => {
  const [replyModal, setReplyModal] = useState(false);
  const navigation = useNavigate();
  return (
    <Modal size="70%" opened={opened} onClose={onClose}>
      <Card radius={"md"} w={"full"} shadow={"md"} p={0}>
        <Flex direction={"column"} gap={"lg"} p={20}>
          {/* <Text fw={500} size={"xl"}>
            Some Text Here
          </Text> */}
          <Flex w={"full"} align={"center"} justify={"space-between"} gap={"xl"} p={10}>
            <Flex align={"center"} gap={"xs"}>
              <Avatar
                radius="xl"
                size="lg"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              />
              <Text fw={500} size={"lg"}>
                {email?.from[0].name}
              </Text>
              <Text fw={200}>{email?.date && new Date(email.date + 100000).toDateString()}</Text>
            </Flex>
            <Box>
              <IconStar size={15} strokeWidth={1.5} cursor={"pointer"} />
            </Box>
          </Flex>
          <Box w={"70%"}>
            <Interweave content={email?.body} />
          </Box>
          <Flex gap={"md"}>
            <Button variant={"outline"} onClick={() => navigation("/dashboard/Inbox")}>
              Back
            </Button>
            <Button onClick={() => setReplyModal(true)}>Reply</Button>
          </Flex>
        </Flex>
      </Card>
      <EmailModal opened={replyModal} onClose={() => setReplyModal((o) => !o)} />
    </Modal>
  );
};

export default EmailDetailsModal;
