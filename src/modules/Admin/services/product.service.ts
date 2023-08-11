import { RequestHandler, NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import sharp from 'sharp';
import path from 'path';

import AppError from '../../../utils';
import { ENV } from '../../../configurations/config';
import { catchAsync, ValidateMongoDbId } from '../../../helper/utils';
import {
  createProductM,
  deleteProductM,
  findProductIdM,
  getProductsM,
  editProductM,
} from '../product.models';

import { ImageProcessor } from '../../../configurations/cloudinary';

const uploader = new ImageProcessor();

export const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    if (!id)
      next(new AppError('Your ID is not valid...', StatusCodes.BAD_REQUEST));

    if (!req.files)
      next(
        new AppError(
          'Sorry, please select an image to be uploaded',
          StatusCodes.BAD_REQUEST
        )
      );

    try {
      // const {
      //   title,
      //   slug,
      //   description,
      //   price,
      //   quantity,
      //   brand,
      //   stock,
      //   colors,
      //   sold,
      //   categoryId,
      //   adminId,
      // } = req.body;

      const imageUrls: any = await uploader.processImages(req?.files as any);

      const createProduct = await createProductM(req.body, imageUrls);
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

      if(!product) 
      next(new AppError('No product record found', StatusCodes.BAD_REQUEST));
      res.json({
        status: 'Success',
        data: product,
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
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
      }
      next(error);
    }
  }
);

export const editProductAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { adminId, productId } = req?.params;

    ValidateMongoDbId(adminId);
    ValidateMongoDbId(productId);

    if (!adminId)
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));

    if (!productId)
      next(new AppError('No product record found', StatusCodes.BAD_REQUEST));

    try {
      const product = await editProductM(productId, req.body);
      res.json({
        status: 'Success',
        message: 'You have successfully updated this product',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
