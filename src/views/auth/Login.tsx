import React from "react";
import { useForm } from "@mantine/form";
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
import { loginUser } from "../../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });

  const handleSubmit = () => {
    dispatch(loginUser(form.values));
  };

  return (
    <Paper p="xl" className="h-screen">
      <Flex direction="column" justify="space-between" className="h-full">
        <div>
          <Title>{t("signIn")}</Title>
          <Text mb="md">{t("welcomeSignIn")}</Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="john@email.com"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
              />

              <PasswordInput
                required
                label={t("password")}
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password && "Password should include at least 6 characters"}
              />

              <Checkbox label={t("rememberMe")} />

              <Button loading={!!loading} type="submit">
                {t("signIn")}
              </Button>
            </Stack>
          </form>

          <Divider label={t("continueWithGoogle")} labelPosition="center" my="lg" />

          <Group grow mb="md" mt="md">
            <GoogleButton radius="xl">Google</GoogleButton>
          </Group>
        </div>

        <Flex justify="space-between">
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate("/auth/forgot")}
            color="dimmed"
            size="xs"
          >
            {t("forgotPassword")}?
          </Anchor>
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate("/auth/register")}
            color="dimmed"
            size="xs"
          >
            {t("Don't have an account? Register")}
          </Anchor>
        </Flex>
      </Flex>
    </Paper>
  );
};

export default Login;
