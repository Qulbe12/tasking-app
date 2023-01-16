import React from "react";
import { useToggle, upperFirst } from "@mantine/hooks";
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
import { registerUser } from "../../redux/slices/authSlice";
import { showNotification } from "@mantine/notifications";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Your password should be atleast 8 characters long")
    .required("required"),
});

const Register = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.auth);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: false,
    },

    validate: yupResolver(schema),
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("heres");

    if (!form.values.terms) {
      return showNotification({
        message: "You have to accept terms and conditions to continue",
      });
    }
    dispatch(registerUser(form.values));
  };

  return (
    <Paper p="xl" className="h-screen">
      <Flex direction="column" justify="space-between" className="h-full">
        <div>
          <Title>Sign Up</Title>
          <Text mb="md">Welcome to Mantine, sign in with</Text>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue("name", event.currentTarget.value)}
                error={form.errors.name && form.errors.name}
              />

              <TextInput
                label="Email"
                placeholder="john@email.com"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue("password", event.currentTarget.value)}
                error={form.errors.password && "Password should include at least 6 characters"}
              />

              <Checkbox
                label="I accept terms and conditions"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue("terms", event.currentTarget.checked)}
              />

              <Button loading={!!loading} type="submit">
                Sign Up
              </Button>
            </Stack>
          </form>

          <Divider label="Or continue with Gmail" labelPosition="center" my="lg" />

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
          Already have an account? Sign In
        </Anchor>
      </Flex>
    </Paper>
  );
};

export default Register;
