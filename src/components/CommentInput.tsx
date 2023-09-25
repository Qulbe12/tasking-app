import React, { useEffect } from "react";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createComment } from "../redux/api/commentsApi";
import { IconSend } from "@tabler/icons";
import { useTranslation } from "react-i18next";
import { useForm, yupResolver } from "@mantine/form";
import * as Yup from "yup";

type CommentInputProps = {
  documentId?: string;
};

const CommentInput: React.FC<CommentInputProps> = ({ documentId }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const schema = Yup.object().shape({
    comment: Yup.string().required(t("commentRequired") ?? ""),
  });

  const form = useForm({
    initialValues: {
      comment: "",
    },
    validate: yupResolver(schema),
  });

  const { loading } = useAppSelector((state) => state.comments);

  const handleCommentSubmit = async (values: typeof form.values) => {
    if (!documentId) return;
    await dispatch(createComment({ documentId, comment: { body: values.comment } }));
    form.reset();
  };

  useEffect(() => {
    form.reset();
  }, [documentId]);

  return (
    <form onSubmit={form.onSubmit(handleCommentSubmit)}>
      <Stack mt="md">
        <Textarea
          size="xs"
          minRows={3}
          maxRows={3}
          disabled={loading}
          placeholder={t("commentPlaceholder") || "Comment..."}
          {...form.getInputProps("comment")}
        />

        <Group position="right">
          <Button rightIcon={<IconSend size="1em" />} type="submit" loading={loading} size="xs">
            {t("comment")}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CommentInput;
