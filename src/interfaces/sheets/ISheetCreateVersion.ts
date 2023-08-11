import { ISheetProcessResponse } from "./ISheetProcessResponse";

export default interface ISheetCreateVersion {
  versionTitle: string;
  date: string;
  records: ISheetProcessResponse[];
}
