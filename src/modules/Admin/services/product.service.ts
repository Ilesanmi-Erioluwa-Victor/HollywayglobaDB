import { RequestHandler, NextFunction, Response, Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
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
import path from 'path';
import { cloudinaryUploadImage } from '../../../configurations/cloudinary';
import sharp from 'sharp';

cloudinary.config({
  cloud_name: ENV.CLOUDIANRY.NAME,
  api_key: ENV.CLOUDIANRY.KEY,
  api_secret: ENV.CLOUDIANRY.SECRET,
});

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
      const imagePromises: Promise<string | undefined>[] = req.files.map(
        async (file: Express.Multer.File) => {
          // Resize image to 2MB using Sharp
          const resizedImage = await sharp(file.buffer)
            .resize({ fit: 'inside', width: 2000, height: 2000 })
            .toBuffer();

          return new Promise<string | undefined>((resolve) => {
            cloudinary.uploader
              .upload_stream((error, result: UploadApiResponse) => {
                if (error) {
                  console.error(error);
                  resolve(undefined);
                } else {
                  cloudinaryUploadImage(result.url as string, 'Products');
                  // console.log(result.url);
                  resolve(result.url);
                }
              })
              .end(resizedImage);
          });
        }
      );

      const imageUrls: any = await Promise.all(imagePromises);

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
