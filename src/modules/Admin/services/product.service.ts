import { RequestHandler, NextFunction, Response, Request } from 'express';

import { StatusCodes } from 'http-status-codes';

import AppError from '../../../utils';

import { Utils } from '../../../helper/utils';

import {
  createProductM,
  deleteProductM,
  findProductIdM,
  getProductsM,
  editProductM,
  editProductImagesM,
} from '../models/admin.product.models';

const { catchAsync, ValidateMongoDbId } = Utils;

import { ImageProcessor } from '../../../configurations/cloudinary';
import { prisma } from '../../../configurations/db';

const uploader = new ImageProcessor();

export const createProduct: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req?.params;
    ValidateMongoDbId(id);
    if (!id)
      next(new AppError('Your ID is not valid...', StatusCodes.BAD_REQUEST));

    if (!req.files || req.files.length === 0)
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
  async (
    req: Request,
    res: { paginatedResult: any } & Response,
    next: NextFunction
  ) => {
    const { id } = req?.params;

    ValidateMongoDbId(id);

    if (!id)
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));

    // const products = await getProductsM();

    // if (!products)
    //   next(new AppError('No products record found', StatusCodes.BAD_REQUEST));
    // const results = await prisma.product.findMany({
    //   skip: 1,
    //   take: 10,
    //   where: {
    //     title: {
    //       contains: 'CHIVITA',
    //     },
    //   },
    //   orderBy: {
    //     title : "asc"
    //   }
    // });

    // res.json({
    //   length: results.length,
    //   status: 'Success',
    //   data: results,
    // });

    try {
      const query = req.query;
      const page = parseInt(query.page as string) || 1;
      const limit = parseInt(query.limit as string) || 2;
      const last_page = req.query.last_page;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const search = req.query.q;
      const result: {
        totalCount: number;
        totalPage: number;
        currentPage: number;
        next: any;
        paginateData: any;
        currentCountPerPage: any;
        range: any;
        previous: any;
        last: any;
      } = {
        totalCount: 0,
        totalPage: 0,
        currentPage: 0,
        next: undefined,
        paginateData: undefined,
        currentCountPerPage: undefined,
        range: undefined,
        previous: undefined,
        last: undefined,
      };
      const totalCount = await prisma.product.count();
      const totalPage = Math.ceil(totalCount / limit);
      const currentPage = page || 0;

      if (page < 0 || limit < 1) {
        return res.status(400).json('Page value should not be negative');
      } else if (page === 1 && !last_page) {
        result.totalCount = totalCount;
        result.totalPage = totalPage;
        result.currentPage = currentPage;
        result.next = {
          page: page + 1,
          limit: limit,
        };
        result.paginateData = await prisma.product.findMany({
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc',
          },
        });
        res.paginatedResult = result;
        result.currentCountPerPage = Object.keys(result.paginateData).length;
        result.range = currentPage * limit;
        return res.status(200).json(result);
      } else if (endIndex < totalCount && !last_page) {
        result.totalCount = totalCount;
        result.totalPage = totalPage;
        result.currentPage = currentPage;
        result.next = {
          page: page + 1,
          limit: limit,
        };
        result.paginateData = await prisma.product.findMany({
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc',
          },
        });
        res.paginatedResult = result;
        result.currentCountPerPage = Object.keys(result.paginateData).length;
        result.range = currentPage * limit;
        return res.status(200).json(result);
      } else if (startIndex > 0 && !last_page) {
        result.totalCount = totalCount;
        result.totalPage = totalPage;
        result.currentPage = currentPage;
        result.previous = {
          page: page - 1,
          limit: limit,
        };
        result.paginateData = await prisma.product.findMany({
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc',
          },
        });
        res.paginatedResult = result;
        result.currentCountPerPage = Object.keys(result.paginateData).length;
        result.range = currentPage * limit;
        return res.status(200).json(result);
      } else if (last_page === 'true' && page === totalPage) {
        result.totalCount = totalCount;
        result.totalPage = totalPage;
        result.currentPage = totalPage;
        result.last = {
          page: totalPage,
          limit: limit,
        };
        result.paginateData = await prisma.product.findMany({
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc',
          },
        });
        res.paginatedResult = result;
        result.currentCountPerPage = Object.keys(result.paginateData).length;
        result.range = totalCount;
        return res.status(200).json(result);
      } else {
        return res.status(404).json({ error: 'Resource not found' });
      }
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

      if (!product)
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
    const { id, productId } = req?.params;

    ValidateMongoDbId(id);
    ValidateMongoDbId(productId);

    if (!id)
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));

    if (!productId)
      next(new AppError('No product record found', StatusCodes.BAD_REQUEST));

    if (!req.files)
      next(
        new AppError(
          'Sorry, please select an image to be uploaded',
          StatusCodes.BAD_REQUEST
        )
      );

    try {
      const product = await editProductM(productId, req.body);

      if (!product)
        next(new AppError('No product record found', StatusCodes.BAD_REQUEST));

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
      next(new AppError('No Admin record found', StatusCodes.BAD_REQUEST));

    if (!productId)
      next(new AppError('No product record found', StatusCodes.BAD_REQUEST));

    try {
      const product = await editProductImagesM(
        productId,
        await uploader.processImages(req?.files as any)
      );

      if (!product)
        next(new AppError('No product record found', StatusCodes.BAD_REQUEST));

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

export const TopTenProducts: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log();
    } catch (error: any) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  }
);
