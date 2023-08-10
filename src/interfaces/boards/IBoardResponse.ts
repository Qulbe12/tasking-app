import { IEntityUser } from "../IEntityUser";

interface IBoardResponse {
  id: string;
  title: string;
  description: string;
  members: IEntityUser[];
  owner: IEntityUser;
}

export default IBoardResponse;
