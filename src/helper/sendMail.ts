import nodemailer from 'nodemailer';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface User {
  email: string;
  verificationToken: string;
}


export const sendVerificationEmail = async (data: User, req: Request, res : Response, next : NextFunction) => {
  const transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: `${process.env.NODEMAILER_USERNAME}`,
      pass: `${process.env.NODEMAILER_PASS}`,
    },
  });

  const verificationLink = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/verify_account/${data?.verificationToken}`;
  const mailOptions = {
    from: 'HollwayGlobalIncLimited@gmail.com',
    to: data?.email,
    subject: 'Account Verification',
    text: 'Please verify your account by clicking the link below:',
    html: `<a href="${verificationLink}">Click to verify your account</a>`,
  };

  await transport.sendMail(mailOptions);
};
