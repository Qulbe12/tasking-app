import { IEntityUser } from "./IEntityUser";

export interface IEntityBoard {
  id: string;
  title: string;
  description: string;
  members: IEntityUser[];
  owner: IEntityUser;
}
