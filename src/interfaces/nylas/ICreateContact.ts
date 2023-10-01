import { IEmail, ImAddress, IPhone, IPhysicalAddress, IWebPage } from "./IContact";

export interface ICreateContact {
  birthday: string | null;
  company_name: string | null;
  emails: IEmail[];
  given_name: string;
  im_addresses: ImAddress[];
  job_title: string | null;
  manager_name: string | null;
  middle_name: string | null;
  nickname: string | null;
  notes: string | null;
  office_location: string | null;
  phone_numbers: IPhone[];
  physical_addresses: IPhysicalAddress[];
  suffix: string | null;
  surname: string | null;
  web_pages: IWebPage[];
  group: string;
}
