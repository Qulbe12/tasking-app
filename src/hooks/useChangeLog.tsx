import { axiosPrivate } from "../config/axios";
import { showNotification } from "@mantine/notifications";
import { IChangelog } from "../interfaces/IChangelog";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const useChangeLog = () => {
  const { t } = useTranslation();
  const [changeLog, setChangeLog] = useState<IChangelog[]>([]);
  const [gettingChangeLog, setLoading] = useState(false);

  const getChangeLog = async (id: string) => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get<IChangelog[]>(`change-logs/${id}`);
      setChangeLog(res.data);
    } catch (err) {
      console.error(err);
      showNotification({
        color: "red",
        message: t("errorGettingComments"),
      });
    } finally {
      setLoading(false);
    }
  };

  return { getChangeLog, changeLog, gettingChangeLog };
};

export default useChangeLog;
