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
}

export const;

export const editCategoryM = async (id: string, name: string) => {
  const category = await prisma.category.update({
    where: {
      id,
    },
    data: {
      name: name,
    },
  });
  return category;
};

export const deleteCategoryM = async (id: string) => {
  const category = await prisma.category.delete({
    where: {
      id,
    },
  });
  return category;
};

export const findCategoryIdM = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  return category;
};

export const findCategoriesM = async () => {
  const category = await prisma.category.findMany();
  return category;
};
