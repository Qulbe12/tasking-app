import { IEventResponse } from "./IEventResponse";

export interface ICalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: IEventResponse;
}
