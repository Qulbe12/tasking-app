import React from "react";
import { useAppSelector } from "../redux/store";
import { Avatar, Group, Progress, Stack, Text } from "@mantine/core";
import { ICommentResponse } from "../interfaces/IComments";
import dayjs from "dayjs";

const CommentsList = () => {
  const { comments, loading } = useAppSelector((state) => state.comments);

  if (loading)
    return (
      <Stack my="md">
        <Progress value={100} animate />
        <Text>Loading Comments...</Text>
      </Stack>
    );
  return (
    <Stack spacing="lg" className="h-full">
      {comments.map((c) => {
        return <CommentComponent key={c.id} comment={c} />;
      })}
    </Stack>
  );
};

const CommentComponent = ({ comment }: { comment: ICommentResponse }) => {
  const { body, user, date } = comment;
  const { avatar, name } = user;
  return (
    <div>
      <Group>
        <Avatar size="sm" src={avatar} alt={name} radius="xl" />
        <div>
          <Text size="sm">{name}</Text>
          <Text size="xs" color="dimmed">
            {dayjs(date).format("MM/DD/YYYY HH:mm A")}
          </Text>
        </div>
      </Group>
      <Text mt="xs" className={body} size="sm">
        {body}
      </Text>
    </div>
  );
};

export default CommentsList;
