import { DocumentPriority, DocumentStatus } from "hexa-sdk";
import { ISheetProcessResponse } from "./ISheetProcessResponse";

export interface ISheetCreate {
  title: string;
  description: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  startDate: string;
  dueDate: string;
  records: ISheetProcessResponse[];
}
