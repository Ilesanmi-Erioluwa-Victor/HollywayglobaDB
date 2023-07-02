import crypto from "node:crypto";
import { AdminModel } from "./model.admin";
import { RequestHandler, Response, Request, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { catchAsync } from '../../utils/catchAsync'
import { throwError } from "../../middlewares/cacheError";

export const signUp : RequestHandler = catchAsync(async (req : Request, res : Response, next : NextFunction) => {
       const { email } = req.body;

    try {
        if(await AdminModel?.emailTaken(email)) throwError("You are already an admin, please,kindly log into your account", StatusCodes.CONFLICT)

          const admin = AdminModel.create({
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
          });


          res.status(201).json({
            message : "admin account created successfully",
            status :"Success"
          })
    } catch (error : any) {
        next(error)
    }
})

export const login : RequestHandler = catchAsync( async (req : Request, res : Response, next : NextFunction) =>{
  const { email, password } = req.body;
  try {

     const userFound = await AdminModel.findOne({ email: email });

    //  if (userFound && (await userFound.isPasswordMatched(password))) {
    //    res.json({
    //     //  _id: userFound?._id,
    //     //  firstName: userFound?.firstName,
    //     //  lastName: userFound?.lastName,
    //     //  email: userFound?.email,
    //     //  profilePhoto: userFound?.profilePhoto,
    //     //  isAdmin: userFound?.isAdmin,
    //     //  token: generateToken(userFound?._id),
    //    });
    //  } else {
    //    res.status(401);
    //    throw new Error(`Login Failed, invalid credentials..`);
    //  }
    
  } catch (error) {
    
  }
})