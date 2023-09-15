import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPaginatedProducts(
  req: Request,
  res: { paginatedResult: any } & Response,
  next: NextFunction
) {
  try {
    const query = req.query;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 2;
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

    const totalCount = await prisma.product.count({ where }); // Apply the where condition
    const totalPage = Math.ceil(totalCount / limit);
    const currentPage = page || 0;

    switch (true) {
      case page < 0 || limit < 1:
        return res.status(400).json('Page value should not be negative');

      case startIndex < totalCount:
        const paginateData = await prisma.product.findMany({
          take: limit,
          skip: startIndex,
          orderBy: {
            id: 'desc',
          },
          where,
        });

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

      //   case page === 1 && !last_page:
      //     result.totalCount = totalCount;
      //     result.totalPage = totalPage;
      //     result.currentPage = currentPage;
      //     if (totalCount > limit) {
      //       result.next = {
      //         page: page + 1,
      //         limit: limit,
      //       };
      //     }
      //     result.paginateData = await productsQuery;
      //     res.paginatedResult = result;
      //     result.currentCountPerPage = Object.keys(result.paginateData).length;
      //     result.range = currentPage * limit;
      //     return res.status(200).json(result);

      //   case endIndex < totalCount && !last_page:
      //     result.totalCount = totalCount;
      //     result.totalPage = totalPage;
      //     result.currentPage = currentPage;
      //     if (endIndex < totalCount - 1) {
      //       result.next = {
      //         page: page + 1,
      //         limit: limit,
      //       };
      //     }
      //     result.paginateData = await productsQuery;
      //     res.paginatedResult = result;
      //     result.currentCountPerPage = Object.keys(result.paginateData).length;
      //     result.range = currentPage * limit;
      //     return res.status(200).json(result);

      //   case startIndex > 0 && !last_page:
      //     result.totalCount = totalCount;
      //     result.totalPage = totalPage;
      //     result.currentPage = currentPage;
      //     result.previous = {
      //       page: page - 1,
      //       limit: limit,
      //     };
      //     result.paginateData = await productsQuery;
      //     res.paginatedResult = result;
      //     result.currentCountPerPage = Object.keys(result.paginateData).length;
      //     result.range = currentPage * limit;
      //     return res.status(200).json(result);

      //   case last_page === 'true' && page === totalPage:
      // result.totalCount = totalCount;
      // result.totalPage = totalPage;
      // result.currentPage = totalPage;
      // result.last = {
      //   page: totalPage,
      //   limit: limit,
      // };
      // result.paginateData = await productsQuery;
      // res.paginatedResult = result;
      // result.currentCountPerPage = Object.keys(result.paginateData).length;
      // result.range = totalCount;
      // return res.status(200).json(result);

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
