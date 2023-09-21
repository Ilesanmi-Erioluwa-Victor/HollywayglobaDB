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
  Forbidden,
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
    await getPaginatedProducts(req, res, next);
  }
);

export const getProductAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await findProductIdM(req.params.productId);

    if (!product) throw new NotFoundError('no product found ...');

    res.json({
      status: 'Success',
      data: product,
    });
  }
);

export const deleteProductAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = await deleteProductM(req.params.productId);

    if (!product) throw new BadRequestError('something went wrong ...');
    res.json({
      status: 'success',
      message: 'you have successfully deleted this product',
    });
  }
);

export const editProductAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.files)
      throw new Forbidden(
        "sorry, you can't edit product image with this endpoint"
      );

    const product = await editProductM(req.params.productId, req.body);

    if (!product) throw new NotFoundError('no product found');

    res.json({
      status: 'success',
      message: 'you have successfully updated this product',
    });
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
