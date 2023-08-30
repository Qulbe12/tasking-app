import React, { useEffect, useState } from "react";
import { Calendar as CalendarComponent, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import { Accordion, Button, Flex, Group } from "@mantine/core";
import { IconCalendar, IconCircleCheck, IconList } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getAllCalendars, getEvents } from "../../redux/api/nylasApi";
import { DatePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import AddEventCalendar from "../../modals/AddEventCalendar";
import AddCalendarModel from "../../modals/AddCalendarModel";

const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
  onActionButtonClick: () => void;
};

const EmailCalendar = ({ onActionButtonClick }: EmailCalendarProps) => {
  const { calendars } = useAppSelector((state) => state.nylas);

  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [openCalendarModel, { toggle: calendarModelToggle }] = useDisclosure(false);

  const [eventModelOpened, { toggle: eventModelToggle }] = useDisclosure(false);

  const [calendarId, setCalendarId] = useState("");

  const onChangeAccordion = (value: string) => {
    dispatch(getEvents(value));
    setCalendarId(value);
  };

  useEffect(() => {
    dispatch(getAllCalendars());
    setCalendarId("");
  }, []);

  return (
    <div>
      {dayjs(selectedDate).format("MM")}
      <Group position="right" my="md">
        <Button onClick={onActionButtonClick} leftIcon={<IconList />}>
          Emails
        </Button>
      </Group>
      <Flex justify="space-between" h="100vh">
        <CalendarComponent
          localizer={localizer}
          onSelectSlot={(e) => {
            setSelectedDate(e.start);
            if (e.action === "doubleClick") {
              if (calendarId !== null && calendarId !== "") {
                eventModelToggle();
              }
              if (calendarId == null || calendarId == "") {
                showNotification({
                  title: "Select Calendar",
                  message: "Please select the calendar to add event",
                });
              }
            }
          }}
          selectable
          startAccessor="start"
          endAccessor="end"
          style={{ height: "82%", width: "84%" }}
        />
        <div style={{ width: "15%" }}>
          <DatePicker
            label="Calendar"
            value={date}
            onChange={(e) => {
              if (!e) return;
              setDate(e);
            }}
          />
          <Button onClick={calendarModelToggle} leftIcon={<IconCalendar />} my="md">
            Add calendar
          </Button>
          <Accordion chevron={""} defaultValue="customization" onChange={onChangeAccordion}>
            {calendars.map((c, i) => {
              return (
                <Accordion.Item key={i} value={c.id}>
                  <Accordion.Control
                    icon={c.id === calendarId ? <IconCircleCheckFilled /> : <IconCircleCheck />}
                  >
                    {c.name}
                  </Accordion.Control>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div>
      </Flex>
      {/* Add calendar model*/}
      <AddCalendarModel
        opened={openCalendarModel}
        onClose={calendarModelToggle}
        title={"Add calendar"}
      />
      {/* Add Event model*/}
      <AddEventCalendar
        title={"Add event"}
        calendarId={calendarId}
        opened={eventModelOpened}
        onClose={() => eventModelToggle()}
      />
    </div>
  );
};

export default EmailCalendar;
