import { useEffect, useState } from "react";
import { IThreadExpandedResponse } from "../interfaces/nylas/IThreadResponse";
import { nylasAxios } from "../config/nylasAxios";
import { IDocumentResponse } from "../interfaces/documents/IDocumentResponse";

type useGetLinkedThreadsProps = {
  selectedDocument?: IDocumentResponse | null;
};

const useGetLinkedThreads = ({ selectedDocument }: useGetLinkedThreadsProps) => {
  const [linkedThreads, setLinkedThreads] = useState<(IThreadExpandedResponse | null)[]>([]);
  const [gettingThreads, setGettingThreads] = useState(false);

  const getThreadByID = async (threadID: string) => {
    setGettingThreads(true);
    return nylasAxios
      .get<IThreadExpandedResponse>(`/threads/${threadID}?view=expanded`)
      .then((response) => response.data)
      .catch((error) => {
        console.error(
          `Error fetching thread with ID ${threadID}:`,
          error.response?.data || error.message,
        );
        return null; // Return null or some default value for errors
      })
      .finally(() => {
        setGettingThreads(false);
      });
  };

  const fetchThreads = async (
    threadIDs?: string[],
  ): Promise<(IThreadExpandedResponse | null)[]> => {
    if (!threadIDs) return [];
    try {
      const threadsData = await Promise.all(threadIDs.map((threadID) => getThreadByID(threadID)));

      return threadsData;
    } catch (error) {
      console.error("Error fetching threads:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchThreads(selectedDocument?.linkedEmailIds)
      .then((threads) => {
        console.log(threads);

        setLinkedThreads(threads);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedDocument]);

  return { linkedThreads, gettingThreads };
};

export default useGetLinkedThreads;
