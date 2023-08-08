import { ParamsDictionary, ParsedQs } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    params: ParamsDictionary;
    query: ParsedQs;
    body: any;
  }
}
