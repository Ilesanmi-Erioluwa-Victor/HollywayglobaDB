import { RequestHandler, NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../../utils';
import { CustomRequest } from '../../../interfaces/custom';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import {
  createProductM,
  deleteProductM,
  findProductIdM,
  getProductsM,
} from '../product.models';
import { PrismaClient, Prisma } from '@prisma/client';

export const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    if (!id)
      next(new AppError('Your ID is not valid...', StatusCodes.BAD_REQUEST));
    try {
      const {
        title,
        slug,
        description,
        price,
        quantity,
        // images,
        brand,
        stock,
        colors,
        sold,
        categoryId,
        adminId,
      } = req.body;
      const createProduct = await createProductM(req.body);
      res.json({
        status: 'Success',
        data: createProduct,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getProductsAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    if (!id)
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
    try {
      const products = await getProductsM();
      res.json({
        length: products.length,
        status: 'Success',
        data: products,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);

export const getProductAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, productId } = req?.params;
    ValidateMongoDbId(id);
    ValidateMongoDbId(productId);
    if (!id)
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
    if (!productId)
      next(new AppError('No product record found', StatusCodes.BAD_REQUEST));
    try {
      const product = await findProductIdM(productId);
      res.json({
        status: 'Success',
        data: product,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
        return;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          next(
            new AppError('Invalid Id or try again', StatusCodes.BAD_REQUEST)
          );
        }

        next(error);
      }
    }
  }
);

export const deleteProductAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, productId } = req?.params;
    ValidateMongoDbId(id);
    ValidateMongoDbId(productId);
    if (!id)
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));
    if (!productId)
      next(new AppError('No product record found', StatusCodes.BAD_REQUEST));
    try {
      const product = await deleteProductM(productId);
      res.json({
        status: 'Success',
        message: 'You have successfully deleted this product',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
        return;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          next(
            new AppError('Invalid Id or try again', StatusCodes.BAD_REQUEST)
          );
        }

        next(error);
      }
    }
  }
);
