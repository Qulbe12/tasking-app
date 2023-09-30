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

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const res = await axiosPrivate.post("/users/forgot-password", { email: values.email });
      showNotification({ message: res.data.message });
      setLoading(false);
    } catch (error) {
      const err = error as IErrorResponse;
      showError(err.response?.data.message);
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
                {t("resetPassword")}
              </Button>
            </Stack>
          </form>
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
