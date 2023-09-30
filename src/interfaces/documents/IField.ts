/* eslint-disable no-unused-vars */
export declare enum FieldType {
  Text = "Text",
  Number = "Number",
  Checkbox = "Checkbox",
  Radio = "Radio",
  Date = "Date",
  Select = "Select",
  Multiselect = "Multiselect",
}

export interface IField {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
  options: Array<string>;
}
