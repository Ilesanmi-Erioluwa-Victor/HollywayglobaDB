import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { throwError } from "../../middlewares/cacheError";
import { StatusCodes } from 'http-status-codes';

import { userModel } from "./model.user";

dotenv.config();
