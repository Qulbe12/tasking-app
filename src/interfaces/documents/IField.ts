/* eslint-disable no-unused-vars */
export enum FieldType {
  Text = "Text",
  Number = "Number",
  Checkbox = "Checkbox",
  Radio = "Radio",
  Date = "Date",
  Select = "Select",
  Multiselect = "Multiselect",
  Textarea = "Textarea",
}

export interface IField {
  auto?: boolean;
  id: string;
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  options: Array<string>;
}
