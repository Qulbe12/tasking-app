import { useMemo } from "react";
import { useAppSelector } from "../redux/store";
import { ICalendarEvent } from "../interfaces/nylas/ICalendarEvents";

const useCalendarEvents = () => {
  const { events } = useAppSelector((state) => state.nylas);

  const calendarEvents = useMemo(() => {
    return events.map((e) => {
      const resource = e;
      const { when, title } = resource;

      let start = new Date();
      let end = new Date();

      if (when.object === "timespan") {
        start = new Date(when.start_time * 1000);
        end = new Date(when.end_time * 1000);
      }

      if (when.object === "time") {
        start = new Date(when.time * 1000);
        end = new Date(when.time * 1000);
      }

      const event: ICalendarEvent = { start, end, title: title + "asd", resource };

      return event;
    });
  }, [events]);

  return { calendarEvents };
};

export default useCalendarEvents;
