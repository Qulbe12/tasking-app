import { IEntityUser } from "../IEntityUser";

interface ISeatResponse {
  id: string;
  user: IEntityUser;
  subscription: string;
}

export default ISeatResponse;
