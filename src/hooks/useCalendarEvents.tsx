import { useMemo } from "react";
import { useAppSelector } from "../redux/store";
import { ICalendarEvent } from "../interfaces/nylas/ICalendarEvents";

const useCalendarEvents = () => {
  const { events } = useAppSelector((state) => state.nylas);

  const calendarEvents = useMemo(() => {
    return events.map((e) => {
      const unixStartTimestamp = parseInt(e?.when?.start_time?.toString() || "0", 10);
      const startDate = new Date(unixStartTimestamp * 1000);

      const unixEndTimestamp = parseInt(e?.when?.end_time?.toString(), 10);
      const endDate = new Date(unixEndTimestamp * 1000);

      const event: ICalendarEvent = {
        start: startDate,
        end: endDate,
        title: e.title,
        resource: e,
      };
      return event;
    });
  }, [events]);

  return { calendarEvents };
};

export default useCalendarEvents;
