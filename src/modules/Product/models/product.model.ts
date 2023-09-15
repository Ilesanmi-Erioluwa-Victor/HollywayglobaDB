import { prisma } from '../../../configurations/db';

export class productQueries {
  static async TopCheapProduct() {
    const product = await prisma.product.findMany({
      take: 10,
      orderBy: {
        price: 'asc',
      },
    });
    return product;
  }
}
