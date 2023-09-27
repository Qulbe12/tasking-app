import React from "react";
import { useForm, yupResolver } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Stack,
  Title,
  Checkbox,
  Anchor,
  Flex,
} from "@mantine/core";
import GoogleButton from "../../components/GoogleButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";

import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../redux/api/authApi";
import { showError } from "../../redux/commonSliceFunctions";

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  const schema = Yup.object().shape({
    businessName: Yup.string().required(t("businessNameRequired") ?? ""),
    name: Yup.string().required(t("nameRequired") ?? ""),
    email: Yup.string()
      .email(t("invalidEmail") ?? "")
      .required(t("emailRequired") ?? ""),
    password: Yup.string()
      .min(8, t("passwordLength") ?? "")
      .required(t("passwordRequired") ?? ""),
    confirmPassword: Yup.string()
      .required(t("passwordRequired") ?? "")
      .oneOf([Yup.ref("password"), null], t("matchPassword") ?? ""),
  });

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
      confirmPassword: "",
      businessName: "",
    },

    validate: yupResolver(schema),
  });

  const handleSubmit = (values: typeof form.values) => {
    if (!form.values.terms) {
      return showError(t("acceptTerms") ?? "");
    }
    dispatch(registerUser(values));
  };

  return (
    <Paper p="xl" className="h-screen">
      <Flex direction="column" justify="space-between" className="h-full">
        <div>
          <Title>{t("signUp")}</Title>
          <Text mb="md">{t("welcomeSignUp")}</Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label={t("businessName")}
                withAsterisk
                placeholder={t("businessName")}
                {...form.getInputProps("businessName")}
              />
              <TextInput
                label={t("name")}
                withAsterisk
                placeholder="Jon Doe"
                {...form.getInputProps("name")}
              />
              <TextInput
                label="Email"
                withAsterisk
                placeholder="john@email.com"
                {...form.getInputProps("email")}
              />
              <PasswordInput
                label={t("password")}
                withAsterisk
                placeholder="********"
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label={t("confirmPassword")}
                withAsterisk
                placeholder="********"
                {...form.getInputProps("confirmPassword")}
              />

              <Checkbox
                label={
                  <>
                    {t("I have read and accept")}{" "}
                    <Anchor href="/terms-and-conditions" target="_blank" inherit>
                      {t("terms and conditions")}
                    </Anchor>{" "}
                    {t(" and ")}
                    <Anchor href="/privacy" target="_blank" inherit>
                      {t("privacy policy")}
                    </Anchor>
                  </>
                }
                {...form.getInputProps("terms", { type: "checkbox" })}
              />
              <Button loading={!!loading} type="submit" variant="filled">
                {t("signUp")}
              </Button>
            </Stack>
          </form>

          <Divider label={t("continueWithGoogle")} labelPosition="center" my="lg" />

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group>
        </div>

        <Anchor
          component="button"
          type="button"
          onClick={() => navigate("/auth/login")}
          color="dimmed"
          size="xs"
        >
          {t("Already have an account? Sign In")}
        </Anchor>
      </Flex>
    </Paper>
  );
};

export default Register;
