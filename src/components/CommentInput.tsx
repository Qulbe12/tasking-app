import React, { useState } from "react";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createComment } from "../redux/api/commentsApi";
import { IconSend } from "@tabler/icons";
import { useTranslation } from "react-i18next";

type CommentInput = {
  documentId?: string;
};

const CommentInput = ({ documentId }: CommentInput) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [comment, setComment] = useState("");

  const { loading } = useAppSelector((state) => state.comments);

  return (
    <Stack mt="md">
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.currentTarget.value)}
        size="xs"
        minRows={3}
        maxRows={3}
        disabled={loading}
        placeholder="Comment..."
      />

      <Group position="right">
        <Button
          rightIcon={<IconSend size="1em" />}
          onClick={async () => {
            if (!documentId) return;
            await dispatch(createComment({ documentId, comment: { body: comment } }));
            setComment("");
          }}
          loading={loading}
          size="xs"
        >
          {t("comment")}
        </Button>
      </Group>
    </Stack>
  );
};

export default CommentInput;
