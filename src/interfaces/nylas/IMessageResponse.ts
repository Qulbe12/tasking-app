interface IParticipant {
  comment: string | null;
  email: string;
  name: string;
  phone_number: string | null;
  status: "yes" | "no" | "maybe" | "noreply";
}

interface IEvent {
  account_id: string;
  busy: boolean;
  calendar_id: string;
  description: string;
  id: string;
  location: string;
  message_id: string;
  object: "event";
  owner: string;
  participants: IParticipant[];
  read_only: boolean;
  reminders: null;
  status: string;
  title: string;
  visibility: string | null;
  when: {
    end_time: number;
    object: "timespan";
    start_time: number;
  };
}

interface IFile {
  content_disposition: string;
  content_type: string;
  filename: string | null;
  id: string;
  size: number;
}

interface IFromTo {
  email: string;
  name: string;
}

interface ILabel {
  display_name: string;
  id: string;
  name: string;
}

export interface IMessageResponse {
  account_id: string;
  bcc: [];
  body: string;
  cc: [];
  date: number;
  events: IEvent[];
  files: IFile[];
  from: IFromTo[];
  id: string;
  labels: ILabel[];
  object: "message";
  reply_to: IFromTo[];
  snippet: string;
  starred: boolean;
  subject: string;
  thread_id: string;
  to: IFromTo[];
  unread: boolean;
  cids: string[];
}

export interface IMessageExpandedResponse extends IMessageResponse {
  headers: {
    "In-Reply-To": string | null;
    "Message-Id": string;
    References: string[];
  };
}
