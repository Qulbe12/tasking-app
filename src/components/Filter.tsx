import { Badge } from "@mantine/core";
import React from "react";
import useDrag from "../hooks/useDrag";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { IconArrowLeft, IconArrowRight, IconMenu } from "@tabler/icons";
import { LeftArrow, RightArrow } from "./FilterArrows";

type FilterProps = {
  options: string[];
};

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const Filter = ({ options }: FilterProps) => {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, (posDiff) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  const [selected, setSelected] = React.useState<string>("");
  const handleItemClick = (itemId: string) => () => {
    if (dragging) {
      return false;
    }
    setSelected(selected !== itemId ? itemId : "");
  };

  return (
    <div>
      <div onMouseLeave={dragStop}>
        <ScrollMenu
          LeftArrow={LeftArrow}
          wrapperClassName="whitespace-nowrap overflow-auto scrollbar-hide"
          RightArrow={RightArrow}
          //   onWheel={<IconMenu />}
          onMouseDown={() => dragStart}
          onMouseUp={() => dragStop}
          onMouseMove={handleDrag}
        >
          {options.map((option) => (
            <div
              className=" m-2 cursor-pointer"
              title={option}
              //   itemId={option} // NOTE: itemId is required for track items
              key={option}
              onClick={handleItemClick(option)}
            >
              <Badge variant={option === selected ? "filled" : "outline"}>{option}</Badge>
            </div>
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

export default Filter;
