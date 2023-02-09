import { useForm } from "@mantine/form";
import { TextInput, Text, Paper, Button, Stack, Title, Anchor, Flex } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Forgot = () => {
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) => (val.length <= 6 ? "Password should include at least 6 characters" : null),
    },
  });
  return (
    <Paper p="xl" className="h-screen">
      <Flex direction="column" justify="space-between" className="h-full">
        <div>
          <Title>Forgot Password?</Title>
          <Text mb="md">Enter the email address associated with your account</Text>

          <form
            onSubmit={form.onSubmit(() => {
              // TODO: handle forget action
            })}
          >
            <Stack>
              <TextInput
                required
                label="Email"
                placeholder="john@email.com"
                value={form.values.email}
                onChange={(event) => form.setFieldValue("email", event.currentTarget.value)}
                error={form.errors.email && "Invalid email"}
              />

              <Button type="submit">Reset Password</Button>
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
          Remembered your details? Sign In
        </Anchor>
      </Flex>
    </Paper>
  );
};

export default Forgot;
