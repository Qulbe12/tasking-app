import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Accordion, ScrollArea } from "@mantine/core";
import { getAllThreads } from "../../../redux/api/nylasApi";
import {
  IThreadExpandedResponse,
  IThreadResponse,
} from "../../../interfaces/nylas/IThreadResponse";

interface NestedFolder {
  id: string;
  display_name: string;
  children?: NestedFolder[] | undefined;
}

type FoldersListProps = {
  onThreadClick: (thread: IThreadExpandedResponse | IThreadResponse) => void;
  selectedThreadId: string | null;
};

const FoldersList = ({ onThreadClick, selectedThreadId }: FoldersListProps) => {
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
          currentLevel = existingFolder.children || (existingFolder.children = []);
        } else {
          const newFolder: NestedFolder = { id: item.id, display_name: folder };
          if (index === folders.length - 1) {
            newFolder.children = [];
          }
          currentLevel?.push(newFolder);
          currentLevel = newFolder.children;
        }
      });
    });
    console.log("nested array", nestedArray);
    return nestedArray;
  }, [folders]);

  useEffect(() => {
    if (!value) return;
    dispatch(getAllThreads({ in: value }));
  }, [value]);

  return (
    <ScrollArea h="100%">
      <Accordion
        defaultValue="inbox"
        disableChevronRotation
        chevronPosition="left"
        variant="contained"
        onChange={(value) => {
          setValue(value);
          console.log(value);
        }}
        value={value}
      >
        {preppedFolders.map((f) => {
          return (
            <Accordion.Item value={f.display_name} key={f.id}>
              <Accordion.Control>{f.display_name}</Accordion.Control>
              {value && (
                <Accordion
                  onChange={setValue}
                  value={value}
                  disableChevronRotation
                  chevronPosition="left"
                  variant="contained"
                >
                  {f.children &&
                    f.children?.map((c) => {
                      return (
                        <Accordion.Item key={c.id} value={c.display_name}>
                          <Accordion.Control style={{ marginLeft: "16px" }}>
                            {c.display_name}
                          </Accordion.Control>
                        </Accordion.Item>
                      );
                    })}
                </Accordion>
              )}
            </Accordion.Item>
          );
        })}
      </Accordion>
      {/* <Accordion */}
      {/*   chevronPosition="left" */}
      {/*   variant="contained" */}
      {/*   defaultValue="inbox" */}
      {/*   value={value} */}
      {/*   onChange={setValue} */}
      {/* > */}

      {/* {folders.map((f) => { */}
      {/*   return ( */}
      {/*     <Accordion.Item key={f.id} value={f.display_name}> */}
      {/*       <Accordion.Control>{f.display_name}</Accordion.Control> */}
      {/*     </Accordion.Item> */}
      {/*   ); */}
      {/* })} */}
      {/* </Accordion> */}
    </ScrollArea>
  );
};

export default FoldersList;
