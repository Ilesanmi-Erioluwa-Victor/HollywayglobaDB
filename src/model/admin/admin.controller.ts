import { AdminModel } from "./model.admin";
import { RequestHandler, Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Jwt } from "jsonwebtoken";
import { catchAsync } from '../../utils/catchAsync'
import { throwError } from "../../middlewares/cacheError";
import crypto from "node:crypto"

export const signUp : RequestHandler = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
       const { email } = req.body;

       let salt = `${process.env.CRYPTO}`;

    try {
        if(await AdminModel?.emailTaken(email)) {
            throwError("You are already an admin, please,kindly log into your account", StatusCodes.CONFLICT)
        }
          const admin = AdminModel.create({
            name: req.body.name,
            password: req.body.password,
            username: req.body.username,
          });


          res.status(201).json({
            message : "admin account created successfully"
          })
    } catch (error : any) {
        next(error)
    }
  
})