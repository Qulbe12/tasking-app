import { DocumentPriority, DocumentStatus } from "hexa-sdk";
import { IEntityUser } from "../IEntityUser";

export interface ISheetResponse {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  startDate: string;
  dueDate: string;
  group: string;
  ccUsers: string[];
  createdBy: IEntityUser;
  isArchived: boolean;
  versions: { title: string; version: number }[];
  tags: string[];
  thumbnail: string | null;
  currentVerion: {
    version: number;
    title: string;
  };
  latestVersion: {
    version: number;
    title: string;
  };
}
