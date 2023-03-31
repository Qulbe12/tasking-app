import { Collapse } from "@mantine/core";
import React from "react";
import { useAppSelector } from "../redux/store";

type CollapsableProps = {
  children: React.ReactElement | React.ReactElement[];
};

const Collapsable = ({ children }: CollapsableProps) => {
  const { filtersOpen } = useAppSelector((state) => state.filters);
  return (
    <div>
      <Collapse in={filtersOpen}>{children}</Collapse>
    </div>
  );
};

export default Collapsable;
