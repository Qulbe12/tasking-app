import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Accordion, ScrollArea } from "@mantine/core";
import { getAllThreads } from "../../../redux/api/nylasApi";
// import {
//   IThreadExpandedResponse,
//   IThreadResponse,
// } from "../../../interfaces/nylas/IThreadResponse";

interface NestedFolder {
  id: string;
  display_name: string;
  child?: NestedFolder[] | undefined;
}

// type FoldersListProps = {
//   onThreadClick: (thread: IThreadExpandedResponse | IThreadResponse) => void;
//   selectedThreadId: string | null;
// };

const FoldersList = (/* { onThreadClick, selectedThreadId }: FoldersListProps*/) => {
  const dispatch = useAppDispatch();
  const { folders } = useAppSelector((state) => state.nylas);

  const [value, setValue] = useState<string | null>(null);

  // const filteredFolders = useMemo(() => {
  //   const modifiedData = folders.map((item) => {
  //     if (item.display_name && item.display_name.includes("\\")) {
  //       return {
  //         ...item,
  //         display_name: item.display_name.split("\\").map((value) => value.trim()),
  //       };
  //     }
  //     return item;
  //   });
  //   return modifiedData;
  // }, [folders]);

  const preppedFolders = useMemo<NestedFolder[]>(() => {
    const nestedArray: NestedFolder[] = [];

    folders.forEach((item) => {
      const folders = item.display_name.split("\\");
      let currentLevel: NestedFolder[] | undefined = nestedArray;

      folders.forEach((folder, index) => {
        const existingFolder = currentLevel?.find((obj) => obj.display_name === folder);

        if (existingFolder) {
          currentLevel = existingFolder.child || (existingFolder.child = []);
        } else {
          const newFolder: NestedFolder = { id: item.id, display_name: folder };
          if (index === folders.length - 1) {
            newFolder.child = [];
          }
          currentLevel?.push(newFolder);
          currentLevel = newFolder.child;
        }
      });
    });
    return nestedArray;
  }, [folders]);

  useEffect(() => {
    if (!value) return;
    dispatch(getAllThreads({ in: value }));
  }, [value]);

  return (
    <ScrollArea h="100%">
      {preppedFolders.map((value) => {
        return (
          <RecursiveAcord
            key={value.id}
            id={value.id}
            display_name={value.display_name}
            child={value.child}
          />
        );
      })}
    </ScrollArea>
  );

  function RecursiveAcord({ id, display_name, child }: NestedFolder) {
    console.log("display name", display_name);
    console.log(Object.getOwnPropertyNames(child));

    return (
      <Accordion
        chevron={" "}
        defaultValue="inbox"
        disableChevronRotation
        chevronPosition="left"
        variant="contained"
        onChange={(value) => {
          setValue(value);
        }}
        value={value}
      >
        <Accordion.Item mx={7} value={display_name} key={id}>
          <Accordion.Control>{display_name}</Accordion.Control>
          {child &&
            child?.length > 0 &&
            child.map((v) => {
              return (
                <RecursiveAcord
                  key={v.id}
                  id={v.id}
                  display_name={v.display_name}
                  child={v.child}
                />
              );
            })}
        </Accordion.Item>
      </Accordion>
    );
  }
};

export default FoldersList;
