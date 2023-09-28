import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollArea, Loader, Group } from "@mantine/core";

type InfiniteScrollProps = {
  children: React.ReactNode;
  loading: boolean;
  onScrollEnd: () => void;
};

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({ children, loading, onScrollEnd }) => {
  const viewport = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

  const isAtScrollEnd = useMemo(() => {
    if (!viewport.current) return false;

    return scrollPosition.y >= viewport.current.scrollHeight - viewport.current.clientHeight;
  }, [scrollPosition, viewport.current]);

  useEffect(() => {
    if (loading) return;
    if (isAtScrollEnd) onScrollEnd();
  }, [isAtScrollEnd]);

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      <ScrollArea
        viewportRef={viewport}
        h={loading ? "95%" : "100%"}
        onScrollPositionChange={setScrollPosition}
      >
        {children}
      </ScrollArea>
      <Group position="center">{loading && <Loader my="md" variant="dots" size="xl" />}</Group>
    </div>
  );
};

export default InfiniteScroll;
