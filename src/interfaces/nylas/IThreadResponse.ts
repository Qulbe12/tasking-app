interface IFromTo {
  name: string;
  email: string;
}

export interface IThreadResponse {
  account_id: string;
  draft_ids: string[];
  first_message_timestamp: number;
  has_attachments: boolean;
  id: string;
  folders: {
    display_name: string;
    id: string;
    name: string;
  }[];
  labels: {
    display_name: string;
    id: string;
    name: string;
  }[];
  last_message_received_timestamp: number | null;
  last_message_sent_timestamp: number | null;
  last_message_timestamp: number;
  message_ids: string[];
  object: "thread";
  participants: IFromTo[];
  snippet: string;
  starred: boolean;
  subject: string;
  unread: boolean;
  version: number;
}

export interface IThreadExpandedResponse extends IThreadResponse {
  messages: {
    account_id: string;
    bcc: IFromTo[];
    cc: IFromTo[];
    date: number;
    files: {
      content_disposition: string;
      content_type: string;
      filename: string | null;
      id: string;
      size: number;
    }[];
    from: IFromTo[];
    id: string;
    labels: {
      display_name: string;
      id: string;
      name: string;
      provider_id: string;
    }[];
    object: "thread";
    reply_to: IFromTo[];
    snippet: string;
    starred: boolean;
    subject: string;
    thread_id: string;
    to: IFromTo[];
    unread: boolean;
    folders: {
      display_name: string;
      id: string;
      name: string;
    }[];
  };
}
