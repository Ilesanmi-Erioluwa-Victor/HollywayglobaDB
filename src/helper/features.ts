// import { Model, Prisma } from '@prisma/client';
// import { prisma } from '../configurations/db';

// type QueryParams = {
//   [key: string]: string;
// };

// class APIFeatures<T> {
//   query: Model<T>;
//   queryString: QueryParams;

//   constructor(query: Model<T>, queryString: QueryParams) {
//     this.query = query;
//     this.queryString = queryString;
//   }

//   filter(): this {
//     const queryObj = { ...this.queryString };
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];
//     excludedFields.forEach((el) => delete queryObj[el]);

//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     this.query = prisma.product.findMany({
//       where: JSON.parse(queryStr),
//     });

//     return this;
//   }

//   sort() {
//     if (this.queryString.sort) {
//       const sortBy = this.queryString.sort.split(',').join(' ');
//       this.query = prisma.product.findMany({
//         orderBy: [
//           {
//             title: 'asc',
//           },
//           {
//             category: sortBy,
//           },
//         ],
//       });
//     } else {
//       this.query = prisma.product.findMany({
//         orderBy: {
//           createdAt: 'desc',
//         },
//       });
//     }

//     return this;
//   }

//   limitFields() {
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(',').join(' ');
//       this.query = prisma.product.findMany({
//         select: {
//           yourFieldName: true,
//         },
//       });
//     } else {
//       this.query = prisma.product.findMany({
//         select: {
//           __v: false,
//         },
//       });
//     }

//     return this;
//   }

//   paginate(): this {
//        const page = parseInt(this.queryString.page || '1', 10);
//        const limit = parseInt(this.queryString.limit || '100', 10);
//        const skip = (page - 1) * limit;

//     this.query = prisma.product.findMany({
//       skip,
//       take: limit,
//     });

//     return this;
//   }
// }

// // Usage example:
// // const prisma = new PrismaClient(); // Create your Prisma client instance
// // const query: Prisma.ProductFindManyArgs = {}; // Initialize your Prisma query
// // const queryString: QueryString = req.query; // Assuming you get this from Express request
// // const features = new APIFeatures(query, queryString);
// // features.filter().sort().limitFields().paginate();
// // const result = await prisma.product.findMany(features.query);

// export default APIFeatures;
