import { IEntityUser } from "../IEntityUser";

interface IBoardResponse {
  id: string;
  title: string;
  description: string;
  members: string[];
  owner: IEntityUser;
}

export default IBoardResponse;
