import { DocumentPriority, DocumentStatus, IAttachment } from "hexa-sdk";

export interface ISheetResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  assignedUsers: {
    avatar: string;
    name: string;
    email: string;
    role: string;
  }[];
  attachments: IAttachment[];
  ccUsers: string[];
  createdBy: {
    avatar: string;
    name: string;
    email: string;
    role: string;
  };
  board: {
    id: string;
    title: string;
    description: string;
    members: {
      avatar: string;
      name: string;
      email: string;
      role: string;
    }[];
    owner: {
      avatar: string;
      name: string;
      email: string;
      role: string;
    };
  };
  notifyAssignedUsers: boolean;
  notifyCcUsers: boolean;
}
