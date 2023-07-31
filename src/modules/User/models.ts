import { prisma } from '../../configurations/db';
import {
  hashedPassword,
  generateToken,
  createAccountVerificationToken,
} from '../../helper/utils';
import { signupUser } from './user.interface';

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

export const userProfilePictureUpdateM = async (id: string, profilePhoto : string) => {
  const user = await prisma.user.update({
    where: { id },
    data: {
      profilePhoto: profilePhoto,
    },
  });

  return user;
};

export const createAddressM = async (id: string,) => {
  
}
