import { categoryI, signupAdmin } from './admin.interface';
import { prisma } from '../../configurations/db';
import { createProductI } from './product.interface';

export const findProductIdM = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  return product;
};

export const createProductM = async (productI: createProductI) => {
  const {
    title,
    slug,
    description,
    price,
    quantity,
    images,
    stock,
    colors,
    categoryId,
  } = productI;
  const product = await prisma.product.create({
    data: {
      title,
      slug,
      description,
      price,
      quantity,
      images,
      stock,
      colors,
      categoryId,
    },
  });
  return product;
};
