import React, { useEffect, useState } from "react";
import { Calendar as CalendarComponent, dayjsLocalizer, Event } from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Loader,
  Menu,
  Text,
} from "@mantine/core";
import { IconCalendar, IconCircleCheck, IconDots, IconList } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { deleteCalendar, getAllCalendars, getEvents } from "../../redux/api/nylasApi";
import { DatePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import AddEventCalendar from "../../modals/AddEventCalendar";
import AddCalendarModel from "../../modals/AddCalendarModel";
import { openConfirmModal } from "@mantine/modals";
import { IconCircleCheckFilled } from "@tabler/icons-react";

const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
  onActionButtonClick: () => void;
};

const EmailCalendar = ({ onActionButtonClick }: EmailCalendarProps) => {
  const { calendars, calendarEvents, loaders } = useAppSelector((state) => state.nylas);

  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [openCalendarModel, { toggle: calendarModelToggle }] = useDisclosure(false);
  const [addEventModelOpened, { toggle: addEventModelToggle }] = useDisclosure(false);
  const [updateEventModelOpened, { toggle: updateEventModelToggle }] = useDisclosure(false);
  const [calendarId, setCalendarId] = useState("");
  const [calendarEvent, setCalendarEvent] = useState<Event>({});

  const onChangeAccordion = (value: string) => {
    dispatch(getEvents(value));
    setCalendarId(value);
  };

  useEffect(() => {
    dispatch(getAllCalendars());
    calendars.map((c) => {
      if (c.name === "Calender") {
        setCalendarId(c.id);
      }
    });
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
        <Card withBorder h="82%" w="82%">
          <CalendarComponent
            onSelectEvent={(event) => {
              setCalendarEvent(event);
              updateEventModelToggle();
            }}
            events={calendarEvents && calendarEvents}
            localizer={localizer}
            onSelectSlot={(e) => {
              setSelectedDate(e.start);
              if (e.action === "doubleClick") {
                if (calendarId !== null && calendarId !== "") {
                  addEventModelToggle();
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
            style={{ height: "100%", width: "100%" }}
          />
        </Card>
        <div style={{ width: "15%", height: "68vh" }}>
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
          <Card withBorder h="100%">
            <Accordion chevron={""} defaultValue="customization" onChange={onChangeAccordion}>
              {calendars.map((c, i) => {
                console.log("calendar id", c.id);
                return (
                  <Accordion.Item key={i} value={c.id}>
                    {loaders.gettingEvents ? (
                      <AccordionControl
                        id={c.id}
                        icon={c.id === calendarId ? <Loader size="sm" /> : <IconCircleCheck />}
                      >
                        {c.name}
                      </AccordionControl>
                    ) : (
                      <AccordionControl
                        id={c.id}
                        icon={c.id === calendarId ? <IconCircleCheckFilled /> : <IconCircleCheck />}
                      >
                        {c.name}
                      </AccordionControl>
                    )}
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Card>
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
        opened={addEventModelOpened}
        onClose={() => addEventModelToggle()}
      />
      {/* update Event model*/}
      <AddEventCalendar
        title={"Update event"}
        event={calendarEvent}
        calendarId={calendarId}
        opened={updateEventModelOpened}
        onClose={() => updateEventModelToggle()}
      />
    </div>
  );

  function AccordionControl(props: AccordionControlProps) {
    const dispatch = useAppDispatch();
    const openModal = () =>
      openConfirmModal({
        title: "Remove calendar",
        children: <Text size="sm">Are you sure?</Text>,
        centered: true,
        labels: { confirm: "Confirm", cancel: "Cancel" },
        onConfirm: async () => {
          await dispatch(deleteCalendar({ calendarId: props.id }));
          await dispatch(getAllCalendars());
        },
      });

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Accordion.Control {...props} />
        <Menu position="left-start" offset={0}>
          <Menu.Target>
            <ActionIcon size="lg">
              <IconDots size={"16px"} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={openModal}>Remove</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Box>
    );
  }
};

export default EmailCalendar;
