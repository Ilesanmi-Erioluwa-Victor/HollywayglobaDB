import { NextFunction, Response, Request } from 'express';

import { Utils } from '../../../helper/utils';

import { NotFoundError } from '../../../errors/customError';

const { catchAsync } = Utils;

export const getOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
