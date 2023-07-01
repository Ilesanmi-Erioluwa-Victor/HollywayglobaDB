import { AdminModel } from "./model.admin";
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { Jwt } from "jsonwebtoken";
import { catchAsync } from '../../utils/catchAsync'

export const signUp : RequestHandler = catchAsync(async (params:type) => {
    
})