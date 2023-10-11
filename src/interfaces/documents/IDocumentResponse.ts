/* eslint-disable no-unused-vars */
import { ITemplate } from "hexa-sdk/dist/app.api";
import { IUser } from "../account/IUserResponse";

export interface IAttachment {
  id: string;
  url: string;
  name: string;
  type: string;
}

export type DocumentUsers = "ccUsers" | "assignedUsers";

export declare enum DocumentStatus {
  Todo = "Todo",
  Complete = "Complete",
  InProgresss = "In Progress",
}

export declare enum DocumentPriority {
  Low = "Low",
  High = "High",
  Urgent = "Urgent",
}

export interface IDocumentQuery {
  page?: number;
  status?: DocumentStatus;
  priority?: DocumentPriority;
  title?: string;
  type?: string;
  dueDate?: Date;
  startDate?: Date;
  emailId?: string;
}

export interface IDocumentResponse extends Record<string, any> {
  id: string;
  type: string;
  title: string;
  description: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  dueDate: Date;
  startDate: Date;
  archived: boolean;
  attachments: IAttachment[];
  assignedUsers: IUser[];
  ccUsers: string[];
  template: ITemplate;
  linkedDocs: string[];
  createdBy: IUser;
  created: string;
  linkedEmailIds: string[];
}
