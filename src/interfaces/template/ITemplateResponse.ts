import { IField } from "../documents/IField";

export interface ITemplateResponse {
  id: string;
  name: string;
  fields: IField[];
  default: boolean;
}
