import React from "react";
import { Calendar as CalendarComponent, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { IEmailThreadResponse } from "../interfaces/IEmailResponse";

const localizer = dayjsLocalizer(dayjs);

type CalanderProps = {
  emails: IEmailThreadResponse[] | null;
};

const Calendar = ({ emails }: CalanderProps) => {
  return (
    <CalendarComponent
      localizer={localizer}
      events={emails?.map((email) => {
        return {
          start: new Date(),
          end: new Date(),
          title: email.subject,
          ...email,
        };
      })}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  );
};

export default Calendar;
