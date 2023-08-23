import React, { useState } from "react";
import { Calendar as CalendarComponent, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Group } from "@mantine/core";
import { IconList } from "@tabler/icons";
import { useAppDispatch } from "../../redux/store";
import { getCalendars } from "../../redux/api/nylasApi";

const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
  onActionButtonClick: () => void;
};

const EmailCalendar = ({ onActionButtonClick }: EmailCalendarProps) => {
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  return (
    <div>
      {dayjs(selectedDate).format("MM")}
      <Group position="right" my="md">
        <Button onClick={onActionButtonClick} leftIcon={<IconList />}>
          Emails
        </Button>
      </Group>
      <Button
        onClick={() => {
          dispatch(getCalendars());
        }}
      >
        Get Cals
      </Button>
      <CalendarComponent
        localizer={localizer}
        onSelectSlot={(e) => {
          setSelectedDate(e.start);
          if (e.action === "doubleClick") {
            console.log(e.start);
          }
        }}
        selectable
        startAccessor="start"
        endAccessor="end"
        style={{ height: "85vh" }}
      />
    </div>
  );
};

export default EmailCalendar;
