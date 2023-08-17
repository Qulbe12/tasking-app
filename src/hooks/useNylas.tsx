import { AxiosRequestConfig } from "axios";
import { axiosPrivate } from "../config/axios";
import { useAppSelector } from "../redux/store";
import { useMemo, useState } from "react";
import { IFolderResponse } from "../interfaces/nylas/IFolderResponse";
import { IThreadResponse } from "../interfaces/nylas/IThreadResponse";
import { IErrorResponse } from "../interfaces/IErrorResponse";
import { showError } from "../redux/commonSliceFunctions";

const useNylas = () => {
  const { nylasToken } = useAppSelector((state) => state.nylas);

  const customConfig: AxiosRequestConfig<any> | undefined = useMemo(() => {
    return {
      headers: {
        "nylas-token": nylasToken?.access_token,
      },
    };
  }, [nylasToken]);

  const getFolders = async () => {
    const res = await axiosPrivate.get<IFolderResponse[]>("/nylas/folders", customConfig);
    return res.data;
  };

  const [threads, setThreads] = useState<IThreadResponse[]>([]);
  const [gettingThreads, setGettingThreads] = useState(false);

  const getThreads = async (args?: { folder?: string; limit?: number }) => {
    setGettingThreads(true);
    try {
      const res = await axiosPrivate.get<IThreadResponse[]>(
        `/nylas/threads?folder=${args?.folder || "All"}&limit=${args?.limit || 5000}`,
        customConfig,
      );

      setThreads(res.data);
      setGettingThreads(false);
      return res.data;
    } catch (err) {
      const error: IErrorResponse = err as unknown as IErrorResponse;
      setGettingThreads(false);
      showError(error.response?.data.message);
    }
  };

  return { getThreads, getFolders, gettingThreads, threads };
};

export default useNylas;
