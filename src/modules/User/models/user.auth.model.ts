import { prisma } from '../../../configurations/db';

import { Utils } from '../../../helper/utils';

import { address, signupUser } from '../user.interface';

const { generateToken, hashedPassword, accountVerificationToken } = Utils;

export class Queries {
  static async createUserM(user: signupUser) {
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
        email,
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

  static async forgetPasswordTokenM(
    token: string,
    expirationTime: Date,
    userId: string
  ) {
    const user = await prisma.passwordResetToken.create({
      data: {
        token,
        expirationTime,
        userId,
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


export const createAddressM = async (address: address, userId: string) => {
  const userAddress = await prisma.address.create({
    data: {
      deliveryAddress: address.deliveryAddress,
      additionalInfo: address.additionalInfo,
      region: address.region,
      city: address.city,
      phone: address.phone,
      additionalPhone: address.additionalPhone,
      user: { connect: { id: userId } },
    },
  });
  return userAddress;
};

export const updateAddressM = async (id: string, data: address) => {
  const user = await prisma.address.update({
    where: {
      id,
    },
    data: {
      deliveryAddress: data.deliveryAddress,
      additionalInfo: data.additionalInfo,
      region: data.region,
      city: data.city,
      phone: data.phone,
      additionalPhone: data.additionalPhone,
    },
  });

  return user;
};

export const findUserWithAddressM = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: { address: true },
  });
  return user;
};
