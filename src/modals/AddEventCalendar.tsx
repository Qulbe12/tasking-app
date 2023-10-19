import { Button, Group, Modal, Stack, Switch, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import React, { useEffect } from "react";
import CommonModalProps from "./CommonModalProps";
import { IEventCreate } from "../interfaces/nylas/IEventCreate";
import { useAppDispatch, useAppSelector } from "../redux/store";
import * as yup from "yup";
import { useForm, yupResolver } from "@mantine/form";
import dayjs from "dayjs";
import { createEvent, deleteEvent, updateEvent } from "../redux/api/nylasApi";
import { Event } from "react-big-calendar";
import { IconEdit, IconTrash } from "@tabler/icons";

type AddEventCalendar = {
  calendarId: string;
  event?: Event;
  selectedDate?: Date;
} & CommonModalProps;

const AddEventCalendar = ({
  title,
  opened,
  onClose,
  calendarId,
  event,
  selectedDate,
}: AddEventCalendar) => {
  const validationSchema: any = yup.object().shape({
    title: yup.string().required("Please enter title of the event"),
    calendar_id: yup.string(),
    location: yup.string().required("Please enter the location"),
    description: yup.string().required("Please enter the description"),
    busy: yup.boolean(),
    // startDate: yup.date().required("Please select start date for event"),
    // endDate: yup.date().required("Please select end date for event"),
  });
  const form = useForm({
    initialValues: {
      title: "",
      calendar_id: "",
      description: "",
      location: "",
      busy: false,
      startDate: 0,
      endDate: 0,
    },
    validate: yupResolver(validationSchema),
  });

  const { loaders } = useAppSelector((state) => state.nylas);
  const dispatch = useAppDispatch();

  useEffect(() => {
    form.values.calendar_id = calendarId;
  }, [calendarId]);

  useEffect(() => {
    if (event) {
      form.values.title = event?.resource?.title;
      form.values.description = event?.resource?.description;
      form.values.location = event?.resource?.location;
    }
  }, [event]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (values.calendar_id != "") {
            const createEventDetail: IEventCreate = {
              title: values.title,
              calendar_id: values.calendar_id,
              description: values.description,
              location: values.location,
              busy: values.busy,
              when: {
                start_time: values.startDate,
                end_time: values.endDate,
              },
            };
            await dispatch(createEvent(createEventDetail));
            form.reset();
            onClose();
          }
        })}
      >
        <Stack>
          <TextInput withAsterisk label="Event title" {...form.getInputProps("title")} />
          <TextInput withAsterisk label="Description" {...form.getInputProps("description")} />
          <TextInput withAsterisk label="Location" {...form.getInputProps("location")} />
          {/* <TimeInput withAsterisk label="Time" {...form.getInputProps("time")} maw={400} />*/}
          <DatePicker
            defaultValue={event?.start || selectedDate || new Date()}
            label="Start date"
            onChange={(e) => {
              if (!e) return;
              const startDateWithoutDatePrefix = e.toString().replace("Date ", "");
              const parsedStartDate = dayjs(startDateWithoutDatePrefix);
              // Get the Unix timestamp in seconds (number of seconds since January 1, 1970)
              form.values.startDate = parsedStartDate.unix();
            }}
          />
          <DatePicker
            defaultValue={event?.start || selectedDate || new Date()}
            label="End date"
            onChange={(e) => {
              if (!e) return;
              const endDateWithoutDatePrefix = e.toString().replace("Date ", "");
              const parsedEndDate = dayjs(endDateWithoutDatePrefix);
              // Get the Unix timestamp in seconds (number of seconds since January 1, 1970)
              form.values.endDate = parsedEndDate.unix();
            }}
          />
          <Switch label="Busy" checked={form.values.busy} {...form.getInputProps("busy")} />
          <Group position="right" mt="md">
            {title === "Update event" ? (
              <>
                <Button
                  loading={loaders.creatingEvent}
                  leftIcon={<IconTrash />}
                  color="red"
                  onClick={async () => {
                    await dispatch(deleteEvent(event?.resource?.id));
                    form.reset();
                    onClose();
                  }}
                >
                  Delete Event
                </Button>
                <Button
                  onClick={async () => {
                    const updateEventDetail: IEventCreate = {
                      title: form.values.title,
                      calendar_id: form.values.calendar_id,
                      description: form.values.description,
                      location: form.values.location,
                      busy: form.values.busy,
                      when: {
                        start_time: form.values.startDate,
                        end_time: form.values.endDate,
                      },
                    };
                    await dispatch(
                      updateEvent({ id: event?.resource?.id, data: updateEventDetail }),
                    );
                    form.reset();
                    onClose();
                  }}
                  leftIcon={<IconEdit />}
                  loading={loaders.creatingEvent}
                >
                  Update Event
                </Button>
              </>
            ) : (
              <Button loading={loaders.creatingEvent} type="submit">
                Add Event
              </Button>
            )}
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddEventCalendar;
