import { prisma } from '../../../configurations/db';

export class productQuery {
  static async TopCheapProductM() {
    const product = await prisma.product.findMany({
      take: 10,
      orderBy: {
        price: 'asc',
      },
      select: {
        reviews: {
          select: {
            id: true,
            rating: true,
            text: true,
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        id: true,
        images: true,
        title: true,
        price: true,
        stock: true,
        colors: true,
        brand: true,
      },
    });
    return product;
  }

  static async ProductsM() {
    const products = await prisma.product.findMany({
      select: {
        reviews: {
          select: {
            id: true,
            rating: true,
            text: true,
            user: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        id: true,
        images: true,
        title: true,
        price: true,
        stock: true,
        colors: true,
        brand: true,
      },
    });
    return products;
  }

  static async findProductId(id: string) {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    return product;
  }
}
