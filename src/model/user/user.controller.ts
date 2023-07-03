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
    const { first_name, last_name, password, email } = req.body;
    const user = await userModel.create({
        first_name,
        last_name,
        password,
        email
    })

    const exist_user = await userModel.findOne({ email })
    if (exist_user) throwError("You are already a member, kindly login to your account", StatusCodes.CONFLICT);
})
