import { prisma } from '../../configurations/db';
import {
    hashedPassword,
    generatePasswordResetToken,
  generateToken,
  createAccountVerificationTokenAdmin,
} from '../../helper/utils';

export const findAdminIdM = async (id: string) => {
    const adminId = await prisma.admin.findUnique({
        where: {
        id
    }
    })
    return adminId;
}

export const findAdminEmailM = async (email: string) => {
  const userEmail = await prisma.admin.findUnique({
    where: {
      email,
    },
  });

  return userEmail;
};

export const createAdminM = async (admin: signupUser) => {
  const { name email, password } = user;
  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashedPassword(password),
    },
  });

  generateToken(createUser?.id as string);
  const tokenUser = await createAccountVerificationToken(createUser?.id);
  return tokenUser;
};
