import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Card, NavLink, ScrollArea } from "@mantine/core";
import { deleteFolderById, getAllThreads, getFolderById } from "../../../redux/api/nylasApi";
import { useDisclosure } from "@mantine/hooks";
import CreateFolderModal from "../../../modals/CreateFolderModel";

interface NestedFolder {
  id: string;
  display_name: string;
  name: string;
  nestedChildren?: NestedFolder[];
}

type FoldersListProps = {
  selectedThreadId: string | null;
};

const FoldersList = ({ selectedThreadId }: FoldersListProps) => {
  const dispatch = useAppDispatch();
  const { folders } = useAppSelector((state) => state.nylas);
  const [value, setValue] = useState<string | null>(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  useEffect(() => {
    const handleWindowClick = () => {
      setContextMenuVisible(false);
    };
    if (contextMenuVisible) {
      window.addEventListener("click", handleWindowClick);
    } else {
      window.removeEventListener("click", handleWindowClick);
    }

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, [contextMenuVisible]);

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
          const newItem: NestedFolder = { id: item.id, display_name: name, name: item.name };
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
  const handleContextChange = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuVisible((o) => !o);
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
  };

  useEffect(() => {
    if (value) {
      dispatch(getAllThreads({ in: value }));
      dispatch(getFolderById({ id: value }));
    }
  }, [value]);

  return (
    <ScrollArea h="100%">
      {preppedFolders.map((folder) => (
        <RecursiveNavLink
          folderRemove={() => {
            dispatch(deleteFolderById({ id: folder.id }));
          }}
          contextPosition={contextMenuPosition}
          contextVisible={contextMenuVisible}
          onContextClick={handleContextChange}
          name={folder.name}
          key={folder.id}
          id={folder.id}
          display_name={folder.display_name}
          nestedChildren={folder.nestedChildren}
          selectedId={value}
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
  name,
  onFolderSelect,
  onContextClick,
  contextVisible,
  contextPosition,
  folderRemove,
}: NestedFolder & {
  selectedId: string | null;
  onFolderSelect: (id: string) => void;
  onContextClick: (e: React.MouseEvent) => void;
  contextVisible: boolean;
  contextPosition: { top: number; left: number };
  folderRemove: () => void;
}) {
  const handleFolderClick = () => {
    onFolderSelect(id);
  };
  const handleContextClick = (e: React.MouseEvent) => {
    onContextClick(e);
  };

  const [opened, { open, close }] = useDisclosure();

  useEffect(() => {
    console.log(name);
  }, [name]);

  const handleRemoveFolder = () => {
    folderRemove();
  };
  const addFolder = () => {
    open();
  };

  const hasNested = nestedChildren && nestedChildren.length > 0;

  return (
    <>
      <NavLink
        onContextMenu={(e) => {
          handleContextClick(e);
        }}
        active={selectedId === id}
        variant="filled"
        key={id}
        label={display_name}
        childrenOffset={hasNested ? 28 : undefined}
        onClick={() => {
          handleFolderClick();
        }}
      >
        {hasNested &&
          nestedChildren?.map((child) => (
            <RecursiveNavLink
              folderRemove={handleRemoveFolder}
              contextPosition={contextPosition}
              contextVisible={contextVisible}
              onContextClick={onContextClick}
              name={child.name}
              key={child.id}
              id={child.id}
              display_name={child.display_name}
              nestedChildren={child.nestedChildren || []}
              selectedId={selectedId}
              onFolderSelect={onFolderSelect}
            />
          ))}
      </NavLink>
      {contextVisible && (
        <>
          <Card
            withBorder
            style={{
              position: "fixed",
              top: contextPosition.top,
              left: contextPosition.left,
              zIndex: 999,
            }}
          >
            <NavLink disabled={name !== null} onClick={folderRemove} label="Remove" />
            <NavLink onClick={addFolder} label="Add new folder" />
          </Card>
        </>
      )}
      <CreateFolderModal opened={opened} onClose={close} title="Create folder" />
    </>
  );
}

export default FoldersList;
