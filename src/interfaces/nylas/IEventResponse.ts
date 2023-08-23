interface IParticipant {
  name: string;
  email: string;
  status: string;
  comment: string;
}

interface IWhen {
  start_time: number;
  end_time: number;
}

interface IConferencing {
  provider: "WebEx";
  details: {
    password: string;
    pin: string;
    url: string;
  };
}

interface IRecurrence {
  rrule: [string, string];
  timezone: string;
}

interface INotification {
  type: "email";
  minutes_before_event: string;
  body: string;
  subject: string;
}

export interface IEventResponse {
  busy: boolean;
  description: string;
  location: string;
  participants: IParticipant[];
  title: string;
  when: IWhen;
  conferencing: IConferencing;
  recurrence: IRecurrence;
  metadata: Record<string, unknown>;
  notifications: INotification[];
  account_id: string;
  ical_uid: string;
  id: string;
  job_status_id: string;
  read_only: boolean;
  message_id: string;
  original_start_time: number;
  object: string;
  owners: string;
  status: string;
  calendar_id: string;
  visibility: string;
}
