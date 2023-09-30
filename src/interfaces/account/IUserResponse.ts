import IBusiness from "./IBusiness";

export interface IUser {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: string;
  subscription:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "past_due"
    | "unpaid"
    | "active"
    | "canceled"
    | "unsubscribed";
  business: IBusiness;
}

interface IUserResponse {
  accessToken: string;
  user: IUser;
}

export default IUserResponse;
