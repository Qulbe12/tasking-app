import { IEntityUser } from "../IEntityUser";

interface IVersion {
  title: string;
  version: number;
}

export interface ISheetDetailedResponse {
  id: string;
  title: string;
  description: string;
  startDate: string;
  dueDate: string;
  ccUsers: string[];
  createdBy: IEntityUser;
  isArchived: false;
  versions: IVersion[];
  currentVerion: IVersion;
  latestVersion: IVersion;
  records: {
    id: string;
    date: string;
    code: string;
    meta: {
      code: {
        key: string;
        url: string;
      };
      summary: {
        key: string;
        url: string;
      };
    };
    file: {
      key: string;
      url: string;
    };
    thumbnail: {
      key: string;
      url: string;
    };
    version: number;
    versions: number[];
  }[];
}
