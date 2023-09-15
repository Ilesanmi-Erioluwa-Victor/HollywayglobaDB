import { prisma } from '../../../configurations/db';

export class productQueries {
  static async TopCheapProduct() {
    const product = await prisma.product.findMany({
      take: 10,
      orderBy: {
        price: 'asc',
        },
        select: {
            reviews: {select:{id: true, rating: true, text: true}},
            id: true,
            images: true,
            title: true,
            price: true,
            stock: true,

      }
    });
    return product;
  }
}
