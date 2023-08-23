import React, { useEffect } from "react";
import { Calendar as CalendarComponent, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
// import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import { Button, Group } from "@mantine/core";
import { IconList } from "@tabler/icons";
import { useAppDispatch } from "../../redux/store";
import { getAllCalendars } from "../../redux/api/nylasApi";

const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
  onActionButtonClick: () => void;
};

const EmailCalendar = ({ onActionButtonClick }: EmailCalendarProps) => {
  const dispatch = useAppDispatch();
  // const { calendars } = useAppSelector((state) => state.nylas);
  useEffect(() => {
    dispatch(getAllCalendars);
  }, []);

  return (
    <div>
      <Group position="right" my="md">
        <Button onClick={onActionButtonClick} leftIcon={<IconList />}>
          Emails
        </Button>
      </Group>
      <CalendarComponent
        localizer={localizer}
        // events={calendars?.map((e) => {
        //   return {
        //     start: new Date(),
        //     end: new Date(),
        //     title: email.subject,
        //     ...email,
        //   };
        // })}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default EmailCalendar;
