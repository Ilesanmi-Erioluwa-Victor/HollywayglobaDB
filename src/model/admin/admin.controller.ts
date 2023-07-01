import { AdminModel } from "./model.admin";
import { RequestHandler, Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Jwt } from "jsonwebtoken";
import { catchAsync } from '../../utils/catchAsync'

export const signUp : RequestHandler = catchAsync(async (req : Request, res : Response, next : NextFunction) => {

    try {
          const admin = AdminModel.create({
            name: req.body.name,
            password: req.body.password,
            username: req.body.username,
          });

    } catch (error) {
        
    }
  
})