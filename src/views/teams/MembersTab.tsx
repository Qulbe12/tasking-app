import {
  ActionIcon,
  Anchor,
  Button,
  Flex,
  Group,
  Menu,
  Modal,
  MultiSelect,
  Table,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { addBoardMembers, removeBoardMember } from "../../redux/api/boardsApi";
import { IconDotsVertical, IconTrash } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import ConfirmationModal from "../../modals/ConfirmationModal";

const MembersTab = () => {
  const { t } = useTranslation();
  const [createOpen, setCreateOpen] = useState(false);

  const dispatch = useAppDispatch();

  const { activeBoard, loaders } = useAppSelector((state) => state.boards);
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const handleAddMembers = async () => {
    if (!activeBoard?.id) return;
    if (!emails) return;
    await dispatch(addBoardMembers({ boardId: activeBoard?.id, emails }));
    setEmails([]);
    setCreateOpen(false);
  };

  const handleRemovePress = (email: string) => {
    setSelectedEmail(email);
  };

  const handleRemoveMember = async () => {
    if (!selectedEmail || !activeBoard) return;
    dispatch(removeBoardMember({ boardId: activeBoard.id, email: selectedEmail })).finally(() =>
      setSelectedEmail(null),
    );
  };

  return (
    <div>
      <Group position="right">
        <Button onClick={() => setCreateOpen(true)}>{t("addMember")}</Button>
      </Group>
      <Table highlightOnHover>
        <thead>
          {activeBoard && activeBoard.members.length > 0 && (
            <tr>
              <td>Email</td>
              <td></td>
            </tr>
          )}
        </thead>
        <tbody>
          {activeBoard && activeBoard.members.length <= 0 && (
            <Text>
              {t("noMembersAdded")}{" "}
              <Anchor onClick={() => setCreateOpen(true)} component="button">
                {t("addMember")}
              </Anchor>
            </Text>
          )}
          {activeBoard?.members.map((m, i) => {
            return (
              <tr key={m + i + "activeBoardMember"}>
                <td>{m}</td>
                <td className="flex align-middle justify-end">
                  <Menu>
                    <Menu.Target>
                      <ActionIcon>
                        <IconDotsVertical size="1em" />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Item
                        icon={<IconTrash color="red" size="1em" />}
                        onClick={() => handleRemovePress(m)}
                      >
                        {t("remove")}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Modal
        title={`${t("addMembersTo")} ${activeBoard?.title}`}
        opened={createOpen}
        onClose={() => setCreateOpen((o) => !o)}
      >
        <MultiSelect
          label={t("memberEmails")}
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
            color="red"
            onClick={() => {
              setEmails([]);
              setCreateOpen((o) => !o);
            }}
          >
            {t("cancel")}
          </Button>
          <Button loading={loaders.addingMembers} onClick={handleAddMembers}>
            {t("addMembers")}
          </Button>
        </Flex>
      </Modal>

      <ConfirmationModal
        loading={loaders.removingMember}
        onClose={() => setSelectedEmail(null)}
        onOk={handleRemoveMember}
        opened={!!selectedEmail}
        type="delete"
        body={t("areYouSure") ?? ""}
        title={t("removeMember")}
      />
    </div>
  );
};

export default MembersTab;
