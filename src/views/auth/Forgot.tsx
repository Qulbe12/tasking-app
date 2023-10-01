import { useForm, yupResolver } from "@mantine/form";
import { TextInput, Text, Paper, Button, Stack, Title, Anchor, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { axiosPrivate } from "../../config/axios";
import { showNotification } from "@mantine/notifications";
import { showError } from "../../redux/commonSliceFunctions";
import { IErrorResponse } from "../../interfaces/IErrorResponse";
import { useState } from "react";

const Forgot = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const schema = Yup.object().shape({
    email: Yup.string()
      .email(t("invalidEmail") ?? "")
      .required(t("emailRequired") ?? ""),
  });

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: yupResolver(schema),
  });

  const otpSchema = Yup.object().shape({
    secret: Yup.string().required(t("secretRequired") ?? ""),
    password: Yup.string().required(t("passwordRequired") ?? ""),
  });
  const otpForm = useForm({
    initialValues: {
      secret: "",
      password: "",
    },
    validate: yupResolver(otpSchema),
  });

  const [loading, setLoading] = useState(false);

  const [requestSent, setRequestSent] = useState(false);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      await axiosPrivate.post("/users/forgot-password", { email: values.email });
      setRequestSent(true);
      showNotification({ message: "Reset opt sent to registered email." });
    } catch (error) {
      const err = error as IErrorResponse;
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (values: typeof otpForm.values) => {
    setLoading(true);
    try {
      if (form.validate()) {
        await axiosPrivate.post("/users/reset-password", { email: form.values.email, ...values });
        showNotification({ message: "Password reset successfully, please login to continue" });
        form.reset();
        otpForm.reset();
        navigate("/auth/login");
      }
      setRequestSent(false);
    } catch (err) {
      showError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="xl" className="h-screen">
      <Flex direction="column" justify="space-between" className="h-full">
        <div>
          <Title>{t("forgotPassword")}?</Title>
          <Text mb="md">{t("Enter the email address associated with your account")}</Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                withAsterisk
                label="Email"
                placeholder="john@email.com"
                {...form.getInputProps("email")}
              />

              <Button loading={loading} type="submit">
                {requestSent ? t("resendOtp") : t("resetPassword")}
              </Button>
            </Stack>
          </form>

          {requestSent && (
            <form onSubmit={otpForm.onSubmit(handleOtpSubmit)}>
              <Title order={2}>{t("resetPassword")}</Title>
              <Stack>
                <TextInput
                  withAsterisk
                  label="OTP"
                  placeholder="000000"
                  {...otpForm.getInputProps("secret")}
                />

                <TextInput
                  withAsterisk
                  type="password"
                  label={t("newPassword")}
                  placeholder="******"
                  {...otpForm.getInputProps("password")}
                />
                <Button loading={loading} type="submit">
                  {t("resetPassword")}
                </Button>
              </Stack>
            </form>
          )}
        </div>

        <Anchor
          component="button"
          type="button"
          onClick={() => navigate("/auth/login")}
          color="dimmed"
          size="xs"
        >
          {t("Remembered your details? Sign In")}
        </Anchor>
      </Flex>
    </Paper>
  );
};

export default Forgot;
