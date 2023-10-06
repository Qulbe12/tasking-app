import React, { useCallback, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Button, Flex, Modal, NavLink, ScrollArea } from "@mantine/core";
import CommonModalProps from "./CommonModalProps";
import { getAllThreads, updateThread } from "../redux/api/nylasApi";

interface NestedFolder {
  id: string;
  display_name: string;
  nestedChildren?: NestedFolder[];
}

type FoldersListProps = {
  selectedThreadId?: string | null | undefined;
};

const FoldersListModal = ({
  selectedThreadId,
  opened,
  onClose,
}: FoldersListProps & CommonModalProps) => {
  const { folders } = useAppSelector((state) => state.nylas);
  const [folderId, setFolderId] = useState("");
  const dispatch = useAppDispatch();

  // const [value, setValue] = useState<string | null>(null);

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
    setFolderId(value);
  }, []);

  return (
    <Modal opened={opened} onClose={onClose}>
      <ScrollArea h="100%">
        {preppedFolders.map((folder) => (
          <RecursiveNavLink
            key={folder.id}
            id={folder.id}
            display_name={folder.display_name}
            nestedChildren={folder.nestedChildren}
            selectedId={selectedThreadId}
            onFolderSelect={handleFolderSelect}
            active={folder.id === folderId}
            folderId={folderId}
          />
        ))}
      </ScrollArea>
      <Flex w="100%" justify="flex-end">
        <Button
          onClick={() => {
            dispatch(updateThread({ id: selectedThreadId, starred: false, folder_id: folderId }));
            dispatch(getAllThreads({ in: folderId }));
            onClose();
          }}
        >
          Move to folder
        </Button>
      </Flex>
    </Modal>
  );
};

function RecursiveNavLink({
  id,
  display_name,
  nestedChildren,
  selectedId,
  onFolderSelect,
  active,
  folderId,
}: // onFolderSelect,
NestedFolder & {
  selectedId: string | null | undefined;
  onFolderSelect: (id: string) => void;
  active: boolean;
  folderId: string;
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
      active={active}
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
            active={child.id === folderId}
            folderId={child.id}
          />
        ))}
    </NavLink>
  );
}

export default FoldersListModal;
