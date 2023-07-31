import IBusiness from "./IBusiness";

interface IUserResponse {
  accessToken: string;
  user: {
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
  };
}

export default IUserResponse;
