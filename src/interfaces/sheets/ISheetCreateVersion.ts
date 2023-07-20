import { ISheetProcessResponse } from "./ISheetProcessResponse";

export default interface ISheetCreateVersion {
  versionTitle: string;
  records: ISheetProcessResponse[];
}
