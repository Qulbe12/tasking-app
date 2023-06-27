import React, { useState } from "react";
import { Button, Group, Stack, Textarea } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createComment } from "../redux/api/commentsApi";

type CommentInput = {
  documentId?: string;
};

const CommentInput = ({ documentId }: CommentInput) => {
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
          onClick={async () => {
            if (!documentId) return;
            await dispatch(createComment({ documentId, comment: { body: comment } }));
            setComment("");
          }}
          loading={loading}
          size="xs"
        >
          Comment
        </Button>
      </Group>
    </Stack>
  );
};

export default CommentInput;
