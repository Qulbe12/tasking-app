import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Card, NavLink, ScrollArea } from "@mantine/core";
import { deleteFolderById, getAllThreads, getFolderById } from "../../../redux/api/nylasApi";
import { useDisclosure } from "@mantine/hooks";
import CreateFolderModal from "../../../modals/CreateFolderModel";

interface NestedFolder {
  id: string;
  display_name: string;
  nestedChildren?: NestedFolder[];
}

const FoldersList = () => {
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

  const handleFolderSelect = useCallback(
    (value: string) => {
      setValue(value);
    },
    [value],
  );

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
  onFolderSelect,
}: NestedFolder & {
  selectedId: string | null;
  onFolderSelect: (id: string) => void;
}) {
  const handleFolderClick = () => {
    onFolderSelect(id);
  };
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [opened, { open, close }] = useDisclosure();
  const dispatch = useAppDispatch();

  const handleContextMenu = (e: any) => {
    e.preventDefault();

    if (contextMenuVisible) {
      setContextMenuVisible(false);
    } else {
      setContextMenuVisible(true);
    }
    setContextMenuPosition({ top: e.clientY, left: e.clientX });
  };

  const removeFolder = () => {
    setContextMenuVisible(false);
    dispatch(deleteFolderById({ id: id }));
  };
  const addFolder = () => {
    setContextMenuVisible(false);
    open();
  };

  const hasNested = nestedChildren && nestedChildren.length > 0;

  return (
    <>
      <NavLink
        onContextMenu={handleContextMenu}
        active={selectedId === id}
        variant="filled"
        key={id}
        label={display_name}
        childrenOffset={hasNested ? 28 : undefined}
        onClick={() => {
          setContextMenuVisible(false);
          handleFolderClick();
        }}
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
      {contextMenuVisible && (
        <>
          <Card
            style={{
              position: "fixed",
              top: contextMenuPosition.top,
              left: contextMenuPosition.left,
            }}
          >
            <NavLink onClick={removeFolder} label="Remove" />
            <NavLink onClick={addFolder} label="Add new folder" />
          </Card>
        </>
      )}
      <CreateFolderModal opened={opened} onClose={close} title="Create folder" />
    </>
  );
}

export default FoldersList;
