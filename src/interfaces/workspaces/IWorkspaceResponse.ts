import { IEntityBoard } from "../IEntityBoard";

export interface IWorkspaceResponse {
  id: string;
  name: string;
  memberType: "Owner" | "Member";
  boards: IEntityBoard[];
  iAmOwner: boolean;
}
