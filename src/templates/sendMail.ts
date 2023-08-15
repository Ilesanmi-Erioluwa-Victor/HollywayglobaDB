import nodemailer from 'nodemailer';
import { prisma } from '../configurations/db';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import { ENV } from '../configurations/config';
import { findUserMId } from '../modules/User/models/user.auth.model';
import { findAdminIdM } from '../modules/Admin/models';
interface User {
  id: string;
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
  const { accountVerificationToken, firstName, lastName, email, id } = data;
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${ENV.NODEMAILER.USERNAME}`,
      pass: `${ENV.NODEMAILER.PASSWORD}`,
    },
  });

  const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/${id}/verify_account/${accountVerificationToken}>Click to verify..</a>
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
  const user = await findUserMId(data?.userId as string)

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${ENV.NODEMAILER.USERNAME}`,
      pass: `${ENV.NODEMAILER.PASSWORD}`,
    },
  });

  const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
    'host'
  )}/api/v1/user/reset_password/${
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

interface Admin {
  id: string;
  name: string;
  email: string;
  accountVerificationToken : any
}

export const sendMailAdmin = async (
  data: Admin,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { accountVerificationToken, name, email, id} = data;
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${ENV.NODEMAILER.USERNAME}`,
      pass: `${ENV.NODEMAILER.PASSWORD}`,
    },
  });

  const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
    'host'
  )}/api/v1/admin/${id}/verify_account/${accountVerificationToken}>Click to verify..</a>
       `;

  const mailOptions = {
    from: 'HollwayGlobalIncLimited@gmail.com',
    to: `${email}`,
    subject: 'Account Verification ',
    text: `Hey ${name}, Please verify your account by clicking the link below: 😉 `,
    html: resetUrl,
  };

  await transport.sendMail(mailOptions);
};

interface adminInfo {
  email?: string;
  token: string;
  id?: string;
}

export const sendAdminToken = async (
  data: adminInfo,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(data)
  const admin = await findAdminIdM(data?.id as string);

  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${ENV.NODEMAILER.USERNAME}`,
      pass: `${ENV.NODEMAILER.PASSWORD}`,
    },
  });

  const resetUrl = `Kindly use this link to verify your account...
        <a href= ${req.protocol}://${req.get(
    'host'
  )}/api/v1/admin/reset_password/${
    data?.token
  }>Click here to reset your password..</a>
       `;

  const mailOptions = {
    from: 'HollwayGlobalIncLimited@gmail.com',
    to: `${admin?.email}`,
    subject: 'Password Reset Token',
    text: `Your password reset token 😉 `,
    html: resetUrl,
  };

  await transport.sendMail(mailOptions);
};
