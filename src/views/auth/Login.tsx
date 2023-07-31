import React, { useCallback, useState } from "react";
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
  Radio,
} from "@mantine/core";
import GoogleButton from "../../components/GoogleButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { businessLogin, loginUser } from "../../redux/api/authApi";

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      businessCode: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });

  const [userType, setUserType] = useState("root");

  const handleSubmit = useCallback(() => {
    const { businessCode, email, password } = form.values;

    if (userType === "root") {
      dispatch(loginUser({ email, password }));
    }
    if (userType === "business") {
      dispatch(businessLogin({ businessCode, email, password }));
    }
  }, [userType, form.values]);

  return (
    <Paper p="xl" className="h-screen">
      <Flex direction="column" justify="space-between" className="h-full">
        <div>
          <Title>{t("signIn")}</Title>
          <Text mb="md">{t("welcomeSignIn")}</Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <Radio.Group
                value={userType}
                onChange={(e) => setUserType(e)}
                name="loginType"
                label="Login Type"
                withAsterisk
              >
                <Group mt="xs">
                  <Radio value="root" label="Root" />
                  <Radio value="business" label="Business" />
                </Group>
              </Radio.Group>

              {userType === "business" && (
                <TextInput
                  required
                  label="Business Code"
                  placeholder="1000"
                  value={form.values.businessCode}
                  onChange={(event) =>
                    form.setFieldValue("businessCode", event.currentTarget.value)
                  }
                  error={form.errors.businessCode && "Invalid Code"}
                />
              )}

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
