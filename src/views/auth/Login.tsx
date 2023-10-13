import React, { useCallback, useMemo, useState } from "react";
import { useForm, yupResolver } from "@mantine/form";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  MediaQuery,
  Paper,
  PasswordInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
// import GoogleButton from "../../components/GoogleButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { businessLogin, loginUser } from "../../redux/api/authApi";
import * as Yup from "yup";

const Login = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  const [userType, setUserType] = useState("root");

  const schema = useMemo(() => {
    const rootShape = {
      email: Yup.string()
        .required(t("emailRequired") ?? "")
        .email(t("invalidEmail") ?? ""),
      password: Yup.string()
        .required(t("passwordRequired") ?? "")
        .min(8, t("passwordLength") ?? ""),
    };

    const businessShape = {
      ...rootShape,
      businessCode: Yup.string()
        .required(t("businessRequired") ?? "")
        .length(4, t("businessLength") ?? ""),
    };

    if (userType === "business") {
      return Yup.object().shape(businessShape);
    } else {
      return Yup.object().shape(rootShape);
    }
  }, [userType, t]);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      businessCode: "",
    },
    validate: yupResolver(schema),
  });

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
    <MediaQuery smallerThan="sm" styles={{ width: "fit-content" }}>
      <Paper p="xl" className="h-screen !w-full flex flex-col justify-center align-middle">
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
                  label={t("loginType")}
                  withAsterisk
                >
                  <Group mt="xs">
                    <Radio value="root" label={t("root")} />
                    <Radio value="business" label={t("business")} />
                  </Group>
                </Radio.Group>

                {userType === "business" && (
                  <TextInput
                    label="Business Code"
                    placeholder="1000"
                    {...form.getInputProps("businessCode")}
                  />
                )}

                <TextInput
                  label="Email"
                  placeholder="john@email.com"
                  error={form.errors.email && "Invalid email"}
                  {...form.getInputProps("email")}
                />

                <PasswordInput
                  label={t("password")}
                  placeholder={t("yourPassword")}
                  {...form.getInputProps("password")}
                />

                <Checkbox label={t("rememberMe")} />

                <Button loading={!!loading} type="submit" variant="filled">
                  {t("signIn")}
                </Button>
              </Stack>
            </form>

            <Divider label={t("continueWithGoogle")} labelPosition="center" my="lg" />
            {/* 
            <Group grow mb="md" mt="md">
              <GoogleButton radius="xl">Google</GoogleButton>
            </Group> */}
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
    </MediaQuery>
  );
};

export default Login;
