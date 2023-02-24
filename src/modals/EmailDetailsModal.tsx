import React, { useState } from "react";
import { Avatar, Box, Button, Card, Flex, Modal, Text } from "@mantine/core";

import { useNavigate } from "react-router-dom";
import { IconStar } from "@tabler/icons";
import CommonModalProps from "./CommonModalProps";
import EmailModal from "./EmailModal";

const EmailDetailsModal = ({ opened, onClose }: CommonModalProps) => {
  const [replyModal, setReplyModal] = useState(false);
  const navigation = useNavigate();
  return (
    <Modal size="70%" opened={opened} onClose={onClose}>
      <Card radius={"md"} w={"full"} shadow={"md"} p={0}>
        <Flex direction={"column"} gap={"lg"} p={20}>
          <Text fw={500} size={"xl"}>
            Some Text Here
          </Text>
          <Flex w={"full"} align={"center"} justify={"space-between"} gap={"xl"} p={10}>
            <Flex align={"center"} gap={"xs"}>
              <Avatar
                radius="xl"
                size="lg"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
              />
              <Text fw={500} size={"lg"}>
                John Doe
              </Text>
              <Text fw={200}>Sat, Feb 11, 4:36 PM</Text>
            </Flex>
            <Box>
              <IconStar size={15} strokeWidth={1.5} cursor={"pointer"} />
            </Box>
          </Flex>
          <Box w={"70%"}>
            <Text fw={200}>
              It is a long established fact that a reader will be distracted by the readable content
              of a page when looking at its layout. The point of using Lorem Ipsum is that it has a
              more-or-less normal distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop publishing packages
              and web page editors now use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on purpose (injected
              humour and the like). There are many variations of passages of Lorem Ipsum available,
              but the majority have suffered alteration in some form, by injected humour, or
              randomised words which don't look even slightly believable. If you are going to use a
              passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden
              in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat
              predefined chunks as necessary, making this the first true generator on the Internet.
              It uses a dictionary of over 200 Latin words, combined with a handful of model
              sentence structures, to generate Lorem Ipsum which looks reasonable. The generated
              Lorem Ipsum is therefore always free from repetition, injected humour, or
              non-characteristic words etc.
            </Text>
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
