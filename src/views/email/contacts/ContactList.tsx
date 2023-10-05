import { ActionIcon, Button, Card, Flex, Menu, SimpleGrid, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useMemo } from "react";
import AddContactModal from "../../../modals/AddContactModal";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import useDebouncedValue from "../../../hooks/useDebounedValue";
import _ from "lodash";
import { deleteContact, getContacts } from "../../../redux/api/nylasApi";
import { IconDotsVertical, IconPencil, IconPlus, IconTrash } from "@tabler/icons";
import { useModals } from "@mantine/modals";
import { setTargetedContact } from "../../../redux/slices/nylasSlice";
import UpdateContactModel from "../../../modals/UpdateContact";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export function ContactList() {
  const [contactModalState, { toggle: contactModelToggle }] = useDisclosure(false);
  const { search } = useAppSelector((state) => state.filters);
  const deSearch = useDebouncedValue(search, 300);
  const { nylasContacts } = useAppSelector((state) => state.nylas);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (nylasContacts.length <= 0) dispatch(getContacts());
  }, []);

  const filteredData = useMemo(() => {
    const value = _.toLower(deSearch);
    return nylasContacts.filter((c) => {
      return (
        _.toLower(JSON.stringify(c.emails)).includes(value) ||
        _.toLower(c.given_name).includes(value)
      );
    });
  }, [deSearch, nylasContacts]);
  const modals = useModals();
  const openDeleteModal = (id: string) =>
    modals.openConfirmModal({
      title: "Delete selected contact",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete contact? This action is destructive and you will not be
          able to recover this data.
        </Text>
      ),
      labels: { confirm: "Delete contact", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => dispatch(deleteContact(id)),
    });

  return (
    <>
      <Flex align="center" justify="space-between">
        <Flex gap={5} align="center">
          <ActionIcon onClick={() => navigate("/board/emails")}>
            <IconArrowLeft />
          </ActionIcon>
          <Title order={2}>Contacts</Title>
        </Flex>
        <Button onClick={contactModelToggle} leftIcon={<IconPlus />} my="md">
          Add contact
        </Button>
      </Flex>
      <SimpleGrid cols={4}>
        {filteredData.map((contact, index) => (
          <Card key={index}>
            <Flex justify="space-between">
              <Text>{contact.given_name}</Text>
              <Menu width={150} shadow="md" withinPortal={true} position="bottom-end">
                <Menu.Target>
                  <ActionIcon size="xs">
                    <IconDotsVertical />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    onClick={() => dispatch(setTargetedContact(contact))}
                    icon={<IconPencil style={{ width: 14, height: 14 }} />}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => openDeleteModal(contact.id)}
                    color="red"
                    icon={<IconTrash style={{ width: 14, height: 14 }} />}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Flex>
            <Text size="sm">{contact.emails[0]?.email}</Text>
            <Text size="sm">{contact.phone_numbers[0]?.number}</Text>
          </Card>
        ))}
      </SimpleGrid>
      <AddContactModal
        title="Add Contact"
        opened={contactModalState}
        onClose={contactModelToggle}
      />
      <UpdateContactModel />
    </>
  );
}
