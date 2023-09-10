import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Accordion, ScrollArea } from "@mantine/core";
import { getAllThreads } from "../../../redux/api/nylasApi";
import {
  IThreadExpandedResponse,
  IThreadResponse,
} from "../../../interfaces/nylas/IThreadResponse";

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

  useEffect(() => {
    if (!value) return;
    dispatch(getAllThreads({ in: value }));
  }, [value]);

  useEffect(() => {
    console.log("folders", folders);
  }, []);

  return (
    <ScrollArea h="100%">
      <FolderList folders={folders} />
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

  function FolderList({ folders }: any) {
    return (
      <Accordion
        chevronPosition="left"
        variant="contained"
        defaultValue="inbox"
        value={value}
        onChange={setValue}
      >
        {folders.map((folder: any, index: any) => {
          const nestedFolders = folder.display_name.split("\\");
          console.log(nestedFolders);
          if (nestedFolders.length > 1) {
            // This folder has nested folders
            const parentFolder = nestedFolders[0];
            const nestedFolder = nestedFolders.slice(1).join("\\");

            return (
              <Accordion.Item key={index} value={folder.display_name}>
                <Accordion.Control>{parentFolder}</Accordion.Control>
                <FolderList folders={[{ display_name: nestedFolder }]} />
              </Accordion.Item>
            );
          } else {
            // This folder does not have nested folders
            return (
              <Accordion.Item value={folder.display_name} key={index}>
                <Accordion.Control>{folder.display_name}</Accordion.Control>
              </Accordion.Item>
            );
          }
        })}
      </Accordion>
    );
  }
};

export default FoldersList;
