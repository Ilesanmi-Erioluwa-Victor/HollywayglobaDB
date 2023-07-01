import { Request, Response, NextFunction } from "express";

module.exports = (fn: any) => {
  return (req:Request, res:Response, next: NextFunction) => {
    fn(req, res, next).catch((err:any) => next(err));
  };
};
