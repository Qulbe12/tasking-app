import { useEffect, useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { NavLink, ScrollArea } from "@mantine/core";
import { getAllThreads } from "../../../redux/api/nylasApi";

interface NestedFolder {
  id: string;
  display_name: string;
  nestedChildren?: NestedFolder[];
}

type FoldersListProps = {
  selectedThreadId: string | null;
};

const FoldersList = ({ selectedThreadId }: FoldersListProps) => {
  const dispatch = useAppDispatch();
  const { folders } = useAppSelector((state) => state.nylas);
  const [value, setValue] = useState<string | null>(null);

  const preppedFolders = useMemo(() => {
    const nestedArray: NestedFolder[] = [];

    folders.forEach((item) => {
      const displayNames = item.display_name.split("/");
      let currentLevel = nestedArray;

      displayNames.forEach((name) => {
        const existingItem = currentLevel.find((obj) => obj.display_name === name);

        if (existingItem) {
          currentLevel = existingItem.nestedChildren || (existingItem.nestedChildren = []);
        } else {
          const newItem: NestedFolder = { id: item.id, display_name: name };
          currentLevel.push(newItem);
          currentLevel = newItem.nestedChildren || (newItem.nestedChildren = []);
        }
      });
    });

    nestedArray.forEach((folder) => {
      if (folder.id === folder.display_name) {
        delete folder.nestedChildren;
      }
    });

    return nestedArray;
  }, [folders]);

  const handleFolderSelect = useCallback((value: string) => {
    setValue(value);
  }, []);

  useEffect(() => {
    if (value) {
      dispatch(getAllThreads({ in: value }));
    }
  }, [value]);

  return (
    <ScrollArea h="100%">
      {preppedFolders.map((folder) => (
        <RecursiveNavLink
          key={folder.id}
          id={folder.id}
          display_name={folder.display_name}
          nestedChildren={folder.nestedChildren}
          selectedId={selectedThreadId}
          onFolderSelect={handleFolderSelect}
        />
      ))}
    </ScrollArea>
  );
};

function RecursiveNavLink({
  id,
  display_name,
  nestedChildren,
  selectedId,
  onFolderSelect,
}: NestedFolder & {
  selectedId: string | null;
  onFolderSelect: (id: string) => void;
}) {
  const handleFolderClick = () => {
    onFolderSelect(id);
  };

  const isActive = id === selectedId;

  const hasNested = nestedChildren && nestedChildren.length > 0;

  return (
    <NavLink
      variant="filled"
      key={id}
      label={display_name}
      childrenOffset={hasNested ? 28 : undefined}
      color={isActive ? "blue" : undefined}
      onClick={handleFolderClick}
    >
      {hasNested &&
        nestedChildren?.map((child) => (
          <RecursiveNavLink
            key={child.id}
            id={child.id}
            display_name={child.display_name}
            nestedChildren={child.nestedChildren || []}
            selectedId={selectedId}
            onFolderSelect={onFolderSelect}
          />
        ))}
    </NavLink>
  );
}

export default FoldersList;
