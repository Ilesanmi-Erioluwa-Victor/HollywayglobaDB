import nodemailer from 'nodemailer';
import { prisma } from '../config/prisma';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountVerificationToken: any;
}

export const sendMail = async (
  data: User,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const user = await prisma.user.findUnique({})
  const { accountVerificationToken, firstName, lastName, email } = data;
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${process.env.NODEMAILER_USERNAME}`,
      pass: `${process.env.NODEMAILER_PASS}`,
    },
  });

  const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/verify_account/${accountVerificationToken}>Click to verify..</a>
       `;

  const mailOptions = {
    from: 'HollwayGlobalIncLimited@gmail.com',
    to: `${email}`,
    subject: 'Account Verification ',
    text: `Hey ${lastName} - ${firstName}, Please verify your account by clicking the link below: 😉 `,
    html: resetUrl,
  };

  await transport.sendMail(mailOptions);
};

interface userInfo {
  email?: string;
  token: string;
  userId?: string;
}
export const sendUserToken = async (
  data: userInfo,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(data);
  const user = await prisma.user.findUnique({
    where: {
      id: data?.userId,
    },
  });

  console.log(user);
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${process.env.NODEMAILER_USERNAME}`,
      pass: `${process.env.NODEMAILER_PASS}`,
    },
  });

  const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset_password/${
    data?.token
  }>Click here to reset your password..</a>
       `;

  const mailOptions = {
    from: 'HollwayGlobalIncLimited@gmail.com',
    to: `${user?.email}`,
    subject: 'Password Reset Token',
    text: `Your password reset token 😉 `,
    html: resetUrl,
  };

  await transport.sendMail(mailOptions);
};
