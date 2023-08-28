import { Card, Skeleton, Stack } from "@mantine/core";
import React from "react";
import { useAppSelector } from "../../../redux/store";
import {
  IThreadExpandedResponse,
  IThreadResponse,
} from "../../../interfaces/nylas/IThreadResponse";
import ThreadCard from "../../../components/ThreadCard";
import InfiniteScroll from "../../../components/InfiniteScroll";

type ThreadsListProps = {
  onThreadClick: (thread: IThreadExpandedResponse | IThreadResponse) => void;
  selectedThreadId: string | null;
};

const ThreadsList = ({ onThreadClick, selectedThreadId }: ThreadsListProps) => {
  const { loaders, threads } = useAppSelector((state) => state.nylas);

  return (
    <Card withBorder shadow="sm" h="100%">
      <InfiniteScroll
        loading
        onScrollEnd={() => {
          console.log("Hello");
        }}
      >
        <Stack>
          {loaders.gettingThreads &&
            Array(50)
              .fill(0)
              .map((a, i) => {
                return <Skeleton key={i} height={100} radius="sm" />;
              })}
        </Stack>
        <>
          {!loaders.gettingThreads &&
            threads?.map((t) => {
              if (t.participants.length <= 0) return;
              return (
                <ThreadCard
                  onClick={() => onThreadClick(t)}
                  thread={t}
                  key={t.id}
                  selectedThreadId={selectedThreadId}
                />
              );
            })}
        </>
      </InfiniteScroll>
    </Card>
  );
};

export default ThreadsList;
