import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

const { generateToken, hashedPassword, accountVerificationToken } = Utils;

export class userQuery {
  static async findUserMId(id: string) {
    const userId = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        lastName: true,
        firstName: true,
        email: true,
        mobile: true,
        isBlocked: true,
        role: true,
        profilePhoto: true,
        active: true,
        isAccountVerified: true,
        deleteRequestDate: true,
        loggedInAfterRequest: true,
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

  static async updateUserM(
    id: string,
    firstName: string,
    lastName: string,
    email: string
  ) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
        email,
      },
    });

    return user;
  }

  static async updateUserPasswordM(id: string, password: string) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        password: await hashedPassword(password),
      },
    });

    return user;
  }

  static async userProfilePictureUpdateM(id: string, profilePhoto: string) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        profilePhoto: profilePhoto,
      },
    });

    return user;
  }
}
