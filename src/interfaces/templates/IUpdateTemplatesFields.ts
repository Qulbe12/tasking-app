export interface IUpdateField {
  label: string;
  type: string;
  required: boolean;
  options: string[];
}

interface IFieldResponse {
  id: string;
  key: string;
  label: string;
  options: string[];
  required: boolean;
  type: string;
}

export interface IUpdateFieldResponse {
  is: string;
  default: boolean;
  fields: IFieldResponse[];
  name: string;
}
