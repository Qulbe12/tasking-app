export interface IEmailResponse {
  account_id: string;
  body: string;
  date: number;
  folder: {
    display_name: string;
    id: string;
    name: string;
  };
  from: {
    email: string;
    name: string;
  }[];
  id: string;
  object: string;
  snippet: string;
  subject: string;
  to: {
    email: string;
    name: string;
  }[];
}
