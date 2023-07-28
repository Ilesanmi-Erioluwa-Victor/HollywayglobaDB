import { prisma } from '../../configurations/db';
import {
  hashedPassword,
  generateToken,
  createAccountVerificationToken,
} from '../../helper/utils';
import {  signupUser } from './user.interface';

export const createUserM = async (user: signupUser) => {
  const { firstName, lastName, email, mobile, password } = user;
  const createUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      mobile,
      password: await hashedPassword(password),
    },
  });

  generateToken(createUser?.id as string);
  const tokenUser = await createAccountVerificationToken(createUser?.id);
  return tokenUser;
};

export const findUserMId = async (id: string) => {
  const userId = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  return userId;
};

export const findUserMEmail = async (email: string) => {
  const userEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  return userEmail;
};

export const updateUser = async (id: string) => {
  
}
