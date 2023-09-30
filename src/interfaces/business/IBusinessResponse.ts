import ISeatResponse from "./ISeatResponse";

interface IBusinessResponse {
  id: string;
  name: string;
  code: string;
  jobTitle: string | null;
  companyLogoUrl: string;
  availableSeats: number;
  seats: ISeatResponse[];
  invitedUsers: string[];
}

export default IBusinessResponse;
