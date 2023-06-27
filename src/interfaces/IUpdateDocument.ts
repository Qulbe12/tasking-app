import { DocumentPriority, DocumentStatus } from "hexa-sdk";

export interface IUpdateDocument {
  title: string;
  description: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  dueDate: string;
  startDate: string;
  notifyUsers?: {
    ccUsers: {
      notify: boolean;
      exclude: string[];
    };
    assignedUsers: {
      notify: boolean;
      exclude: string[];
    };
  };
}
