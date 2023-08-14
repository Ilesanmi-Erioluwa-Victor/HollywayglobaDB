import { Prisma } from '@prisma/client';

type QueryString = {
  page?: string;
  sort?: string;
  limit?: string;
  fields?: string;
  title?: string;
  category?: string[];
  price?: number;
  // Add more query parameters if needed
};

class APIFeatures {
  constructor(
    private query: Prisma.ProductFindManyArgs,
    private queryString: QueryString
  ) {}

  // filter(): this {
  //   const queryObj = { ...this.queryString };
  //   const excludedFields = ['page', 'sort', 'limit', 'fields'];
  //   excludedFields.forEach((el) => delete queryObj[el as keyof QueryString]);

  //   let queryStr = JSON.stringify(queryObj);
  //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  //   const prismaQuery: Prisma.ProductWhereInput = {
  //     AND: [
        
  //       { price: queryObj.price },
  //       {}
  //     ],
  //   };

  //   this.query.where = prismaQuery;

  //   return this;
  // }

  sort(): this {
    if (this.queryString.sort) {
      // Adapt and set the orderBy option of the Prisma query
      this.query.orderBy = {
        // Construct your Prisma orderBy object based on this.queryString.sort
        price: "asc",
        category : ""
      };
    } else {
      // Default sorting
      this.query.orderBy = {
        createdAt: 'asc',
      };
    }

    return this;
  }

  limitFields(): this {
    if (this.queryString.fields) {
      this.query.select = {
        // Construct your Prisma select fields based on this.queryString.fields
      };
    }

    return this;
  }

  paginate(): this {
    const page = this.queryString.page ? parseInt(this.queryString.page) : 1;
    const limit = this.queryString.limit
      ? parseInt(this.queryString.limit)
      : 100;
    const skip = (page - 1) * limit;

    // Adapt the skip and take options of the Prisma query
    this.query.skip = skip;
    this.query.take = limit;

    return this;
  }
}

// Usage example:
// const prisma = new PrismaClient(); // Create your Prisma client instance
// const query: Prisma.ProductFindManyArgs = {}; // Initialize your Prisma query
// const queryString: QueryString = req.query; // Assuming you get this from Express request
// const features = new APIFeatures(query, queryString);
// features.filter().sort().limitFields().paginate();
// const result = await prisma.product.findMany(features.query);

export default APIFeatures;
