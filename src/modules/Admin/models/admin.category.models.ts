import { categoryI } from '../interfaces/admin.interface';

import { prisma } from '../../../configurations/db';

export class categoryQueries {
  static async createCategoryM(body: categoryI, adminId: string) {
    const category = await prisma.category.create({
      data: {
        name: body.name,
        adminId,
      },
    });

    return category;
  }

  static async editCategoryM(id: string, name: string) {
    const category = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
    });
    return category;
  }

  static async deleteCategoryM(id: string) {
    const category = await prisma.category.delete({
      where: {
        id,
      },
    });
    return category;
  }

  static async findCategoryIdM(id: string) {
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });
    return category;
  }
}

export const findCategoriesM = async () => {
  const category = await prisma.category.findMany();
  return category;
};
