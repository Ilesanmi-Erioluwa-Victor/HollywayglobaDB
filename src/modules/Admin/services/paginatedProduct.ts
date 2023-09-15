import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { getProductsM } from '../models/admin.product.models';
const prisma = new PrismaClient();

async function getPaginatedProducts(
  req: Request,
  res: { paginatedResult: any } & Response,
  next: NextFunction
) {
  try {
    const query = req.query;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const search = query.q as string;
    const price = parseFloat(query.price as string);
    const category = query.category as string;
    const brand = query.brand as string;

    const where: any = {};

    if (search) {
      where['title'] = {
        contains: search as string,
        mode: 'insensitive',
      };
    }

    if (!isNaN(price)) {
      where['price'] = {
        gte: price,
        lte: price,
      };
    }

    if (category) {
      where['category'] = {
        name: category,
      };
    }

    if (brand) {
      where['brand'] = brand;
    }

    const totalCount = await prisma.product.count({ where });
    const totalPage = Math.ceil(totalCount / limit);
    const currentPage = page || 0;

    switch (true) {
      case page < 0 || limit < 1:
        return res.status(400).json('Page value should not be negative');

      case startIndex < totalCount:
        const paginateData = await getProductsM(limit, startIndex, where);

        const result = {
          totalCount: totalCount,
          totalPage: totalPage,
          currentPage: currentPage,
          next:
            endIndex < totalCount
              ? {
                  page: page + 1,
                  limit: limit,
                }
              : undefined,
          paginateData: paginateData,
          currentCountPerPage: paginateData.length,
          range: currentPage * limit,
          previous:
            startIndex > 0
              ? {
                  page: page - 1,
                  limit: limit,
                }
              : undefined,
          last:
            page === totalPage
              ? {
                  page: totalPage,
                  limit: limit,
                }
              : undefined,
        };

        res.status(200).json(result);
        break;

      default:
        return res.status(404).json({ error: 'Resource not found' });
    }
  } catch (error: any) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

export { getPaginatedProducts };
