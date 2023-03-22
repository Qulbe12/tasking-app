export interface IEmailResponse {
  account_id: string;
  bcc: string[];
  body: string;
  cc: string[];
  date: number;
  events: [];
  files: [];
  folder: {
    display_name: string;
    id: string;
    name: "sent";
  };
  from: {
    email: string;
    name: string;
  }[];
  id: string;
  object: "message";
  reply_to: string[];
  reply_to_message_id: string | null;
  snippet: string;
  starred: boolean;
  subject: string;
  thread_id: string;
  to: {
    email: string;
    name: string;
  }[];
  unread: boolean;
}

export interface IEmailThreadResponse {
  account_id: string;
  draft_ids: [];
  first_message_timestamp: number;
  folders: {
    display_name: string;
    id: string;
    name: "inbox" | "permanent_trash" | "sent" | "trash";
  }[];
  has_attachments: boolean;
  id: string;
  last_message_received_timestamp: number;
  last_message_sent_timestamp: number;
  last_message_timestamp: number;
  last_updated_timestamp: number;
  message_ids: string[];
  object: "thread";
  participants: {
    email: string;
    name: string;
  }[];
  snippet: string;
  starred: boolean;
  subject: string;
  unread: boolean;
  version: number;
}
