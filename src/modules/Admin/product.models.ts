import { data } from './../../data';
import { categoryI, signupAdmin } from './admin.interface';
import { prisma } from '../../configurations/db';
import { createProductI, editProductI } from './product.interface';

export const findProductIdM = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    select: {
      price: true,
      id: true,
      images: true,
      title: true,
      slug: true,
      colors: true,
      quantity: true,
    },
  });
  return product;
};

export const createProductM = async (
  productI: createProductI,
  data: string[]
) => {
  const {
    title,
    slug,
    description,
    price,
    quantity,
    images,
    stock,
    colors,
    brand,
    categoryId,
    adminId,
  } = productI;
  const product = await prisma.product.create({
    data: {
      title,
      slug,
      description,
      price,
      quantity,
      brand,
      images: data,
      stock,
      colors,
      categoryId,
      adminId,
    },
  });
  return product;
};

export const getProductsM = async () => {
  const product = await prisma.product.findMany();
  return product;
};

export const deleteProductM = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  return product;
};

export const editProductM = async (id: string, data: editProductI) => {
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      // images: string[];
      stock: data.stock,
      brand: data.brand,
      colors: data.colors,
    },
  });
  return product;
};

export const editProductImagesM = async (id: string, data: string[]) => {
  const product = await prisma.product.update({
    where: {
      id,
    },
    data: {
      images: data,
    },
  });
  return product;
};
