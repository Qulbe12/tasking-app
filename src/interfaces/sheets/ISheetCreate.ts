import { DocumentPriority, DocumentStatus } from "hexa-sdk";
import { ISheetProcessResponse } from "./ISheetProcessResponse";

export interface ISheetCreate {
  title: string;
  versionTitle: string;
  description: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  startDate: string;
  dueDate: string;
  records: ISheetProcessResponse[];
}
