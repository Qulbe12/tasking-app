import { axiosPrivate } from "../config/axios";
import { showNotification } from "@mantine/notifications";
import { IChangelog } from "../interfaces/IChangelog";
import { useState } from "react";

const useChangeLog = () => {
  const [changeLog, setChangeLog] = useState<IChangelog[]>([]);
  const [gettingChangeLog, setLoading] = useState(false);

  const getChangeLog = async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get<IChangelog[]>(`change-logs/${id}`);
      setChangeLog(res.data);
      console.log(res.data);

      setLoading(false);
    } catch (err) {
      showNotification({
        color: "red",
        message: "Something went wrong while getting comments",
      });
      setLoading(false);
    }
  };

  return { getChangeLog, changeLog, gettingChangeLog };
};

export default useChangeLog;
