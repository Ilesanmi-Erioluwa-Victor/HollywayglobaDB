import { RequestHandler, NextFunction, Response, Request } from 'express';

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

    const createProduct = await createProductM(req.body,req.user.userId, imageUrls);

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
    if (req.files || req.file)
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
    if (!req.file)
      throw new BadRequestError('select at least an image to upload');

    const product = await editProductImagesM(
      req.params.productId,
      await uploader.processImages(req?.files as any)
    );

    if (!product)
      throw new BadRequestError('something went wrong, try again ...');

    res.json({
      status: 'success',
      message: 'you have successfully updated this product images',
    });
  }
);
