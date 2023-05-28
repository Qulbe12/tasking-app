import { FileWithPath } from "@mantine/dropzone";
import { DocumentPriority, DocumentStatus } from "hexa-sdk";

export interface ISheetCreate {
  title: string;
  description: string;
  status: DocumentStatus;
  priority: DocumentPriority;
  startDate: string;
  dueDate: string;
  files: FileWithPath[];
}
