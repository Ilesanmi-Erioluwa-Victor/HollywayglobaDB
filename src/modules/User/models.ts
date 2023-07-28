import { prisma } from '../../configurations/db';
import { hashedPassword } from '../../helper/utils';
import { findUserI } from './user.interface';
hashedPassword

export const findUser = async (user: findUserI) => {
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

export const createUser = async (user) => {
  await prisma.user.create({
    data: {
      
    }
  })
};
