import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

const { generateToken, hashedPassword, accountVerificationToken } = Utils;
import { signupUser } from '../user.auth.interface';
export class authQuery {
  static async registerM(user: signupUser) {
    const { firstName, lastName, email, mobile, password } = user;
    const createUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLocaleLowerCase(),
        mobile,
        password: await hashedPassword(password),
      },
    });

    generateToken(createUser?.id as string);
    const tokenUser = await accountVerificationToken('user', createUser?.id);
    return tokenUser;
  }

  static async findUserMId(id: string) {
    const userId = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return userId;
  }

  static async findUserMEmail(email: string) {
    const userEmail = await prisma.user.findUnique({
      where: {
        email: email.toLocaleLowerCase(),
      },
    });

    return userEmail;
  }
}
