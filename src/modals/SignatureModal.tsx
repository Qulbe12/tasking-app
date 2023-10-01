import { Button, Group, Modal, Stack, TextInput } from "@mantine/core";
import React from "react";
import CommonModalProps from "./CommonModalProps";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import { createSignature } from "../redux/api/signatureApi";
import { ISignatureCreate } from "../interfaces/signatures/ISignatureCreate";
import * as yup from "yup";
import CustomTextEditor from "../components/CustomTextEditor";

const SignatureModal = ({ onClose, opened }: CommonModalProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { loading } = useAppSelector((state) => state.signatures);

  const formSchema = yup.object().shape({
    name: yup.string().required("Version is required"),
    value: yup.string().required("Version is required"),
  });

  const form = useForm<ISignatureCreate>({
    initialValues: {
      name: "",
      value: "",
    },
    validate: yupResolver(formSchema),
  });

  const handleSubmit = () => {
    const validated = form.validate();
    if (validated.hasErrors) return;

    dispatch(createSignature(form.values)).finally(onClose);
  };

  return (
    <Modal size="xl" opened={opened} onClose={onClose} title={t("addSignature")}>
      <Stack>
        <TextInput label={t("name")} {...form.getInputProps("name")} />
        <CustomTextEditor
          isSignature
          content={form.values.value}
          onUpdate={(e) => {
            form.setValues({
              value: e,
            });
          }}
        />
      </Stack>
      <Group my="md" position="right">
        <Button onClick={onClose} type="button" size="sm">
          {t("cancel")}
        </Button>
        <Button loading={loading} type="button" size="sm" onClick={handleSubmit}>
          {t("addSignature")}
        </Button>
      </Group>
    </Modal>
  );
};

export default SignatureModal;
