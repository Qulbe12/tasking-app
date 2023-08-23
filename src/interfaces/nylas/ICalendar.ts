export interface ICalendar {
  name: string;
  description: string;
  location: string;
  timezone: string;
  metadata: Record<string, string>;
}
export interface ICreateMicrosoftCalendar {
  name: string;
}
