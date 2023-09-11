import { RequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { throwError } from '../../../middlewares/error';

import { Utils } from '../../../helper/utils';

import { CustomRequest } from '../../../interfaces/custom';

const { catchAsync, ValidateMongoDbId } = Utils;
