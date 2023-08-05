import { RequestHandler, NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { throwError } from '../../../middlewares/error/cacheError';
import { CustomRequest } from '../../../interfaces/custom';
import { catchAsync } from '../../../helper/utils';

export const createProduct: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    
})
