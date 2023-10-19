import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar as CalendarComponent, dayjsLocalizer, View } from "react-big-calendar";
import dayjs from "dayjs";

import {
  Accordion,
  AccordionControlProps,
  ActionIcon,
  Box,
  Button,
  Group,
  Loader,
  Menu,
  Text,
} from "@mantine/core";
import { IconCalendar, IconCircleCheck, IconDotsVertical } from "@tabler/icons";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { deleteCalendar, getAllCalendars, getEvents } from "../../redux/api/nylasApi";
import { Calendar } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import AddEventCalendar from "../../modals/AddEventCalendar";
import AddCalendarModel from "../../modals/AddCalendarModel";
import { openConfirmModal } from "@mantine/modals";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import useCalendarEvents from "../../hooks/useCalendarEvents";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./EmailCalendar.scss";
import { ICalendarEvent } from "../../interfaces/nylas/ICalendarEvents";
import UpdateEventModal from "../../modals/UpdateEventModal";

const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
  onActionButtonClick: () => void;
};

const EmailCalendar = ({ onActionButtonClick }: EmailCalendarProps) => {
  const { calendars, loaders } = useAppSelector((state) => state.nylas);
  const { calendarEvents } = useCalendarEvents();

  const dispatch = useAppDispatch();
  const [date, setDate] = useState<Date>(new Date());
  const [openCalendarModel, { toggle: calendarModelToggle }] = useDisclosure(false);
  const [addEventModelOpened, { toggle: addEventModelToggle }] = useDisclosure(false);
  const [updateEventModelOpened, { toggle: updateEventModelToggle }] = useDisclosure(false);
  const [calendarId, setCalendarId] = useState("");
  const [calendarEvent, setCalendarEvent] = useState<ICalendarEvent | undefined>();
  const [selectedView, setSelectedView] = useState<View>("month");

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

  const handleViewChange = useCallback((view: View) => setSelectedView(view), []);

  const handleDateChange = useCallback(
    (type: "today" | "back" | "next") => {
      const currentDate = new Date(date);

      switch (type) {
        case "today":
          setDate(new Date());
          break;
        case "back":
          if (selectedView === "month") {
            currentDate.setMonth(currentDate.getMonth() - 1);
          }
          if (selectedView === "week") {
            currentDate.setDate(currentDate.getDate() - 7);
          }
          if (selectedView === "day") {
            currentDate.setDate(currentDate.getDate() - 1);
          }
          setDate(currentDate);
          break;
        case "next":
          if (selectedView === "month") {
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          if (selectedView === "week") {
            currentDate.setDate(currentDate.getDate() + 7);
          }
          if (selectedView === "day") {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          setDate(currentDate);
          break;
        default:
          break;
      }
    },
    [date, selectedView],
  );

  const calculatedDateString = useMemo(() => {
    switch (selectedView) {
      case "month":
        return dayjs(date).format("MMMM YYYY");
      case "week": {
        const startOfWeek = dayjs(date).startOf("week");
        const endOfWeek = dayjs(date).endOf("week");

        const startMonth = startOfWeek.format("MMMM");
        const endMonth = endOfWeek.format("MMMM");

        if (startMonth === endMonth) {
          return `${startMonth} ${startOfWeek.format("DD")} - ${endOfWeek.format("DD")}`;
        } else {
          return `${startMonth} ${startOfWeek.format("DD")} - ${endMonth} ${endOfWeek.format(
            "DD",
          )}`;
        }
      }
      case "day":
        return dayjs(date).format("dddd MMM DD");

      default:
        return "Invalid Date";
    }
    return "Hello";
  }, [selectedView, date]);

  return (
    <div className="calendar-view">
      <div className="board">
        <Group position="apart" my="md">
          <Button.Group>
            <Button
              variant={date.toDateString() === new Date().toDateString() ? "filled" : "light"}
              onClick={() => handleDateChange("today")}
            >
              Today
            </Button>
            <Button variant="default" onClick={() => handleDateChange("back")}>
              Back
            </Button>
            <Button variant="default" onClick={() => handleDateChange("next")}>
              Next
            </Button>
          </Button.Group>
          {/* {dayjs(date).format("MMMM YYYY")} */}
          {calculatedDateString}
          <Button.Group>
            <Button
              variant={selectedView === "month" ? "filled" : "light"}
              onClick={() => handleViewChange("month")}
            >
              Month
            </Button>
            <Button
              variant={selectedView === "week" ? "filled" : "light"}
              onClick={() => handleViewChange("week")}
            >
              Week
            </Button>
            <Button
              variant={selectedView === "day" ? "filled" : "light"}
              onClick={() => handleViewChange("day")}
            >
              Day
            </Button>
            <Button
              variant={selectedView === "agenda" ? "filled" : "light"}
              onClick={() => handleViewChange("agenda")}
            >
              Agenda
            </Button>
          </Button.Group>
        </Group>
        <CalendarComponent
          view={selectedView}
          toolbar={false}
          onSelectEvent={(event) => {
            setCalendarEvent(event);
            updateEventModelToggle();
          }}
          events={calendarEvents}
          localizer={localizer}
          onSelectSlot={(e) => {
            setDate(e.start);

            if (e.action !== "doubleClick") return;

            if (calendarId !== null && calendarId !== "") {
              addEventModelToggle();
            }
            if (calendarId == null || calendarId == "") {
              showNotification({
                title: "Select Calendar",
                message: "Please select the calendar to add event",
              });
            }
          }}
          selectable
          selected={new Date("2022-03-25")}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%", width: "100%" }}
          date={date}
        />
      </div>
      <div className="board">
        <Calendar
          firstDayOfWeek="sunday"
          value={date}
          month={date}
          onChange={(d) => {
            if (!d) return;
            setDate(d);
          }}
          onMonthChange={(d) => {
            setDate(d);
          }}
        />
        <Button onClick={calendarModelToggle} leftIcon={<IconCalendar />} my="md">
          Add calendar
        </Button>

        <Accordion chevron={""} defaultValue="customization" onChange={onChangeAccordion}>
          {calendars.map((c, i) => {
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
      </div>

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
        onClose={addEventModelToggle}
        selectedDate={date}
      />
      {/* update Event model*/}
      <UpdateEventModal
        title={"Update event"}
        event={calendarEvent}
        calendarId={calendarId}
        opened={updateEventModelOpened}
        onClose={updateEventModelToggle}
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
              <IconDotsVertical size={"16px"} />
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
