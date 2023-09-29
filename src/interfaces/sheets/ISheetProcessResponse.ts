export interface ISheetProcessResponse {
  title: string;
  code: string;
  tags: string[];

  meta: {
    key: string;
    url: string;
  };
  file: {
    key: string;
    url: string;
  };
  thumbnail: {
    key: string;
    url: string;
  };
}
