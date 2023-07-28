import { prisma } from '../../configurations/db';
import { hashedPassword, generateToken, createAccountVerificationToken } from '../../helper/utils';
import { sendMail } from '../../templates/sendMail';
import { findUserI, signupUser } from './user.interface';

export const findUserM = async (user: findUserI) => {
  const { id, email } = user;
  if (id) {
    return await prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  if (email) {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
};

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
