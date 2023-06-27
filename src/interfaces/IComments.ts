import { IEntityUser } from "./IEntityUser";

export interface ICommentCreate {
  body: string;
}

export interface ICommentResponse {
  id: string;
  body: string;
  user: IEntityUser;
  date: string;
}
