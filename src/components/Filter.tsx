import { Badge } from "@mantine/core";
import React, { useEffect } from "react";
import useDrag from "../hooks/useDrag";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { LeftArrow, RightArrow } from "./FilterArrows";
import { generateDocumentColor } from "../utils/generateDocumentColor";

type FilterProps = {
  options: string[];
  onChange: (vals: string[]) => void;
  singleSelection?: boolean;
};

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const Filter = ({ options, onChange, singleSelection }: FilterProps) => {
  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  const handleDrag =
    ({ scrollContainer }: scrollVisibilityApiType) =>
    (ev: React.MouseEvent) =>
      dragMove(ev, (posDiff) => {
        if (scrollContainer.current) {
          scrollContainer.current.scrollLeft += posDiff;
        }
      });

  const [selected, setSelected] = React.useState<string[]>([]);

  const handleItemClick = (itemId: string) => () => {
    if (dragging) {
      return false;
    }
    const newSelected = JSON.parse(JSON.stringify(selected));
    if (newSelected.includes(itemId)) {
      const index = newSelected.indexOf(itemId);
      singleSelection ? (newSelected.length = 0) : newSelected.splice(index, 1);
    } else {
      singleSelection ? (newSelected[0] = itemId) : newSelected.push(itemId);
    }

    setSelected(newSelected);
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

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
              className="cursor-pointer m-1"
              title={option}
              //   itemId={option} // NOTE: itemId is required for track items
              key={option}
              onClick={handleItemClick(option)}
            >
              <Badge
                variant={selected.includes(option) ? "filled" : "outline"}
                color={generateDocumentColor(option)}
              >
                {option}
              </Badge>
            </div>
          ))}
        </ScrollMenu>
      </div>
    </div>
  );
};

export default Filter;
