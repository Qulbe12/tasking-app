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

import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { registerUser } from "../../redux/api/authApi";

const schema = Yup.object().shape({
  businessName: Yup.string().required(),
  name: Yup.string().required(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Your password should be atleast 8 characters long")
    .required("required"),
});

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

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
    if (values.password !== values.confirmPassword) {
      return showNotification({
        message: "Passwords do not match",
      });
    }
    if (!form.values.terms) {
      return showNotification({
        message: "You have to accept terms and conditions to continue",
      });
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
                label="Business Name"
                withAsterisk
                placeholder="Business name"
                value={form.values.businessName}
                onChange={(event) => form.setFieldValue("businessName", event.currentTarget.value)}
                error={form.errors.name && form.errors.name}
              />
              <TextInput
                label={t("name")}
                withAsterisk
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                error={form.errors.name && form.errors.name}
              />
              <TextInput
                label="Email"
                withAsterisk
                placeholder="john@email.com"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
              />
              <PasswordInput
                label={t("password")}
                withAsterisk
                placeholder="********"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password && "Password should include at least 8 characters"}
              />

              <PasswordInput
                label={t("confirmPassword")}
                withAsterisk
                placeholder="********"
                value={form.values.confirmPassword}
                onChange={(event) =>
                  form.setFieldValue("confirmPassword", event.currentTarget.value)
                }
                error={form.errors.conformPassword && "Passwords should match"}
              />

              <Checkbox
                label={t("confirmTermsAndConditions")}
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue("terms", event.currentTarget.checked)}
              />
              <Button loading={!!loading} type="submit">
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
