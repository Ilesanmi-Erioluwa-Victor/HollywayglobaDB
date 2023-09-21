import { RequestHandler, NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import { getPaginatedProducts } from './paginatedProduct';

import { Utils } from '../../../helper/utils';

import {
  createProductM,
  deleteProductM,
  findProductIdM,
  editProductM,
  editProductImagesM,
} from '../models/admin.product.models';

import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
} from '../../../errors/customError';

const { catchAsync } = Utils;

import { ImageProcessor } from '../../../configurations/cloudinary';

const uploader = new ImageProcessor();

export const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || req.files.length === 0)
      throw new BadRequestError(
        'please select at least an image to be uploaded'
      );

    const imageUrls: any = await uploader.processImages(req?.files as any);

    const createProduct = await createProductM(req.body, imageUrls);

    res.json({
      status: 'success',
      message: 'you have successfully created product',
    });
  }
);

export const getProductsAdmin: RequestHandler = catchAsync(
  async (
    req: Request,
    res: { paginatedResult: any } & Response,
    next: NextFunction
  ) => {
    const { id } = req?.params;

    ValidateMongoDbId(id);

    if (!id)
      return throwError('No Admin record found', StatusCodes.BAD_REQUEST);
    try {
      await getPaginatedProducts(req, res, next);
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
      return throwError('No Admin record found', StatusCodes.BAD_REQUEST);
    if (!productId)
      return throwError('No product record found', StatusCodes.BAD_REQUEST);

    try {
      const product = await findProductIdM(productId);

      if (!product)
        throwError('No product record found', StatusCodes.BAD_REQUEST);

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

    if (!id) throwError('No Admin record found', StatusCodes.BAD_REQUEST);

    if (!productId)
      throwError('No product record found', StatusCodes.BAD_REQUEST);

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
    const { id, productId } = req?.params;

    ValidateMongoDbId(id);
    ValidateMongoDbId(productId);

    if (!id)
      return throwError('No Admin record found', StatusCodes.BAD_REQUEST);

    if (!productId)
      return throwError('No product record found', StatusCodes.BAD_REQUEST);

    if (!req.files)
      return throwError(
        'Sorry, please select an image to be uploaded',
        StatusCodes.BAD_REQUEST
      );

    try {
      const product = await editProductM(productId, req.body);

      if (!product)
        return throwError('No product record found', StatusCodes.BAD_REQUEST);

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

export const editProductImagesAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id, productId } = req?.params;

    ValidateMongoDbId(id);
    ValidateMongoDbId(productId);

    if (!id)
      return throwError('No Admin record found', StatusCodes.BAD_REQUEST);

    if (!productId)
      return throwError('No product record found', StatusCodes.BAD_REQUEST);

    try {
      const product = await editProductImagesM(
        productId,
        await uploader.processImages(req?.files as any)
      );

      if (!product)
        return throwError('No product record found', StatusCodes.BAD_REQUEST);

      res.json({
        status: 'Success',
        message: 'You have successfully updated this product images',
      });
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
