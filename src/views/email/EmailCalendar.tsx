import React, {useEffect, useState} from "react";
import {Calendar as CalendarComponent, dayjsLocalizer} from "react-big-calendar";
import dayjs from "dayjs";

import "react-big-calendar/lib/css/react-big-calendar.css";
// import { IEmailThreadResponse } from "../../interfaces/IEmailResponse";
import {Accordion, Button, Flex, Group, Modal, Stack, Switch, TextInput} from "@mantine/core";
import {IconCalendar, IconList} from "@tabler/icons";
import {useAppDispatch, useAppSelector} from "../../redux/store";
import {createCalendar, createEvent, getAllCalendars, getEvents} from "../../redux/api/nylasApi";
import {DatePicker} from "@mantine/dates";
import {useDisclosure} from "@mantine/hooks";
import {ICalendar} from "../../interfaces/nylas/ICalendar";
import {IEventCreate} from "../../interfaces/nylas/IEventCreate";


const localizer = dayjsLocalizer(dayjs);

type EmailCalendarProps = {
    onActionButtonClick: () => void;
};

const EmailCalendar = ({onActionButtonClick}: EmailCalendarProps) => {

    const {calendars, calendar, events} = useAppSelector((state) => state.nylas);
    useEffect(() => {
        dispatch(getAllCalendars());
        dispatch(getEvents())
        console.log(calendars)
    }, []);

    const dispatch = useAppDispatch();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [date, setDate] = useState<Date | null>(null)
    const [opened, {open: openCalendarModel, close: closeCalendarModel}] = useDisclosure(false);
    const [checked, setChecked] = useState(false);
    const [eventModelOpened, {open: openEventModel, close: closeEventModel}] = useDisclosure(false);
    const [newCalendar, setNewCalendar] = useState<ICalendar>({
        name: "",
        description: "",
        location: "",
        timezone: ""
    })
    const [calendarId, setCalendarId] = useState("")
    const [event, setEvent] = useState<IEventCreate>({
        title: "",
        calendar_id: calendarId,
        visibility: "",
        description: "",
        location: "",
        busy: false
    })


    const addCalendar = () => {
        dispatch(createCalendar(newCalendar))
        closeCalendarModel()
        console.log(calendar)
    }
    const addEvent = () => {
        if (event.calendar_id != null) {
            dispatch(createEvent(event))
            closeEventModel()
        }
        console.log(calendar)
    }

    const onChangeAccordion = (value: string) => {
        setEvent({...event, calendar_id: value})
        console.log(value)
    }


    return (
        <div>
            {dayjs(selectedDate).format("MM")}
            <Group position="right" my="md">
                <Button onClick={onActionButtonClick} leftIcon={<IconList/>}>
                    Emails
                </Button>
            </Group>
            <Flex justify="space-between" h="100vh">

                {/* <Button*/}
                {/*  onClick={() => {*/}
                {/*    dispatch(getCalendars());*/}
                {/*  }}*/}
                {/* >*/}
                {/*  Get Cals*/}
                {/* </Button>*/}
                <CalendarComponent
                    localizer={localizer}
                    onSelectSlot={(e) => {
                        setSelectedDate(e.start);
                        if (e.action === "doubleClick") {
                            console.log(e.start);
                            openEventModel()
                        }
                    }}
                    selectable
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: "82%", width: "84%"}}
                   
                />
                <div style={{width: "15%"}}>
                    <DatePicker
                        label="Calendar"
                        // value={new Date()}
                        onChange={(e) => {
                            if (!e) return;
                            setDate(e);
                            console.log(e)
                        }}
                    />
                    <Button onClick={openCalendarModel} leftIcon={<IconCalendar/>} my="md">
                        Add calendar
                    </Button>
                    <Accordion chevron={""} defaultValue="customization" onChange={onChangeAccordion}>
                        {calendars.map((c, i) => {
                            return (
                                <Accordion.Item key={i} value={c.id}>
                                    <Accordion.Control>{c.name}</Accordion.Control>
                                    <Accordion.Panel>{c.description}</Accordion.Panel>
                                </Accordion.Item>
                            )
                        })}
                    </Accordion>
                </div>
            </Flex>
            {/* Add calendar model*/}
            <Modal opened={opened} onClose={closeCalendarModel} title="Add calendar">
                <Stack>
                    <TextInput withAsterisk label="Calendar name" onChange={(e) => {
                        setNewCalendar({...newCalendar, name: e.target.value})
                    }}/>
                    <TextInput withAsterisk label="Description" onChange={(e) => {
                        setNewCalendar({...newCalendar, description: e.target.value})
                    }}/>
                    <TextInput withAsterisk label="Location" onChange={(e) => {
                        setNewCalendar({...newCalendar, location: e.target.value})
                    }}/>
                    <TextInput withAsterisk label="Time zone" onChange={(e) => {
                        setNewCalendar({...newCalendar, timezone: e.target.value})
                    }}/>
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
                    <TextInput withAsterisk label="Event title" onChange={(e) => {
                        setEvent({...event, title: e.target.value})
                    }}/>
                    <TextInput withAsterisk label="Visibility" value={"private"} onChange={(e) => {
                        setEvent({...event, visibility: e.target.value})
                    }}/>
                    <TextInput withAsterisk label="Description" onChange={(e) => {
                        setEvent({...event, description: e.target.value})
                    }}/>
                    <TextInput withAsterisk label="Location" onChange={(e) => {
                        setEvent({...event, location: e.target.value})
                    }}/>
                    <Switch label="Busy" checked={checked} onChange={(event) => {
                        setChecked(event.currentTarget.checked)
                        console.log(event.currentTarget.checked)
                    }}/>
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
