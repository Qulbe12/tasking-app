interface IEmail {
  email: string;
  type: string;
}

interface ImAddress {
  type: string;
  im_address: string;
}

interface INumber {
  number: string;
  type: string;
}

interface IPhysicalAddress {
  format: string;
  type: string;
  street_address: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}

interface IGroup {
  id: string;
  object: "contact_group";
  account_id: string;
  name: string;
  path: string;
}

export interface IContactResponse {
  birthday: string;
  company_name: string;
  emails: IEmail[];
  given_name: string;
  im_addresses: ImAddress[];
  job_title: string;
  manager_name: string;
  middle_name: string;
  nickname: string;
  notes: string;
  office_location: string;
  phone_numbers: INumber[];
  physical_addresses: IPhysicalAddress[];
  suffix: string;
  surname: string;
  account_id: string;
  id: string;
  object: string;
  picture_url: string;
  groups: IGroup[];
  source: string;
}

export interface IContactRemapped {
  id: string;
  email: string;
  name: string;
}
