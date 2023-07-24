export interface ISheetProcessResponse {
  code: string;
  tags: string[];
  codeMeta: {
    key: string;
    url: string;
  };
  pageMeta: {
    key: string;
    url: string;
  };
  pdfFile: {
    key: string;
    url: string;
  };
  thumbnail: {
    key: string;
    url: string;
  };
}
