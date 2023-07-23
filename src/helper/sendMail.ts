import nodemailer from 'nodemailer';
import { RequestHandler, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface User {
  firstName: string;
  lastName: string;
  email: string;
  accountVerificationToken: string;
}

export const sendMail = (
  data: User,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {  accountVerificationToken, firstName, lastName, email } = data;
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
  )}/api/v1/users/verify_account/${ accountVerificationToken}>Click to verify..</a>
       `;

  const mailOptions = {
    from: 'HollwayGlobalIncLimited@gmail.com',
    to: `${email}`,
    subject: 'Account Verification ',
    text: `Hey ${lastName} - ${firstName}, it’s our first message sent with Nodemailer 😉 `,
    html: resetUrl,
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.json(resetUrl);
  });
};
