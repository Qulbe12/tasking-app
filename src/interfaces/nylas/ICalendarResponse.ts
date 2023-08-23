export interface ICalendarResponse {
  name: string;
  description: string;
  location: string;
  timezone: string;
  metadata: Record<string, string>;
  id: string;
  account_id: string;
  object: string;
  read_only: boolean;
  is_primary: boolean | null;
  hex_color: string;
}
export interface ICalendarDeleteResponse {
  job_status_id: string;
}
