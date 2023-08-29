import { Card, Skeleton, Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";
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
  afterScroll: () => void;
};

const ThreadsList = ({ onThreadClick, selectedThreadId, afterScroll }: ThreadsListProps) => {
  const { loaders, threads } = useAppSelector((state) => state.nylas);
  const [currentOffset, setCurrentOffset] = useState(0);

  useEffect(() => {
    if (currentOffset > 0) {
      afterScroll();
    }
  }, [currentOffset]);

  return (
    <Card withBorder shadow="sm" h="100%">
      <InfiniteScroll
        loading={loaders.gettingMoreThreads}
        onScrollEnd={() => {
          setCurrentOffset((co) => co + 10);
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
            threads?.map((t, i) => {
              if (t.participants.length <= 0) return;
              return (
                <ThreadCard
                  onClick={() => onThreadClick(t)}
                  thread={t}
                  key={t.id + i + "thread"}
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
