import {
  ActionIcon,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Menu,
  Modal,
  MultiSelect,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { addBoardMembers, removeBoardMember } from "../../redux/api/boardsApi";
import { IconDots, IconMail, IconTrash } from "@tabler/icons";

const MembersTab = () => {
  const [createOpen, setCreateOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const [emails, setEmails] = useState<string[]>([]);

  const handleAddMembers = async () => {
    if (!activeBoard?.id) return;
    if (!emails) return;
    await dispatch(addBoardMembers({ boardId: activeBoard?.id, emails }));
    setEmails([]);
    setCreateOpen(false);
  };

  return (
    <div>
      <Group position="right">
        <Button onClick={() => setCreateOpen(true)}>Add Member</Button>
      </Group>
      <Grid>
        {activeBoard?.members.map((m, i) => {
          return (
            <Grid.Col key={m.id || i + "member"} md={6} lg={3}>
              <Card className="relative h-fit">
                <Flex direction="column" align="center" justify="center" gap="md" mb="md">
                  <Avatar radius={"xl"} size="xl" src={m.avatar} />
                  <Title order={5}>{m.name}</Title>
                  <Flex align="center" gap="sm">
                    <IconMail /> {m.email}
                  </Flex>
                  <Text size="sm">Last Online: 23-04-2023 at 9:51</Text>
                </Flex>

                <div className="absolute top-4 right-4">
                  <Menu shadow="md" width={200}>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDots />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        onClick={() => {
                          dispatch(removeBoardMember({ boardId: activeBoard.id, email: m.email }));
                        }}
                        icon={<IconTrash color="red" size={16} />}
                      >
                        Remove Member
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </div>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>

      <Modal
        title={`Add members to ${activeBoard?.title}`}
        opened={createOpen}
        onClose={() => setCreateOpen((o) => !o)}
      >
        <MultiSelect
          label="Member Emails"
          data={emails}
          searchable
          creatable
          getCreateLabel={(query) => `+ Add ${query}`}
          onCreate={(query) => {
            const item = { value: query, label: query };
            setEmails((current) => [...current, item.value]);
            return item;
          }}
        />

        <Flex justify={"flex-end"} gap={"md"} mt="md">
          <Button
            loading={loaders.addingMembers}
            variant="outline"
            onClick={() => {
              setEmails([]);
              setCreateOpen((o) => !o);
            }}
          >
            Cancel
          </Button>
          <Button loading={loaders.addingMembers} onClick={handleAddMembers}>
            Add Members
          </Button>
        </Flex>
      </Modal>
    </div>
  );
};

export default MembersTab;
