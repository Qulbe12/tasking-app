import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { setTargetedContact } from "../redux/slices/nylasSlice";
import { updateContact } from "../redux/api/nylasApi";

const UpdateContactModel = () => {
  const [contactModalState, { toggle: contactModelToggle }] = useDisclosure(false);
  const { loaders } = useAppSelector((state) => state.nylas);
  const { targetedContact } = useAppSelector((state) => state.nylas);
  const validationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().required("Email is required"),
    phone: yup.string().required("Phone is required"),
  });

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validate: yupResolver(validationSchema),
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (targetedContact) {
      form.setValues({
        name: targetedContact.given_name,
        email: targetedContact.emails[0]?.email,
        phone: targetedContact.phone_numbers[0]?.number,
      });
      contactModelToggle();
    }
  }, [targetedContact]);

  return (
    <>
      {form && (
        <Modal
          opened={contactModalState}
          onClose={() => {
            dispatch(setTargetedContact(null));
            contactModelToggle();
          }}
          title="Update Contact"
        >
          <form
            onSubmit={form.onSubmit(async () => {
              if (targetedContact) {
                await dispatch(
                  updateContact({
                    id: targetedContact.id,
                    data: {
                      given_name: form.values.name,
                      emails: [
                        {
                          email: form.values.email,
                          type: "work",
                        },
                      ],
                      phone_numbers: [
                        {
                          number: form.values.phone,
                          type: "business",
                        },
                      ],
                    },
                  }),
                );
              }
              form.reset();
              contactModelToggle();
            })}
          >
            <Stack>
              <TextInput withAsterisk label="Contact name" {...form.getInputProps("name")} />
              <TextInput withAsterisk label="Work email" {...form.getInputProps("email")} />
              <TextInput withAsterisk label="Business phone" {...form.getInputProps("phone")} />
              <Group position="right" mt="md">
                <Button loading={loaders.updatingContact} type="submit">
                  Update Contact
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      )}
    </>
  );
};

export default UpdateContactModel;
