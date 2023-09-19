import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

const { generateToken, hashedPassword, accountVerificationToken } = Utils;

export class userQueries {

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
        email: email.toLocaleLowerCase(),
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

  static async accountVerificationM(
    id: string,
    accountVerificationToken: string,
    time: Date
  ) {
    const user = await prisma.user.findUnique({
      where: {
        id,
        accountVerificationToken,
        accountVerificationTokenExpires: {
          gt: time,
        },
      },
    });

    return user;
  }

  static async accountVerificationUpdatedM(
    id: string,
    isAccountVerified: boolean,
    accountVerificationToken: string,
    accountVerificationTokenExpires: any
  ) {
    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isAccountVerified,
        accountVerificationToken,
        accountVerificationTokenExpires,
      },
    });

    return user;
  }



  static async resetPasswordM(token: string) {
    const user = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
    return user;
  }

  static async resetPasswordUpdateM(id: string, password: string) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        password: await hashedPassword(password),
      },
    });

    return user;
  }

  static async resetPasswordTokenDeleteM(id: string) {
    const user = await prisma.passwordResetToken.delete({
      where: { id },
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
