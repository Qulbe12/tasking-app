import { Group, Loader, ScrollArea } from "@mantine/core";
import React, { useEffect, useMemo, useRef, useState } from "react";

type InfiniteScrollProps = {
  children: React.ReactElement[] | React.ReactElement | boolean;
  loading: boolean;
  onScrollEnd: () => void;
};

const InfiniteScroll = ({ children, loading, onScrollEnd }: InfiniteScrollProps) => {
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollPosition, onScrollPositionChange] = useState({ x: 0, y: 0 });

  const isAtScrollEnd = useMemo(() => {
    if (!viewport.current) return false;
    return scrollPosition.y >= viewport.current.scrollHeight - viewport.current.clientHeight;
  }, [scrollPosition, viewport.current]);

  useEffect(() => {
    if (loading) return;
    if (isAtScrollEnd) onScrollEnd();
  }, [isAtScrollEnd]);

  return (
    <ScrollArea viewportRef={viewport} h="100%" onScrollPositionChange={onScrollPositionChange}>
      {children}

      <Group position="center">{loading && <Loader my="md" variant="dots" size="lg" />}</Group>
    </ScrollArea>
  );
};

export default InfiniteScroll;
