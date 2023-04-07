export interface IErrorResponse extends Error {
  response?: {
    data: {
      message: string;
    };
  };
  request?: any;
}
