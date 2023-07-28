import { prisma } from '../../configurations/db';
import {  findUserI } from './user.interface';

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
