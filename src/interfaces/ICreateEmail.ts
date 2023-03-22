export interface ICreateEmail {
  to: { name: string; email: string }[];
  subject: string;
  body: string;
}
