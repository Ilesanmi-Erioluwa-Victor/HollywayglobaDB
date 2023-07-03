import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { RequestHandler, NextFunction, Request, RequestParamHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { throwError } from "../../middlewares/cacheError";
import { StatusCodes } from 'http-status-codes';

import { userModel } from "./model.user";
import { catchAsync } from "../../utils/catchAsync";

dotenv.config();

export const create_user: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await userModel.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        email : req.body.email
    })

    const exist_user = await userModel.findOne({ email: req.body.email })
    if (exist_user) throwError("You are already a member, kindly login to your account", StatusCodes.CONFLICT);
})
