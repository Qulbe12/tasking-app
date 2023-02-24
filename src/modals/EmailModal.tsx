import {
  Modal,
  Stack,
  Group,
  Avatar,
  Input,
  Divider,
  Box,
  Textarea,
  Flex,
  Button,
  Text,
} from "@mantine/core";
import CommonModalProps from "./CommonModalProps";

const EmailModal = ({ opened, onClose }: CommonModalProps) => {
  return (
    <Modal padding={"md"} transition="fade" size={"60%"} centered opened={opened} onClose={onClose}>
      <Stack spacing={"lg"}>
        <Group>
          <Text fw={400}>To:</Text>
          <Avatar
            radius="md"
            size="md"
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=250&q=80"
          />
          <Input w={"80%"} placeholder="someone@example.com" variant="unstyled" />
        </Group>
        <Divider />
        <Group>
          <Text fw={400}>Subject:</Text>
          <Input w={"80%"} placeholder="Hiring for job" variant="unstyled" />
        </Group>
        <Divider />
        <Box>
          <Textarea placeholder={"Compose your message."} autosize size={"lg"} variant="unstyled" />
        </Box>
        <Flex justify={"end"} gap={"md"}>
          <Button>Send</Button>
        </Flex>
      </Stack>
    </Modal>
  );
};

export default EmailModal;
