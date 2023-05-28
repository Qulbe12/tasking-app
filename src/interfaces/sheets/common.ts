export interface ISubFile {
  id: string;
  name: string;
  url: string;
}

export interface IAttachment {
  id: string;
  name: string;
  subFiles: ISubFile[];
}
