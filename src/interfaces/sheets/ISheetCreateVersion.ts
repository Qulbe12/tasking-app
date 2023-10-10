import { ISheetProcessResponse } from "./ISheetProcessResponse";

export default interface ISheetCreateVersion {
  versionTitle: string;
  versionDate: string;
  records: ISheetProcessResponse[];
}
