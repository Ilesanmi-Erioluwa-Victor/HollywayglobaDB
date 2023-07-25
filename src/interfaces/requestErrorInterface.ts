export interface requestErrorInterface {
  name: string;
  errors: { message: string }[];
  message: string;
  statusCode: number;
}

export interface Error {
  message?: string;
  statusCode?: number;
  captureStackTrace? : any;
}
