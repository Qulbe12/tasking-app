export interface IErrorResponse extends Error {
  response?: {
    status: number;
    data: {
      message: string;
    };
  };
  request?: any;
}
