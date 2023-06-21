import { DocumentPriority, DocumentStatus, IAttachment } from "hexa-sdk";
import { IEntityUser } from "../IEntityUser";
import { IEntityBoard } from "../IEntityBoard";

export interface ISheetResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  assignedUsers: IEntityUser[];
  attachments: IAttachment[];
  ccUsers: string[];
  createdBy: IEntityUser;
  board: IEntityBoard;
  notifyAssignedUsers: boolean;
  notifyCcUsers: boolean;
}
