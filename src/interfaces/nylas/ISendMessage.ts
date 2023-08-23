interface IFromTo {
  name: string;
  email: string;
}

export interface ISendMessage {
  subject?: string;
  body: string;
  to: IFromTo[];
  from?: IFromTo[];
  cc?: IFromTo[];
  bcc?: IFromTo[];
  reply_to?: IFromTo[];
  reply_to_message_id?: string;
  file_ids?: string[];
  metadata?: Record<string, string>;
}
