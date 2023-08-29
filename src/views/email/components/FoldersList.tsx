import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Accordion, Loader, ScrollArea } from "@mantine/core";
import { getAllThreads } from "../../../redux/api/nylasApi";
import ThreadCard from "../../../components/ThreadCard";
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
  const { folders, loaders, threads } = useAppSelector((state) => state.nylas);

  const [value, setValue] = useState<string | null>(null);

  const filteredFolders = useMemo(() => {
    const encounteredDisplayNames: Record<string, unknown> = {};

    const filteredArray = folders.filter((obj) => {
      if (!encounteredDisplayNames[obj.name]) {
        encounteredDisplayNames[obj.name] = true;
        return true;
      }
      return false;
    });

    return filteredArray;
  }, [folders]);

  useEffect(() => {
    if (!value) return;

    dispatch(getAllThreads({ in: value }));
  }, [value]);

  return (
    <ScrollArea h="100%">
      <Accordion
        chevronPosition="left"
        variant="contained"
        defaultValue="inbox"
        value={value}
        onChange={setValue}
      >
        {filteredFolders.map((f) => {
          return (
            <Accordion.Item key={f.id} value={f.name ?? f.object}>
              <Accordion.Control>{f.display_name}</Accordion.Control>
              <Accordion.Panel>
                {loaders.gettingThreads ? (
                  <Loader />
                ) : (
                  threads.map((t) => {
                    return (
                      <ThreadCard
                        thread={t}
                        key={t.id}
                        selectedThreadId={selectedThreadId}
                        onClick={() => onThreadClick(t)}
                      />
                    );
                  })
                )}
              </Accordion.Panel>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </ScrollArea>
  );
};

export default FoldersList;
