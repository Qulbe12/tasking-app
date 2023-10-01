import { FieldType } from "../documents/IField";

export interface IUpdateField {
  label: string;
  type: FieldType;
  required: boolean;
  options: string[];
}
export interface ICreateField {
  label: string;
  type: FieldType;
  required: boolean;
  options: string[];
}

interface IFieldResponse {
  id: string;
  key: string;
  label: string;
  options: string[];
  required: boolean;
  type: "Text" | "Number" | "Checkbox" | "Radio" | "Date" | "Select" | "Multiselect";
}

export interface IUpdateFieldResponse {
  id: string;
  default: boolean;
  fields: IFieldResponse[];
  name: string;
}
