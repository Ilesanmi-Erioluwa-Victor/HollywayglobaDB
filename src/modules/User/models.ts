import { prisma } from '../../configurations/db';
import {
  hashedPassword,
  generateToken,
  createAccountVerificationToken,
} from '../../helper/utils';
import { address, signupUser } from './user.interface';

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

export const updateUserM = async (
  id: string,
  firstName: string,
  lastName: string,
  email: string
) => {
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
};

export const updateUserPasswordM = async (id: string, password: string) => {
  const user = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: await hashedPassword(password),
    },
  });

  return user;
};

export const accountVerificationM = async (
  id: string,
  accountVerificationToken: string,
  time: Date
) => {
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
};

export const accountVerificationUpdatedM = async (
  id: string,
  isAccountVerified: boolean,
  accountVerificationToken: string,
  accountVerificationTokenExpires: any
) => {
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
};

export const forgetPasswordTokenM = async (
  token: string,
  expirationTime: Date,
  userId: string
) => {
  const user = await prisma.passwordResetToken.create({
    data: {
      token,
      expirationTime,
      userId,
    },
  });

  return user;
};

export const resetPasswordM = async (token: string) => {
  const user = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });
  return user;
};

export const resetPasswordUpdateM = async (id: string, password: string) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      password: await hashedPassword(password),
    },
  });

  return user;
};

export const resetPasswordTokenDeleteM = async (id: string) => {
  const user = await prisma.passwordResetToken.delete({
    where: { id },
  });

  return user;
};

export const userProfilePictureUpdateM = async (
  id: string,
  profilePhoto: string
) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      profilePhoto: profilePhoto,
    },
  });

  return user;
};

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

export const userWishListM = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const wishList = await prisma.productWishList.create({
    data: {
      user: { connect: { id: userId } },
      product: { connect: { id: productId } },
      quantity: quantity,
    },
  });

  return wishList;
};
