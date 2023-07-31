import ISeatResponse from "./ISeatResponse";

interface IBusinessResponse {
  name: string;
  code: string;
  availableSeats: number;
  seats: ISeatResponse[];
  invitedUsers: string[];
}

export default IBusinessResponse;
