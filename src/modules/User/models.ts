import { prisma } from '../../configurations/db';

interface user {
  id: string;
  email: string;
}
export const findUser = async (user: user) => {
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
