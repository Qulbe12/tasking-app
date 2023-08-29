import React, { useEffect, useState } from "react";
import { Calendar as CalendarComponent, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Accordion,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { IconCalendar, IconCircleCheck, IconList } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { createCalendar, createEvent, getAllCalendars, getEvents } from "../../redux/api/nylasApi";
import { DatePicker, TimeInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { ICalendar } from "../../interfaces/nylas/ICalendar";
import { IEventCreate } from "../../interfaces/nylas/IEventCreate";
import { showNotification } from "@mantine/notifications";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
  onActionButtonClick: () => void;
};

const EmailCalendar = ({ onActionButtonClick }: EmailCalendarProps) => {
  const { calendars } = useAppSelector((state) => state.nylas);

  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [opened, { open: openCalendarModel, close: closeCalendarModel }] = useDisclosure(false);
  const [checked, setChecked] = useState(false);
  const [eventModelOpened, { open: openEventModel, close: closeEventModel }] = useDisclosure(false);
  const [newCalendar, setNewCalendar] = useState<ICalendar>({
    name: "",
    description: "",
    location: "",
    timezone: "",
  });
  const [calendarId, setCalendarId] = useState("");

  const [event, setEvent] = useState<IEventCreate>({
    title: "",
    calendar_id: "",
    visibility: "normal",
    description: "",
    location: "",
    busy: false,
    when: {
      time: null,
      timezone: "",
    },
  });

  const addCalendar = () => {
    dispatch(createCalendar(newCalendar));
    closeCalendarModel();
  };
  const addEvent = () => {
    if (event.calendar_id != null) {
      dispatch(createEvent(event));
      closeEventModel();
    }
  };

  const onChangeAccordion = (value: string) => {
    setEvent({ ...event, calendar_id: value });
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
                openEventModel();
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
          <Button onClick={openCalendarModel} leftIcon={<IconCalendar />} my="md">
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
      <Modal opened={opened} onClose={closeCalendarModel} title="Add calendar">
        <Stack>
          <TextInput
            withAsterisk
            label="Calendar name"
            onChange={(e) => {
              setNewCalendar({ ...newCalendar, name: e.target.value });
            }}
          />
          <TextInput
            withAsterisk
            label="Description"
            onChange={(e) => {
              setNewCalendar({ ...newCalendar, description: e.target.value });
            }}
          />
          <TextInput
            withAsterisk
            label="Location"
            onChange={(e) => {
              setNewCalendar({ ...newCalendar, location: e.target.value });
            }}
          />
          <TextInput
            withAsterisk
            label="Time zone"
            onChange={(e) => {
              setNewCalendar({ ...newCalendar, timezone: e.target.value });
            }}
          />
          <Group position="right" mt="md">
            <Button type="submit" onClick={addCalendar}>
              Add Calendar
            </Button>
          </Group>
        </Stack>
      </Modal>
      {/* Add Event model*/}
      <Modal opened={eventModelOpened} onClose={closeEventModel} title="Add event">
        <Stack>
          <TextInput
            withAsterisk
            label="Event title"
            onChange={(e) => {
              setEvent({ ...event, title: e.target.value });
            }}
          />
          <TextInput
            withAsterisk
            label="Description"
            onChange={(e) => {
              setEvent({ ...event, description: e.target.value });
            }}
          />
          <TextInput
            withAsterisk
            label="Location"
            onChange={(e) => {
              setEvent({ ...event, location: e.target.value });
            }}
          />
          <Flex justify="space-between">
            <DatePicker w="45%" label="Event start date" />
            <DatePicker w="45%" label="Event end date" />
          </Flex>
          <Flex justify="space-between">
            <TimeInput
              label="From"
              onChange={(d) => {
                const date = new Date(d);
                const unixTimestamp = Math.floor(date.getTime() / 1000);
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                setEvent({ ...event, when: { time: unixTimestamp, timezone: timeZone } });
              }}
              w="20%"
              maw={400}
            />
            <Select
              w="20%"
              data={[
                { value: "AM", label: "AM" },
                { value: "PM", label: "PM" },
              ]}
              label="AM/PM"
            />
            <TimeInput w="20%" label="To" maw={400} />
            <Select
              w="20%"
              data={[
                { value: "AM", label: "AM" },
                { value: "PM", label: "PM" },
              ]}
              label="AM/PM"
            />
          </Flex>
          <Switch
            label="Busy"
            checked={checked}
            onChange={(event) => {
              setChecked(event.currentTarget.checked);
            }}
          />
          <Group position="right" mt="md">
            <Button type="submit" onClick={addEvent}>
              Add Event
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default EmailCalendar;
