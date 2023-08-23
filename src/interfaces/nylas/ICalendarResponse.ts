export interface ICalendarResponse {
  name: string;
  description: string;
  location: string;
  timezone: string;
  id: string;
  account_id: string;
  object: "event";
  read_only: boolean;
  is_primary: boolean;
  hex_color: string;
}
