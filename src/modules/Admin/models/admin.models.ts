import { categoryI, signupAdmin } from '../interfaces/admin.interface';
import { prisma } from '../../../configurations/db';
import { Utils } from '../../../helper/utils';

const { accountVerificationToken, generateToken, hashedPassword } = Utils;

export const findAdminIdM = async (id: string) => {
  const adminId = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return adminId;
};

export const findAdminEmailM = async (email: string) => {
  const userEmail = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  return userEmail;
};

export const createAdminM = async (admin: signupAdmin) => {
  const { name, email, password } = admin;
  const createAdmin = await prisma.admin.create({
    data: {
      name,
      email,
      password: await hashedPassword(password),
    },
  });

  generateToken(createAdmin?.id as string);
  const tokenAdmin = await accountVerificationToken('admin', createAdmin?.id);
  return tokenAdmin;
};

export const getUsersAdminM = async () => {
  const users = await prisma.user.findMany();
  return users;
};

export const accountVerificationAdminM = async (
  id: string,
  accountVerificationToken: string,
  time: Date
) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id,
      accountVerificationToken,
      accountVerificationTokenExpires: {
        gt: time,
      },
    },
  });

  return admin;
};

export const accountVerificationUpdatedAdminM = async (
  id: string,
  isAccountVerified: boolean,
  accountVerificationToken: string,
  accountVerificationTokenExpires: any
) => {
  const admin = await prisma.admin.update({
    where: {
      id,
    },
    data: {
      isAccountVerified,
      accountVerificationToken,
      accountVerificationTokenExpires,
    },
  });

  return admin;
};

export const createCategoryM = async (body: categoryI, adminId: string) => {
  const category = await prisma.category.create({
    data: {
      name: body.name,
      adminId,
    },
  });

  return category;
};

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
