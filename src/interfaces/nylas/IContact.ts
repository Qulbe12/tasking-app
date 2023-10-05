export interface ImAddress {
  type: string;
  im_address: "talk" | "aim" | "yahoo" | "lync" | "skype" | "qq" | "msn" | "icc" | "jabber";
}

export interface IEmail {
  email: string;
  type: "work" | "personal" | "other";
}

export interface IPhone {
  number: string;
  type:
    | "business"
    | "home"
    | "mobile"
    | "page"
    | "business_fax"
    | "home_fax"
    | "organization_main"
    | "assistant"
    | "radio"
    | "other";
}

export interface IWebPage {
  type: "profile" | "blog" | "homepage" | "work";
  url: string;
}

export interface IPhysicalAddress {
  format: string;
  type: string;
  street_address: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}

export interface IGroup {
  id: string;
  object: string;
  account_id: string;
  name: string;
  path: string;
}

export interface IContact {
  id: string;
  account_id: string;
  birthday: string | null;
  company_name: string | null;
  emails: IEmail[];
  given_name: string;
  groups: IGroup[];
  im_addresses: ImAddress[];
  job_title: string | null;
  manager_name: string | null;
  middle_name: string | null;
  nickname: string | null;
  notes: string | null;
  object: "event" | "calendar" | "contact" | "file" | "message" | "label";
  office_location: string | null;
  phone_numbers: IPhone[];
  physical_addresses: IPhysicalAddress[];
  picture_url: string;
  source: "address_book" | "inbox";
  suffix: string | null;
  surname: string | null;
  web_pages: IWebPage[];
}
