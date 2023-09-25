import React from "react";
import { useAppSelector } from "../redux/store";
import { Avatar, Group, Progress, Stack, Text } from "@mantine/core";
import { ICommentResponse } from "../interfaces/IComments";
import dayjs from "dayjs";

const CommentsList = () => {
  const { comments, loading } = useAppSelector((state) => state.comments);

  if (loading) {
    return (
      <Stack my="md">
        <Progress value={100} animate />
        <Text>Loading Comments...</Text>
      </Stack>
    );
  }

  if (comments.length === 0) {
    return <Text>No comments to display</Text>;
  }

  return (
    <Stack spacing="lg" className="h-full">
      {comments.map((comment) => (
        <CommentComponent key={comment.id} comment={comment} />
      ))}
    </Stack>
  );
};

const CommentComponent: React.FC<{ comment: ICommentResponse }> = ({ comment }) => {
  const { body, user, date } = comment;
  const { avatar, name } = user;

  const formattedDate = dayjs(date).format("MM/DD/YYYY HH:mm A");

  return (
    <div>
      <Group>
        <Avatar size="sm" src={avatar} alt={name} radius="xl" />
        <div>
          <Text size="sm">{name}</Text>
          <Text size="xs" color="dimmed">
            {formattedDate}
          </Text>
        </div>
      </Group>
      <Text mt="xs" className="body-text" size="sm">
        {body}
      </Text>
    </div>
  );
};

export default CommentsList;
