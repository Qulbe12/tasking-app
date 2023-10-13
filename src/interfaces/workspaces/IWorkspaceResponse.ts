import IBoardResponse from "../boards/IBoardResponse";

export interface IWorkspaceResponse {
  id: string;
  name: string;
  memberType: "Owner" | "Member";
  boards: IBoardResponse[];
  iAmOwner: boolean;
}
